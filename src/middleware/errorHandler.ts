import { ErrorRequestHandler, NextFunction, Request, Response } from "express";
import { HttpException } from './httpException';

const errorHandler: ErrorRequestHandler = (error: unknown, request: Request, response: Response, next: NextFunction) => {
  if (error instanceof HttpException) {
    return response.status(error.statusCode).json({ 
      ...error,
      message: error.message
    });
  }

  if (error instanceof SyntaxError && error.message.includes('JSON')) {
    return response.status(400).json({ 
      code: 400,
      error: 'Bad Request',
      message: 'Request body could not be read properly.'
    });
  }

  return response.status(500).json({ 
    code: 500,
    error: 'Internal Server Error',
    message: 'Something went wrong'
  });
}

export default errorHandler