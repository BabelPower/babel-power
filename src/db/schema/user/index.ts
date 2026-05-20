import { bigint, pgTable, primaryKey, text, timestamp, unique } from "drizzle-orm/pg-core";
import { createdAt, snowId, updatedAt, updater } from "../../index";
import { defineRelations } from "drizzle-orm";

export const userTable = pgTable("user", {
    ...snowId,
    username: text().notNull(),
    phone: text().notNull().unique("unique_phone"),
    password: text().notNull(),
    email: text().notNull(),
    avatar: text(),
    registeredAt: timestamp({ mode: 'date', withTimezone: true }).notNull(),
    ...updater,
    ...updatedAt
})

export const roleTable = pgTable("role", {
    ...snowId,
    code: text().notNull().unique('unique_code'),
    name: text().notNull(),
    ...createdAt,
})

export const userRoleMapping = pgTable("user_role_mapping", {
    userId: bigint({ mode: 'bigint' }).notNull().references(() => userTable.id),
    roleId: bigint({ mode: 'bigint' }).notNull().references(() => roleTable.id),
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