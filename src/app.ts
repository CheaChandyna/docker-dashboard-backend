import fastify from "fastify";
import authController from "./modules/auth/auth.controller";
import authPlugin from "./plugins/auth";
import sensible from "@fastify/sensible";

export function buildApp() {
  const app = fastify({
    logger: true
  })

  app.register(authPlugin)
  app.register(sensible)
  app.register(authController, { prefix: '/api/auth' })
  
  return app
}