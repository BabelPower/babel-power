import { Elysia, status } from "elysia"
import { AuthService } from "./service"
import { AuthModel } from "./model"
import { authJwtPlugin } from "./jwt"
import openapi from "@elysia/openapi"

export const authController = new Elysia({ prefix: "/auth" })
    .use(authJwtPlugin)
    .post(
        "/login",
        async ({ body, authJwt }) => {
            const user = await AuthService.login(body)

            return {
                id: user.id,
                token: await authJwt.sign({ id: user.id }),
            }
        },
        {
            body: AuthModel.loginInput,
            response: {
                200: AuthModel.loginResponse,
            },
            detail: {
                summary: "登录接口",
            },
        },
    )
    .get(
        "/captcha",
        async ({ query: { email } }) => {
            await AuthService.getCaptcha(email)
            return status(200)
        },
        {
            detail: {
                summary: "获取邮箱验证码接口",
            },
        },
    )
    .post(
        "/register",
        async ({ body }) => {
            await AuthService.register(body)
            return status(200)
        },
        {
            body: AuthModel.registerInput,
            detail: {
                summary: "注册接口",
            },
        },
    )
