import { AuthModel } from "./model";
import { userTable } from "../db/schema/user";
import { eq } from "drizzle-orm";
import { db } from "../db";

export abstract class AuthService {
    static async login({ phone, password }: AuthModel["loginInput"]) {
        const one = await db
            .select({
                id: userTable.id,
                password: userTable.password
            })
            .from(userTable)
            .where(eq(userTable.phone, phone))
            .limit(1)
            .then(rows => rows[0] ?? null)

        if (!one) {
            throw new Error("account or password is incorrect");
        }

        const ok = await Bun.password.verify(password, one.password, "bcrypt")

        if (!ok) {
            throw new Error("account or password is incorrect");
        }

        return {
            id: one.id.toString()
        }
    }

    static async register({ phone, email, password, captcha }: AuthModel["registerInput"]) {
        const one = await db.select({ id: userTable.id })
            .from(userTable)
            .where(eq(userTable.phone, phone))
            .then(rows => rows[0] ?? null)
        if (one) {
            throw new Error("User already exists")
        }
    }

    static async getCaptcha(email: string) {

    }
}
