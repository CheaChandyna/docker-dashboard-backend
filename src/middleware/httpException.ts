import { STATUS_CODES } from "http";

export enum HttpStatusCodes {
  OK = 200,
  BAD_REQUEST = 400,
  UNAUTHORIZED = 401,
  FORBIDDEN = 403,
  NOT_FOUND = 404,
  CONFLICT = 409,
  INTERNAL_SERVER_ERROR = 500
}

export class HttpException extends Error {
  private error: string;

  constructor(public readonly statusCode: HttpStatusCodes, message: any) {
    super(message);
    this.error = STATUS_CODES[statusCode] || 'Error';
  }
}