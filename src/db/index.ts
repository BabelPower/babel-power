import 'dotenv/config';
import {drizzle} from 'drizzle-orm/node-postgres';
import {bigint, text, timestamp} from "drizzle-orm/pg-core";

export const db = drizzle({ connection: process.env.DATABASE_URL!, casing: 'snake_case' });

export const snowId = {
    id: bigint({ mode: 'bigint' }).primaryKey(),
}

export const creator = {
    createdBy: text().notNull(),
    createdById: bigint({ mode: 'bigint' }).notNull(),
}

export const createdAt = {
    createdAt: timestamp({ mode: 'date', withTimezone: true }).notNull(),
}

export const updater = {
    updatedBy: text(),
    updatedById: bigint({ mode: 'bigint' }),
}

export const updatedAt = {
    updatedAt: timestamp({ mode: 'date', withTimezone: true }),
}
