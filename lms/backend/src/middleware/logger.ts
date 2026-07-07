import winston from 'winston';

/**
 * Winston Logger Configuration
 * Centralized logging for the entire application
 */
export const logger = winston.createLogger({
  level: process.env.LOG_LEVEL || 'info',
  format: winston.format.combine(
    winston.format.timestamp({ format: 'YYYY-MM-DD HH:mm:ss' }),
    winston.format.errors({ stack: true }),
    winston.format.splat(),
    winston.format.json()
  ),
  defaultMeta: { service: 'corporate-authority-lms' },
  transports: [
    // Error logs
    new winston.transports.File({
      filename: 'logs/error.log',
      level: 'error',
      maxsize: 5242880, // 5MB
      maxFiles: 5,
    }),
    // All logs
    new winston.transports.File({
      filename: 'logs/combined.log',
      maxsize: 5242880,
      maxFiles: 10,
    }),
    // Console (for development)
    ...(process.env.NODE_ENV !== 'production'
      ? [
          new winston.transports.Console({
            format: winston.format.combine(
              winston.format.colorize(),
              winston.format.simple()
            ),
          }),
        ]
      : []),
  ],
});

/**
 * Log Authentication Events
 */
export function logAuthEvent(
  eventType: 'LOGIN' | 'LOGOUT' | 'REGISTER' | 'PASSWORD_RESET' | 'TOKEN_REFRESH',
  userId: string,
  metadata?: any
) {
  logger.info(`[AUTH] ${eventType}`, {
    userId,
    ...metadata,
  });
}

/**
 * Log Payment Events
 */
export function logPaymentEvent(
  eventType: 'PAYMENT_INITIATED' | 'PAYMENT_COMPLETED' | 'PAYMENT_FAILED' | 'REFUND',
  userId: string,
  metadata?: any
) {
  logger.info(`[PAYMENT] ${eventType}`, {
    userId,
    ...metadata,
  });
}

/**
 * Log Quiz Attempts
 */
export function logQuizEvent(
  eventType: 'QUIZ_STARTED' | 'QUIZ_SUBMITTED' | 'QUIZ_PASSED' | 'QUIZ_FAILED',
  userId: string,
  quizId: string,
  metadata?: any
) {
  logger.info(`[QUIZ] ${eventType}`, {
    userId,
    quizId,
    ...metadata,
  });
}

/**
 * Log Certificate Events
 */
export function logCertificateEvent(
  eventType: 'CERTIFICATE_GENERATED' | 'CERTIFICATE_DOWNLOADED',
  userId: string,
  certificateId?: string,
  metadata?: any
) {
  logger.info(`[CERTIFICATE] ${eventType}`, {
    userId,
    certificateId,
    ...metadata,
  });
}

/**
 * Log AI Usage
 */
export function logAIEvent(
  eventType: 'PROMPT_EXECUTED' | 'API_CALLED',
  userId: string,
  promptId?: string,
  metadata?: any
) {
  logger.info(`[AI] ${eventType}`, {
    userId,
    promptId,
    ...metadata,
  });
}

/**
 * Log Admin Actions
 */
export function logAdminEvent(
  action: string,
  adminId: string,
  targetType: string,
  targetId: string,
  metadata?: any
) {
  logger.info(`[ADMIN] ${action}`, {
    adminId,
    targetType,
    targetId,
    ...metadata,
  });
}

export default logger;
