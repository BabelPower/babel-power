import { bigint, pgTable, primaryKey, text, timestamp, unique } from "drizzle-orm/pg-core";
import { createdAt, snowId, updatedAt, updater } from "../../index";
import { defineRelations } from "drizzle-orm";

export const userTable = pgTable("user", {
    ...snowId,
    username: text("username").notNull(),
    phone: text("phone").notNull(),
    password: text("password").notNull(),
    email: text("email").notNull(),
    avatar: text("avatar"),
    registeredAt: timestamp("registeredAt", { mode: 'date', withTimezone: true }).notNull(),
    ...updater,
    ...updatedAt
}, (t) => [
    unique("unique_phone_email").on(t.phone, t.email)
])

export const roleTable = pgTable("role", {
    ...snowId,
    code: text("code").notNull().unique('unique_code'),
    name: text("name").notNull(),
    ...createdAt,
})

export const userRoleMapping = pgTable("user_role_mapping", {
    userId: bigint('userId', { mode: 'bigint' }).notNull().references(() => userTable.id),
    roleId: bigint('roleId', { mode: 'bigint' }).notNull().references(() => roleTable.id),
}, (t) => [primaryKey({ columns: [t.userId, t.roleId] })])

export const relations = defineRelations({ userTable, roleTable, userRoleMapping }, (r) => ({
    userTable: {
        role: r.many.roleTable({
            from: r.userTable.id.through(r.userRoleMapping.userId),
            to: r.roleTable.id.through(r.userRoleMapping.roleId)
        }),
    },
    roleTable: {
        participant: r.many.userTable(),
    }
}))