import { Request, Response, NextFunction } from 'express';
import { logger } from './logger';

/**
 * Request Logging Middleware
 * Logs all incoming HTTP requests
 */
export function requestLogger(req: Request, res: Response, next: NextFunction) {
  const startTime = Date.now();

  res.on('finish', () => {
    const duration = Date.now() - startTime;
    const statusCode = res.statusCode;

    const logLevel = statusCode >= 400 ? 'warn' : 'info';
    const logMessage = `${req.method} ${req.path} - ${statusCode} (${duration}ms)`;

    logger[logLevel as keyof typeof logger](logMessage, {
      method: req.method,
      path: req.path,
      statusCode,
      duration,
      userAgent: req.get('user-agent'),
      ip: req.ip || req.connection.remoteAddress,
      userId: (req as any).userId,
    });
  });

  next();
}
