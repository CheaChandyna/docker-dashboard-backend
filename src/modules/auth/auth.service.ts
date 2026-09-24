import { compare, genSalt, hash } from "bcrypt-ts";
import { db } from "../../database/db";
import { users } from "../../database/schema";
import { eq } from "drizzle-orm";

export const createUser = async (username: string, email: string, password: string) => {
  const salt = await genSalt(12)
  const passwordHash = await hash(password, salt)

  // insert sigupdata to db
  const [user] = await db
    .insert(users)
    .values({ username, email, passwordHash,})
    .returning({ id: users.id, username: users.username, email: users.email, role: users.role })
  return user
}

export const findByUsername = async (username: string) => {
  // find if username exist
  // select "username",from "users" where "users"."username" = param_username;
  const [user] = await db.select().from(users).where(eq(users.username, username))
  return user
}

export const findByEmail = async (email: string) => {
  const [user] = await db.select().from(users).where(eq(users.email, email))
  return user
}

export const compareUser = async (email: string, password: string) => {
  const user = await findByEmail(email)
  if (!user) return null

  const founded = await compare(password, user.passwordHash)
  return founded ? user : null
}