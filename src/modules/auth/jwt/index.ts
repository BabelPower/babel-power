import jwt from "@elysia/jwt"

export const authJwtPlugin = jwt({
    name: "authJwt",
    secret: process.env.JWT_SECRET ?? "babel-power",
})
