import type { Request, Response } from "express";
import { CreateUserDto, UpdatePasswordDto, UpdateUserDto } from "./user.dto";
import { createNewUser, deleteOneUser, findOneById, getManyUsers, getOneUser, updateOneUser, updatePassword } from "./user.service";
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

export const getUser = async (request: Request, response: Response) => {
  const user = await getOneUser(Number(request.params.id))

  return response.status(200).send(user)
}

export const getUsers = async (request: Request, response: Response) => {
  const users = await getManyUsers()

  return response.status(200).send(users)
}

export const updateUser = async (request: Request, response: Response) => {
  const toBeUpdateId = Number(request.params.id)
  
  // if admin and user themself allow to update
  if(request.user?.role !== UserRole.ADMIN && request.user?.id !== toBeUpdateId) {
    throw new HttpException(HttpStatusCodes.UNAUTHORIZED, 'You do not have permission for this request')
  }
  
  const body = await validatorHandler(UpdateUserDto, request.body)
  const user = await updateOneUser(toBeUpdateId, body)

  return response.status(200).send(user)
}

export const deleteUser = async (request: Request, response: Response) => {

  // only admin can delete
  if(request.user?.role !== UserRole.ADMIN) {
    throw new HttpException(HttpStatusCodes.UNAUTHORIZED, 'You do not have permission for this request')
  }

  const toBeDeleteId = Number(request.params.id)
  await deleteOneUser(toBeDeleteId)

  return response.status(200).send({ message: "User has been delete successfully" })
}

export const resetPassword = async (request: Request, response: Response) => {
  const toBeUpdateId = Number(request.params.id)

  if(request.user?.role !== UserRole.ADMIN && request.user?.id !== toBeUpdateId) {
    throw new HttpException(HttpStatusCodes.UNAUTHORIZED, 'You do not have permission for this request')
  }

  const body = await validatorHandler(UpdatePasswordDto, request.body)
  const user = await updatePassword(toBeUpdateId, body)

  return response.status(200).send(user)
}