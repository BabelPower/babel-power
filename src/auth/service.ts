import { AuthModel } from "./model";
import { userTable } from "../db/schema/user";
import { eq } from "drizzle-orm";
import { db } from "../db";
import { redis } from "../middleware/redis";
import { Snowflake } from "@timondev/snowflakes";
import { CAPTCHA_TTL_MS, CAPTCHA_TTL_SECONDS, publishCaptchaMail } from "../middleware/mq";

export abstract class AuthService {
    /**
     * 登录
     * @param phone 手机号
     * @param password 密码
     */
    static async login({ phone, password }: AuthModel["loginInput"]) {
        const one = await db
            .select({
                id: userTable.id,
                password: userTable.password
            })
            .from(userTable)
            .where(eq(userTable.phone, phone))
            .limit(1)
            .then(rows => rows[0] ?? null)

        if (!one) {
            throw new Error("account or password is incorrect");
        }

        const ok = await Bun.password.verify(password, one.password, "bcrypt")

        if (!ok) {
            throw new Error("account or password is incorrect");
        }

        return {
            id: one.id.toString()
        }
    }

    /**
     * 注册
     * @param phone 手机号
     * @param email 邮箱
     * @param password 密码
     * @param captcha 邮箱验证码
     */
    static async register({ phone, email, password, captcha }: AuthModel["registerInput"]) {
        const captchaCache = await redis.get(`captcha:${ email }`)
        if (!captchaCache || captchaCache !== captcha) {
            throw new Error("captcha is incorrect")
        }
        const one = await db.select({ id: userTable.id })
            .from(userTable)
            .where(eq(userTable.phone, phone))
            .then(rows => rows[0] ?? null)
        if (one) {
            throw new Error("User already exists")
        }
        const hashedPassword = await Bun.password.hash(password, "bcrypt")
        await db.insert(userTable).values({
            id: Snowflake.generate(),
            username: phone,
            phone,
            password: hashedPassword,
            email,
            registeredAt: new Date(),
        })
    }

    /**
     * 获取邮箱验证码
     * @param email 邮箱
     */
    static async getCaptcha(email: string) {
        const captcha = crypto.randomUUID().slice(0, 6);
        const cacheKey = `captcha:${ email }`;

        await redis.set(cacheKey, captcha, {
            expiration: {
                type: 'EX',
                value: CAPTCHA_TTL_SECONDS
            }
        })

        const title = '<h1>Elysian-oven 验证码</h1>';
        const body = `<p>您的验证码是：<strong>${ captcha }</strong></p>`;
        const footer = '<p>有效期 3 分钟，请尽快使用。</p>';

        try {
            await publishCaptchaMail({
                to: email,
                subject: "Elysian-oven 验证码",
                html: title + body + footer,
                expiresAt: Date.now() + CAPTCHA_TTL_MS
            })
        } catch (error) {
            await redis.del(cacheKey)
            throw error
        }
    }
}
