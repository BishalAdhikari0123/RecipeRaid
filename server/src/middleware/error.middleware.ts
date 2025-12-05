import { Request, Response, NextFunction } from 'express';

export class AppError extends Error {
  statusCode: number;
  isOperational: boolean;

  constructor(message: string, statusCode: number) {
    super(message);
    this.statusCode = statusCode;
    this.isOperational = true;

    Error.captureStackTrace(this, this.constructor);
  }
}

export const errorHandler = (
  err: Error | AppError,
  req: Request,
  res: Response,
  next: NextFunction
): void => {
  if (err instanceof AppError) {
    res.status(err.statusCode).json({
      error: err.message,
      status: 'error',
    });
    return;
  }

  // Handle Joi validation errors
  if (err.name === 'ValidationError') {
    res.status(400).json({
      error: err.message,
      status: 'validation_error',
    });
    return;
  }

  // Handle JWT errors
  if (err.name === 'JsonWebTokenError') {
    res.status(401).json({
      error: 'Invalid token',
      status: 'error',
    });
    return;
  }

  // Default error
  console.error('Error:', err);
  res.status(500).json({
    error: 'Internal server error',
    status: 'error',
  });
};
