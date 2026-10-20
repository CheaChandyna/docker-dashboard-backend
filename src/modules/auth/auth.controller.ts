import type { Request, Response } from "express"
import { SignInDto } from "./auth.dto"
import { signInUser } from "./auth.service"
import validatorHandler from "../../middleware/validatorHandler"

export const signIn = async (request: Request, response: Response) => {
  const body = await validatorHandler(SignInDto, request.body)
  const token = await signInUser(body)
  return response.status(200).json(token)
}