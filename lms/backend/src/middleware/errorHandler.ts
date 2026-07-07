import { Request, Response, NextFunction } from 'express';
import { logger } from './logger';

/**
 * Custom Error Class
 */
export class APIError extends Error {
  constructor(
    public statusCode: number = 500,
    public message: string = 'Internal Server Error',
    public details?: any
  ) {
    super(message);
    this.name = 'APIError';
  }
}

/**
 * Validation Error
 */
export class ValidationError extends APIError {
  constructor(message: string, details?: any) {
    super(400, message, details);
    this.name = 'ValidationError';
  }
}

/**
 * Authentication Error
 */
export class AuthenticationError extends APIError {
  constructor(message: string = 'Unauthorized') {
    super(401, message);
    this.name = 'AuthenticationError';
  }
}

/**
 * Authorization Error
 */
export class AuthorizationError extends APIError {
  constructor(message: string = 'Forbidden') {
    super(403, message);
    this.name = 'AuthorizationError';
  }
}

/**
 * Not Found Error
 */
export class NotFoundError extends APIError {
  constructor(resource: string = 'Resource') {
    super(404, `${resource} not found`);
    this.name = 'NotFoundError';
  }
}

/**
 * Conflict Error (Duplicate)
 */
export class ConflictError extends APIError {
  constructor(message: string = 'Resource already exists') {
    super(409, message);
    this.name = 'ConflictError';
  }
}

/**
 * Internal Server Error
 */
export class InternalServerError extends APIError {
  constructor(message: string = 'Internal Server Error', details?: any) {
    super(500, message, details);
    this.name = 'InternalServerError';
  }
}

/**
 * Error Handler Middleware (must be last)
 */
export function errorHandler(
  err: Error | APIError,
  req: Request,
  res: Response,
  next: NextFunction
) {
  let statusCode = 500;
  let message = 'Internal Server Error';
  let details = undefined;

  if (err instanceof APIError) {
    statusCode = err.statusCode;
    message = err.message;
    details = err.details;
  } else if (err instanceof SyntaxError) {
    statusCode = 400;
    message = 'Invalid JSON in request body';
  } else {
    logger.error('Unhandled error:', err);
  }

  // Log error
  logger.error(`[ERROR] ${message}`, {
    statusCode,
    path: req.path,
    method: req.method,
    error: err.message,
    stack: err.stack,
    details,
  });

  // Send error response
  res.status(statusCode).json({
    success: false,
    error: message,
    ...(process.env.NODE_ENV === 'development' && { details, stack: err.stack }),
  });
}

/**
 * Async Route Wrapper
 * Wraps async route handlers to catch errors automatically
 */
export function asyncHandler(
  fn: (req: Request, res: Response, next: NextFunction) => Promise<any>
) {
  return (req: Request, res: Response, next: NextFunction) => {
    Promise.resolve(fn(req, res, next)).catch(next);
  };
}
