import type { Request, Response } from "express";
import { CreateUserDto } from "./user.dto";
import { createNewUser } from "./user.service";
import { UserRole } from "./user.entity";
import { HttpException, HttpStatusCodes } from "../../middleware/httpException";
import validatorHandler from "../../middleware/validatorHandler";

export const createUser = async (request: Request, response: Response) => {
  // only allow admin to create
  if(request.user?.role !== UserRole.ADMIN) {
    throw new HttpException(HttpStatusCodes.UNAUTHORIZED, 'Admin permission is required')
  }

  const body = await validatorHandler(CreateUserDto, request.body)
  const user = await createNewUser(body)

  return response.status(200).send(user)
}

