import { Elysia } from "elysia"
import openapi from "@elysia/openapi"
import { authController } from "./auth"
import { userController } from "./user"
import { authPlugin } from "./auth/plugin"
import { startMailListener } from "./middleware/mq/listener/mail"
import { logger } from "./middleware/logger"

startMailListener().catch((err) =>
    logger.error({ err }, "mail listener failed"),
)

const app = new Elysia()
    .use(openapi())
    .use(authPlugin)
    .use(authController)
    .use(userController)
    .listen(3000)

logger.info({ port: app.server!.port }, "server started")
