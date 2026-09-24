import { fastifyPlugin } from 'fastify-plugin';
import type { FastifyRequest, FastifyReply } from 'fastify';
import jwt from '@fastify/jwt';
import 'dotenv/config'

const authPlugin = fastifyPlugin(async (app) => {
  await app.register(jwt, {
    secret: process.env.JWT_SECRET!,
  })

  app.decorate('authenticate', async(request: FastifyRequest, response: FastifyReply) => {
    try {
      await request.jwtVerify()
    } catch (error) {
      response.send(error)
    }
  })
})

export default authPlugin