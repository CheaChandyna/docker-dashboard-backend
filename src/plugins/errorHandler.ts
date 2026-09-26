import type { FastifyError, FastifyInstance, FastifyPluginAsync, FastifyReply, FastifyRequest } from "fastify";
import { ZodError } from "zod";
import { fastifyPlugin } from 'fastify-plugin';
import { STATUS_CODES } from 'node:http';

const errorHandlePlugin: FastifyPluginAsync = async (app: FastifyInstance) => {
  app.setErrorHandler((error: FastifyError, request: FastifyRequest, response: FastifyReply) => {
    const statusCode = error.statusCode ?? 500;

    if (error instanceof ZodError) {
      return response.status(400).send({
        status: 400,
        message: 'Invalid credentials!',
        error: error.issues[0]?.message
      })
    }

    response.status(statusCode).send({
      status: statusCode,
      message: STATUS_CODES[statusCode],
      error: error.message,
    })
  })
}

export default fastifyPlugin(errorHandlePlugin)