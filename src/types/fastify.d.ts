import type { JwtPayload } from "./payload";

// for Type purpose 
declare module '@fastify/jwt' {
  interface jwt {
    payload: JwtPayload
    user: JwtPayload
  }
}