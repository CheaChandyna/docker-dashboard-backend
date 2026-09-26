import { fastifyPlugin } from 'fastify-plugin';
import type { FastifyRequest, FastifyReply, FastifyPluginAsync } from 'fastify';
import jwt from '@fastify/jwt';
import 'dotenv/config'
import type { payload } from '../types/payload';

declare module '@fastify/jwt' {
  interface FastifyJWT {
    payload: payload
    user: payload
  }
}

const authPlugin: FastifyPluginAsync = async (app) => {
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
}

export default fastifyPlugin(authPlugin)