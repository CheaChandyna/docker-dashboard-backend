import * as bcrypt from 'bcrypt-ts';
import { CreateUserDto } from "./user.dto";
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