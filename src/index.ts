import { Elysia } from "elysia";
import openapi from "@elysia/openapi";
import { authController } from "./auth";
import { userController } from "./user";
import { authPlugin } from "./auth/plugin";
import { startMailListener } from "./middleware/mq/listener/mail";

startMailListener();

const app = new Elysia()
    .use(openapi())
    .use(authPlugin)
    .use(authController)
    .use(userController)
    .listen(3000);
