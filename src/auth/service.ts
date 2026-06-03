import { AuthModel } from "./model"
import { prisma } from "../db"
import { Snowflake } from "@timondev/snowflakes"
import {
    CAPTCHA_TTL_MS,
    CAPTCHA_TTL_SECONDS,
    publishCaptchaMail,
} from "../middleware/mq"
import { redis } from "../middleware/redis"
import { logger } from "../middleware/logger"

export abstract class AuthService {
    /**
     * 登录
     * @param phone 手机号
     * @param password 密码
     */
    static async login({ phone, password }: AuthModel["loginInput"]) {
        const one = await prisma.user.findFirst({
            where: { phone },
            select: { id: true, password: true },
        })

        if (!one) {
            throw new Error("account or password is incorrect")
        }

        const ok = await Bun.password.verify(password, one.password, "bcrypt")

        if (!ok) {
            throw new Error("account or password is incorrect")
        }

        return {
            id: one.id.toString(),
        }
    }

    /**
     * 注册
     * @param phone 手机号
     * @param email 邮箱
     * @param password 密码
     * @param captcha 邮箱验证码
     */
    static async register({
        phone,
        email,
        password,
        captcha,
    }: AuthModel["registerInput"]) {
        const captchaCache = await redis.get(`captcha:${email}`)
        if (!captchaCache || captchaCache !== captcha) {
            throw new Error("captcha is incorrect")
        }
        const existing = await prisma.user.findFirst({
            where: { phone },
        })
        if (existing) {
            throw new Error("User already exists")
        }
        const hashedPassword = await Bun.password.hash(password, "bcrypt")
        await prisma.user.create({
            data: {
                id: Snowflake.generate(),
                username: phone,
                phone,
                password: hashedPassword,
                email,
                registeredAt: new Date(),
            },
        })
    }

    /**
     * 获取邮箱验证码
     * @param email 邮箱
     */
    static async getCaptcha(email: string) {
        const captcha = crypto.randomUUID().slice(0, 6)
        const cacheKey = `captcha:${email}`

        await redis.set(cacheKey, captcha, "EX", CAPTCHA_TTL_SECONDS)

        const title = "<h1>Elysian-oven 验证码</h1>"
        const body = `<p>您的验证码是：<strong>${captcha}</strong></p>`
        const footer = "<p>有效期 3 分钟，请尽快使用。</p>"

        try {
            await publishCaptchaMail({
                to: email,
                subject: "Elysian-oven 验证码",
                html: title + body + footer,
                expiresAt: Date.now() + CAPTCHA_TTL_MS,
            })
        } catch (error) {
            await redis.del(cacheKey)
            logger.error({ error }, "发送验证码异常")
            throw error
        }
    }
}
