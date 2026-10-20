import { ErrorRequestHandler, NextFunction, Request, Response } from "express";
import { HttpException } from './httpException';

const errorHandler: ErrorRequestHandler = (error: HttpException, request: Request, response: Response, next: NextFunction) => {
  if (error instanceof HttpException) {
    return response.status(error.statusCode).json({ 
      ...error,
      message: error.message
    });
  }

  console.error(error);
  return response.status(500).json({ 
    code: 500,
    error: 'Internal Server Error',
    message: 'Something went wrong'
  });
}

export default errorHandler