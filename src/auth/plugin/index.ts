import { Elysia, status } from "elysia";
import { isPublicRoute } from "../config";
import { authJwtPlugin } from "../jwt";
import bearer from "@elysia/bearer";

export const authPlugin = new Elysia()
    .use(authJwtPlugin)
    .use(bearer())
    .resolve({ as: "global" }, async ({ authJwt, path, request, bearer }) => {
        if (isPublicRoute(request.method, path)) {
            return {
                currentUser: null
            };
        }

        const token = bearer ?? undefined;

        if (!token) {
            return status(401, "Unauthorized");
        }

        const payload = await authJwt.verify(token);

        if (!payload || typeof payload.id !== "string") {
            return status(401, "Unauthorized");
        }

        return {
            currentUser: {
                id: payload.id
            }
        };
    });
