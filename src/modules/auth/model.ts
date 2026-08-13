import { type } from "arktype"
import { UnwrapSchema } from "elysia"

export const AuthModel = {
    loginInput: type({
        phone: "/^1\\d{10}$/",
        password: "string <= 16",
    }),
    loginResponse: type({
        id: "string",
        token: "string",
    }),
    registerInput: type({
        phone: "string == 11",
        email: "string.email",
        password: "string <= 16",
        captcha: "string == 6",
    }),
} as const

export type AuthModel = {
    [k in keyof typeof AuthModel]: UnwrapSchema<(typeof AuthModel)[k]>
}
