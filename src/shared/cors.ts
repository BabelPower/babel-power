const methods = ["GET", "POST", "PUT", "DELETE", "PATCH", "OPTIONS"]

const headers = ["Authorization", "Content-Type"]

export const corsConfig = {
    methods: methods,
    allowedHeaders: headers,
    maxAge: 3600,
}
