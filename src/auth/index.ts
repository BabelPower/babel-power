import { Elysia, status } from "elysia";
import { AuthService } from "./service";
import { AuthModel } from "./model";
import { authJwtPlugin } from "./jwt";

export const authController = new Elysia({ prefix: "/auth" })
    .use(authJwtPlugin)
    .post("/login", async ({ body, authJwt }) => {
        const user = await AuthService.login(body);

        return {
            id: user.id,
            token: await authJwt.sign({ id: user.id })
        };
    }, {
        body: AuthModel.loginInput,
        response: {
            200: AuthModel.loginResponse
        }
    })
    .get("/captcha", async ({ query: { email } }) => {
        await AuthService.getCaptcha(email)
        return status(202)
    })
    .post("/register", async ({ body }) => {
        return status(200)
    }, {
        body: AuthModel.registerInput
    });

