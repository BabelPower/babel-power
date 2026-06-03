import { Elysia } from "elysia"
import { authPlugin } from "../auth/plugin"

export const userController = new Elysia({ prefix: "/user" })
    .use(authPlugin)
    .get("/me", ({ currentUser }) => ({ currentUser }))
