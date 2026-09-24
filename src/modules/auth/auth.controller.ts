import type { FastifyPluginAsync } from "fastify";
import { signInDto, signupDto } from './auth.dto';
import { compareUser, createUser, findByUsername } from "./auth.service";
import type { JwtPayload } from "../../types/payload";

const authController: FastifyPluginAsync = async (app) => {
  app.post('/signup', async(request, response) =>{
    // vailidate body to Dto rules
    const {username, email, password} = signupDto.parse(request.body)

    if (await findByUsername(username)) {
      throw app.httpErrors.conflict('Username already exist.')
    }

    const user = await createUser(username, email, password)
    return response.code(201).send(user)
  })

  app.post('/signin', async(request, response) => {
    const { email, password } = signInDto.parse(request.body)

    const user = await compareUser(email, password)
    if (!user) {
      throw app.httpErrors.notFound('Invalid credentials.')
    }

    const payload: JwtPayload = {
      userId: user.id,
      user: user.username,
      role: user.role
    }

    return response.code(200).send({ access_token: await response.jwtSign(payload) })
  })
}

export default authController