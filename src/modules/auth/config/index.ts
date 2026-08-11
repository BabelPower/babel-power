export type PublicRoute = {
    method: string
    path: string
    match?: "exact" | "prefix"
}

export const publicRoutes: PublicRoute[] = [
    { method: "ALL", path: "/auth", match: "prefix" },
]

export const isPublicRoute = (method: string, path: string) =>
    publicRoutes.some((route) => {
        if (route.method !== "ALL" && route.method !== method) {
            return false
        }

        if (route.match === "prefix") {
            return path.startsWith(route.path)
        }

        return path === route.path
    })
