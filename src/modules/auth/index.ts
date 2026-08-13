import { Elysia, status } from "elysia"
import { AuthService } from "./service.ts"
import { AuthModel } from "./model.ts"
import { authJwtPlugin } from "./jwt"

export const authController = new Elysia({ prefix: "/auth" })
    .use(authJwtPlugin)
    .post(
        "/login",
        {
            body: AuthModel.loginInput,
            response: {
                200: AuthModel.loginResponse,
            },
            detail: {
                summary: "登录接口",
            },
        },
        async ({ body, authJwt }) => {
            const user = await AuthService.login(body)

            return {
                id: user.id,
                token: await authJwt.sign({ id: user.id }),
            }
        },
    )
    .get("/captcha", {}, async ({ query: { email } }) => {
        if (email) {
            await AuthService.getCaptcha(email)
            return status(200)
        }
    })
    .post(
        "/register",
        {
            body: AuthModel.registerInput,
            detail: {
                summary: "注册接口",
            },
        },
        async ({ body }) => {
            await AuthService.register(body)
            return status(200)
        },
    )
