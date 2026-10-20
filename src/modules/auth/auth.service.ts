import db from "../../database/db";
import { HttpException, HttpStatusCodes } from '../../middleware/httpException';
import { User, UserRole } from '../user/user.entity';
import { findOneAllFieldByEmail, findOneById } from "../user/user.service";
import { SignInDto } from "./auth.dto";
import * as bcrypt from 'bcrypt-ts';
import jwt from 'jsonwebtoken';
import 'dotenv/config'
 
const userRepository = db.getRepository(User)

export type PayLoad = {
  id: number;
  username: string;
  email: string;
  role: UserRole;
}

export const signInUser = async (userData: SignInDto) => {
  const user = await findOneAllFieldByEmail(userData.email)
  if(!user) {
    throw new HttpException(HttpStatusCodes.NOT_FOUND, 'Invalid credentials')
  }

  const isPasswordMatch = await bcrypt.compare(userData.password, user.password)
  if(!isPasswordMatch) {
    throw new HttpException(HttpStatusCodes.UNAUTHORIZED, 'Invalid credentials')
  }

  const userPayload: PayLoad = {
    id: user.id,
    username: user.username,
    email: user.email,
    role: user.role
  }

  return { access_token: await generateToken(userPayload) }
}

const generateToken = async (payload: PayLoad) => {
  return jwt.sign(payload, process.env.JWT_SECRET as string)
}

export const getUserInToken = async (token: string) => {
  try {
    const payload = await jwt.verify(token, process.env.JWT_SECRET as string) as PayLoad

    const user = await findOneById(payload.id)

    if(!user) {
      throw new HttpException(HttpStatusCodes.UNAUTHORIZED, 'Invalid authorized token')
    }

    return user
  } catch {
    throw new HttpException(HttpStatusCodes.UNAUTHORIZED, 'Invalid Token')
  }
}