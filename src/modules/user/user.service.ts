import * as bcrypt from 'bcrypt-ts';
import { CreateUserDto, UpdatePasswordDto, UpdateUserDto } from "./user.dto";
import { User } from "./user.entity";
import db from '../../database/db';
import { HttpException, HttpStatusCodes } from '../../middleware/httpException';

const userRepository = db.getRepository(User)

export const createNewUser = async (userData: CreateUserDto) => {
  const isEmailExist = await findOneByEmail(userData.email)
  if(isEmailExist) {
    throw new HttpException(HttpStatusCodes.CONFLICT, 'Email already existed')
  }

  const salt = 12
  const defaultPassword = 'password'

  const hashPassword = await bcrypt.hash(defaultPassword, salt)

  const newUserData = {
    ...userData,
    username: userData.lastName.toLowerCase() + userData.firstName.toLowerCase(),
    password: hashPassword
  }

  const newUser = userRepository.create(newUserData)
  const createdUser = await userRepository.save(newUser)

  return omitPassword(createdUser)
}

export const findOneByEmail = async (email: string) => {
  return await userRepository.findOne({ 
    where: { email: email },
    select: {
      id: true,
      firstName: true,
      lastName: true,
      username: true,
      email: true,
      role: true,
      createAt: true,
      updateAt: true
    }
  })
}

export const findOneById = async (id: number) => {
  return await userRepository.findOne({ 
    where: { id: id },
    select: { 
      id: true,
      firstName: true,
      lastName: true,
      username: true,
      email: true,
      role: true,
      createAt: true,
      updateAt: true
     }
  })
}

const omitPassword = (user: User) => {
  const { password, ...withoutPassword } = user
  return withoutPassword
}

export const findOneAllFieldByEmail = async (email: string) => {
  return await userRepository.findOne({ where: { email: email } })
}

export const findOneAllFieldById = async (id: number) => {
  return await userRepository.findOne({ where: { id: id } })
}

export const getOneUser = async (userId: number) => {
  return await userRepository.findOne({ 
    where: { id: userId }, 
    select: {
      id: true,
      firstName: true,
      lastName: true,
      username: true,
      email: true,
      role: true,
      createAt: true,
      updateAt: true
    } 
  })
}

export const getManyUsers = async () => {
  return await userRepository.find({
    select: {
      id: true,
      firstName: true,
      lastName: true,
      username: true,
      email: true,
      role: true,
    }
  })
}

export const updateOneUser = async (userId: number, updateData: UpdateUserDto) => {
  const userToUpdate = await findOneById(userId)

  if(!userToUpdate) {
    throw new HttpException(HttpStatusCodes.NOT_FOUND, 'User not found')
  }

  if (updateData.email) {
    const isEmailExist = await findOneByEmail(updateData.email)
    if(isEmailExist) {
      throw new HttpException(HttpStatusCodes.CONFLICT, 'Email already existed')
    }
  }


  userRepository.merge(userToUpdate, updateData)
  const updatedUser = await userRepository.save(userToUpdate)

  return omitPassword(updatedUser)
}

export const deleteOneUser = async (userId: number) => {
  const userToDelete = await findOneById(userId)

  if(!userToDelete) {
    throw new HttpException(HttpStatusCodes.NOT_FOUND, 'User not found')
  }

  userRepository.remove(userToDelete)

  return await userRepository.save(userToDelete)
}

export const updatePassword = async (userId: number, passwordData: UpdatePasswordDto) => {
  const userToBeUpdate = await findOneAllFieldById(userId)
  if (!userToBeUpdate) {
    throw new HttpException(HttpStatusCodes.NOT_FOUND, 'User not found')
  }

  if(passwordData.confirmPassword !== passwordData.newPassword) {
    throw new HttpException(HttpStatusCodes.BAD_REQUEST, 'Password does not match')
  }

  const salt = 12
  const hashPassword =  await bcrypt.hash(passwordData.newPassword, salt)

  userToBeUpdate.password = hashPassword
  await userRepository.save(userToBeUpdate)

  return omitPassword(await userRepository.save(userToBeUpdate))
}