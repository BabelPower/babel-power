import { Elysia } from "elysia"
import openapi from "@elysia/openapi"
import { authController } from "./modules/auth"
import { userController } from "./modules/user"
import { authPlugin } from "./modules/auth/plugin"
import { startMailListener } from "./middleware/mq/listener/mail"
import { logger } from "./middleware/logger"
import cors from "@elysia/cors"

startMailListener().catch((err) =>
    logger.error({ err }, "mail listener failed"),
)

const app = new Elysia()
    .use(openapi())
    .use(cors())
    .use(authPlugin)
    .use(authController)
    .use(userController)
    .listen(3000)

logger.info({ port: app.server!.port }, "server started")
