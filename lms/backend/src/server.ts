import express, { Express, Request, Response, NextFunction } from 'express';
import cors from 'cors';
import helmet from 'helmet';
import dotenv from 'dotenv';
import { initializeDatabase } from './config/database';
import { logger } from './middleware/logger';
import { errorHandler } from './middleware/errorHandler';
import { requestLogger } from './middleware/requestLogger';

// Routes
import authRoutes from './routes/auth.routes';
import userRoutes from './routes/user.routes';
import courseRoutes from './routes/course.routes';
import lessonRoutes from './routes/lesson.routes';
import progressRoutes from './routes/progress.routes';
import quizRoutes from './routes/quiz.routes';
import paymentRoutes from './routes/payment.routes';
import certificateRoutes from './routes/certificate.routes';
import aiPromptRoutes from './routes/aiPrompt.routes';
import adminRoutes from './routes/admin.routes';
import communityRoutes from './routes/community.routes';

dotenv.config();

const app: Express = express();
const PORT = process.env.PORT || 5000;

/**
 * Middleware Setup
 */

// Security middleware
app.use(helmet());

// CORS configuration
app.use(cors({
  origin: process.env.FRONTEND_URL || 'http://localhost:3000',
  credentials: true,
  optionsSuccessStatus: 200,
}));

// Body parsing
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ limit: '10mb', extended: true }));

// Logging
app.use(requestLogger);

/**
 * Health Check Endpoint
 */
app.get('/health', (req: Request, res: Response) => {
  res.json({
    success: true,
    message: 'Corporate Authority Programme™ LMS Backend is running',
    timestamp: new Date().toISOString(),
  });
});

/**
 * API Routes
 */
app.use('/api/auth', authRoutes);
app.use('/api/users', userRoutes);
app.use('/api/courses', courseRoutes);
app.use('/api/lessons', lessonRoutes);
app.use('/api/progress', progressRoutes);
app.use('/api/quizzes', quizRoutes);
app.use('/api/payments', paymentRoutes);
app.use('/api/certificates', certificateRoutes);
app.use('/api/ai-prompts', aiPromptRoutes);
app.use('/api/admin', adminRoutes);
app.use('/api/community', communityRoutes);

/**
 * 404 Handler
 */
app.use((req: Request, res: Response) => {
  res.status(404).json({
    success: false,
    error: 'Endpoint not found',
    path: req.path,
    method: req.method,
  });
});

/**
 * Error Handler (must be last)
 */
app.use(errorHandler);

/**
 * Start Server
 */
async function startServer() {
  try {
    // Initialize database
    await initializeDatabase();

    // Start listening
    app.listen(PORT, () => {
      logger.info(`
╔══════════════════════════════════════════════════════════╗
║  Corporate Authority Programme™ LMS Backend             ║
║  Server running on http://localhost:${PORT}              ║
║  Environment: ${process.env.NODE_ENV || 'development'}${' '.repeat(28 - (process.env.NODE_ENV || 'development').length)}║
║  Database: ${process.env.DB_NAME || 'corporate_authority_lms'}${' '.repeat(46 - (process.env.DB_NAME || 'corporate_authority_lms').length)}║
╚══════════════════════════════════════════════════════════╝
      `);
    });
  } catch (error) {
    logger.error('Failed to start server:', error);
    process.exit(1);
  }
}

// Handle graceful shutdown
process.on('SIGTERM', () => {
  logger.info('SIGTERM signal received: closing HTTP server');
  process.exit(0);
});

process.on('SIGINT', () => {
  logger.info('SIGINT signal received: closing HTTP server');
  process.exit(0);
});

startServer();

export default app;
