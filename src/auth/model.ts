import { type } from "arktype";
import { UnwrapSchema } from "elysia";


export const AuthModel = {
    loginInput: type({
        phone: "/^1\\d{10}$/",
        password: "string"
    }),
    registerInput: type({
        phone: "string",
        email: "string.email",
        password: "string",
        captcha: "string"
    }),
    loginResponse: type({
        id: "string",
        token: "string"
    })
} as const

export type AuthModel = {
    [k in keyof typeof AuthModel]: UnwrapSchema<typeof AuthModel[k]>
}