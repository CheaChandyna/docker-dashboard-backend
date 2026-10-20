import { NextFunction, Request, Response } from "express";
import { HttpException, HttpStatusCodes } from '../../middleware/httpException';
import { getUserInToken, PayLoad } from "./auth.service";


declare global {
  namespace Express {
    interface Request {
      user?: PayLoad;
    }
  }
}

const authenticateGuard = async (request: Request, response: Response, next: NextFunction) => {
  const [type, token] = request.headers.authorization?.split(' ') ?? []
  const access_token = type === 'Bearer' ? token : undefined

  if(!access_token) {
    throw new HttpException(HttpStatusCodes.UNAUTHORIZED, 'Missing authorized header')
  }

  try {
    const user = await getUserInToken(token)
    request.user = user
    next()
  } catch {
    throw new HttpException(HttpStatusCodes.UNAUTHORIZED, 'Invalid authorized token')
  }
}

export default authenticateGuard