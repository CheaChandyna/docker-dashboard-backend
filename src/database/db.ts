import { DataSource } from "typeorm";
import "dotenv/config"
import { User } from "../modules/user/user.entity";

function requireEnv(name: string): string {
  const value = process.env[name]
  if (value === undefined) throw new Error(`Missing env var: ${name}`)
  return value
}

const db = new DataSource({
  type: "postgres",
  host: requireEnv("DB_HOST"),
  port: Number(requireEnv("DB_PORT")),
  username: requireEnv("DB_USER"),
  password: requireEnv("DB_PASSWORD"),
  database: requireEnv("DB_NAME"),
  synchronize: true,
  // logging: true,
  entities: [User],
  subscribers: [],
  migrations: [],
})

export default db;