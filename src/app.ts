import fastify from "fastify";
import authController from "./modules/auth/auth.controller";
import authPlugin from "./plugins/auth";
import errorHandlerPlugin from "./plugins/errorHandler";
import sensible from '@fastify/sensible';

export function buildApp() {
  const app = fastify({
    logger: true
  })

  app.register(sensible)
  app.register(errorHandlerPlugin)
  app.register(authPlugin)
  app.register(authController, { prefix: '/api/auth' })
  
  return app
}