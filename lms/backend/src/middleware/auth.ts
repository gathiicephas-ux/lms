import { Request, Response, NextFunction } from 'express';
import jwt from 'jsonwebtoken';
import { AuthenticationError, AuthorizationError } from './errorHandler';

/**
 * Extend Express Request to include user data
 */
declare global {
  namespace Express {
    interface Request {
      userId?: string;
      userRole?: 'student' | 'facilitator' | 'admin';
      token?: string;
    }
  }
}

/**
 * JWT Payload Type
 */
interface JWTPayload {
  userId: string;
  email: string;
  role: 'student' | 'facilitator' | 'admin';
  iat: number;
  exp: number;
}

/**
 * Verify JWT Token
 */
export function verifyToken(token: string): JWTPayload {
  try {
    const decoded = jwt.verify(
      token,
      process.env.JWT_ACCESS_SECRET || 'your_secret_key'
    ) as JWTPayload;
    return decoded;
  } catch (error) {
    throw new AuthenticationError('Invalid or expired token');
  }
}

/**
 * Authentication Middleware
 * Verifies JWT token and attaches user info to request
 */
export function authenticate(req: Request, res: Response, next: NextFunction) {
  try {
    // Extract token from header
    const authHeader = req.headers.authorization;
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      throw new AuthenticationError('No token provided');
    }

    const token = authHeader.substring(7); // Remove 'Bearer ' prefix
    const decoded = verifyToken(token);

    // Attach user info to request
    req.userId = decoded.userId;
    req.userRole = decoded.role;
    req.token = token;

    next();
  } catch (error) {
    next(error);
  }
}

/**
 * Role-Based Authorization Middleware
 */
export function authorize(...allowedRoles: string[]) {
  return (req: Request, res: Response, next: NextFunction) => {
    if (!req.userId) {
      return next(new AuthenticationError('Not authenticated'));
    }

    if (!allowedRoles.includes(req.userRole || '')) {
      return next(new AuthorizationError('Insufficient permissions'));
    }

    next();
  };
}

/**
 * Admin Only Middleware
 */
export function adminOnly(req: Request, res: Response, next: NextFunction) {
  if (!req.userId) {
    return next(new AuthenticationError('Not authenticated'));
  }

  if (req.userRole !== 'admin') {
    return next(new AuthorizationError('Admin access required'));
  }

  next();
}

/**
 * Facilitator or Admin Middleware
 */
export function facilitatorOrAdmin(req: Request, res: Response, next: NextFunction) {
  if (!req.userId) {
    return next(new AuthenticationError('Not authenticated'));
  }

  if (!['facilitator', 'admin'].includes(req.userRole || '')) {
    return next(new AuthorizationError('Facilitator access required'));
  }

  next();
}

/**
 * Optional Authentication
 * Allows both authenticated and unauthenticated requests
 */
export function optionalAuth(req: Request, res: Response, next: NextFunction) {
  try {
    const authHeader = req.headers.authorization;
    if (authHeader && authHeader.startsWith('Bearer ')) {
      const token = authHeader.substring(7);
      const decoded = verifyToken(token);
      req.userId = decoded.userId;
      req.userRole = decoded.role;
      req.token = token;
    }
  } catch (error) {
    // Ignore authentication errors for optional auth
  }
  next();
}
