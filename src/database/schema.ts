import { integer, pgTable, timestamp, text } from "drizzle-orm/pg-core"

export const users = pgTable("users", {
  id: integer('id').primaryKey().generatedAlwaysAsIdentity(),
  username: text('username').notNull().unique(),
  email: text('email').notNull().unique(),
  passwordHash: text('password_hash').notNull(),
  role: text('role', {enum: ['admin', 'user'] }).notNull().default('user'),
  createAt: timestamp('create_at').defaultNow().notNull(),
  updateAt: timestamp('update_at').defaultNow().notNull(),
});