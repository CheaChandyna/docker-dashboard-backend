import fastify from "fastify";

export function buildApp() {
  const app = fastify({
    logger: true
  })

  return app
}