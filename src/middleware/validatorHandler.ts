import { validate } from "class-validator"
import { HttpException, HttpStatusCodes } from "./httpException"
import { plainToInstance } from "class-transformer"
import { error } from "node:console"

const validatorHandler = async <T extends object>(dtoClass: new () => T, body: unknown) => {
  const dto = plainToInstance(dtoClass, body)
  const errors = await validate(dto, { whitelist: true, forbidNonWhitelisted: true })

  if (errors.length > 0) {
    const errorMessages = errors.flatMap((e) => Object.values(e.constraints ?? {}))

    // this just throw one error message, delete "[0]" if u want object of error instead
    throw new HttpException(HttpStatusCodes.BAD_REQUEST, errorMessages[0])
  }

  return dto
}

export default validatorHandler