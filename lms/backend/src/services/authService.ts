import jwt from 'jsonwebtoken';
import bcryptjs from 'bcryptjs';
import { v4 as uuidv4 } from 'uuid';
import { query, queryOne, transaction } from '../config/database';
import { logAuthEvent } from '../middleware/logger';
import { AuthenticationError, ValidationError, ConflictError } from '../middleware/errorHandler';

/**
 * Auth Service - Handles authentication logic
 */

/**
 * Hash Password
 */
export async function hashPassword(password: string): Promise<string> {
  const saltRounds = 10;
  return bcryptjs.hash(password, saltRounds);
}

/**
 * Compare Password
 */
export async function comparePassword(
  password: string,
  hashedPassword: string
): Promise<boolean> {
  return bcryptjs.compare(password, hashedPassword);
}

/**
 * Generate Access Token (24 hours)
 */
export function generateAccessToken(userId: string, email: string, role: string): string {
  return jwt.sign(
    { userId, email, role },
    process.env.JWT_ACCESS_SECRET || 'your_secret_key',
    { expiresIn: process.env.JWT_ACCESS_EXPIRY || '24h' }
  );
}

/**
 * Generate Refresh Token (30 days)
 */
export function generateRefreshToken(userId: string): string {
  return jwt.sign(
    { userId },
    process.env.JWT_REFRESH_SECRET || 'your_refresh_secret',
    { expiresIn: process.env.JWT_REFRESH_EXPIRY || '30d' }
  );
}

/**
 * Register New User
 */
export async function registerUser(data: {
  firstName: string;
  lastName: string;
  email: string;
  password: string;
  tier?: 'foundation' | 'authority' | 'domination';
  companyName?: string;
}): Promise<{
  userId: string;
  email: string;
  role: string;
  accessToken: string;
  refreshToken: string;
}> {
  // Validate email format
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  if (!emailRegex.test(data.email)) {
    throw new ValidationError('Invalid email format');
  }

  // Validate password
  if (data.password.length < 8) {
    throw new ValidationError('Password must be at least 8 characters');
  }

  try {
    return await transaction(async (client) => {
      // Check if user already exists
      const existingUser = await queryOne(
        'SELECT id FROM users WHERE email = $1',
        [data.email]
      );

      if (existingUser) {
        throw new ConflictError('Email already registered');
      }

      // Hash password
      const hashedPassword = await hashPassword(data.password);

      // Create user
      const userId = uuidv4();
      const createdAt = new Date();

      await client.query(
        `INSERT INTO users (id, first_name, last_name, email, password_hash, role, tier, company_name, created_at, updated_at)
         VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10)`,
        [
          userId,
          data.firstName,
          data.lastName,
          data.email,
          hashedPassword,
          'student',
          data.tier || 'foundation',
          data.companyName || null,
          createdAt,
          createdAt,
        ]
      );

      // Create tokens
      const accessToken = generateAccessToken(userId, data.email, 'student');
      const refreshToken = generateRefreshToken(userId);

      // Store refresh token
      await client.query(
        'INSERT INTO refresh_tokens (id, user_id, token, expires_at) VALUES ($1, $2, $3, $4)',
        [uuidv4(), userId, refreshToken, new Date(Date.now() + 30 * 24 * 60 * 60 * 1000)]
      );

      logAuthEvent('REGISTER', userId, {
        email: data.email,
        tier: data.tier,
      });

      return {
        userId,
        email: data.email,
        role: 'student',
        accessToken,
        refreshToken,
      };
    });
  } catch (error) {
    throw error;
  }
}

/**
 * Login User
 */
export async function loginUser(email: string, password: string): Promise<{
  userId: string;
  email: string;
  firstName: string;
  lastName: string;
  role: string;
  accessToken: string;
  refreshToken: string;
}> {
  // Find user by email
  const user = await queryOne(
    'SELECT id, first_name, last_name, email, password_hash, role FROM users WHERE email = $1',
    [email]
  );

  if (!user) {
    throw new AuthenticationError('Invalid email or password');
  }

  // Verify password
  const passwordValid = await comparePassword(password, user.password_hash);
  if (!passwordValid) {
    throw new AuthenticationError('Invalid email or password');
  }

  // Generate tokens
  const accessToken = generateAccessToken(user.id, user.email, user.role);
  const refreshToken = generateRefreshToken(user.id);

  // Store refresh token
  await query(
    'INSERT INTO refresh_tokens (id, user_id, token, expires_at) VALUES ($1, $2, $3, $4)',
    [uuidv4(), user.id, refreshToken, new Date(Date.now() + 30 * 24 * 60 * 60 * 1000)]
  );

  logAuthEvent('LOGIN', user.id, { email });

  return {
    userId: user.id,
    email: user.email,
    firstName: user.first_name,
    lastName: user.last_name,
    role: user.role,
    accessToken,
    refreshToken,
  };
}

/**
 * Refresh Access Token
 */
export async function refreshAccessToken(refreshToken: string): Promise<{
  accessToken: string;
  refreshToken: string;
}> {
  try {
    // Verify refresh token
    const decoded = jwt.verify(
      refreshToken,
      process.env.JWT_REFRESH_SECRET || 'your_refresh_secret'
    ) as { userId: string };

    // Get user info
    const user = await queryOne(
      'SELECT id, email, role FROM users WHERE id = $1',
      [decoded.userId]
    );

    if (!user) {
      throw new AuthenticationError('User not found');
    }

    // Generate new access token
    const newAccessToken = generateAccessToken(user.id, user.email, user.role);

    logAuthEvent('TOKEN_REFRESH', user.id);

    return {
      accessToken: newAccessToken,
      refreshToken, // Return same refresh token (could rotate if needed)
    };
  } catch (error) {
    throw new AuthenticationError('Invalid refresh token');
  }
}

/**
 * Logout User
 */
export async function logoutUser(userId: string, refreshToken: string): Promise<void> {
  // Invalidate refresh token
  await query('DELETE FROM refresh_tokens WHERE user_id = $1 AND token = $2', [
    userId,
    refreshToken,
  ]);

  logAuthEvent('LOGOUT', userId);
}

/**
 * Get User by ID
 */
export async function getUserById(userId: string): Promise<any> {
  return queryOne(
    `SELECT id, first_name, last_name, email, role, tier, company_name, created_at
     FROM users WHERE id = $1`,
    [userId]
  );
}

/**
 * Update User Profile
 */
export async function updateUserProfile(
  userId: string,
  data: Partial<{
    firstName: string;
    lastName: string;
    companyName: string;
  }>
): Promise<any> {
  const updates: string[] = [];
  const values: any[] = [];
  let paramCount = 1;

  if (data.firstName !== undefined) {
    updates.push(`first_name = $${paramCount++}`);
    values.push(data.firstName);
  }
  if (data.lastName !== undefined) {
    updates.push(`last_name = $${paramCount++}`);
    values.push(data.lastName);
  }
  if (data.companyName !== undefined) {
    updates.push(`company_name = $${paramCount++}`);
    values.push(data.companyName);
  }

  if (updates.length === 0) return getUserById(userId);

  values.push(userId);
  updates.push(`updated_at = NOW()`);

  await query(
    `UPDATE users SET ${updates.join(', ')} WHERE id = $${paramCount}`,
    values
  );

  return getUserById(userId);
}

/**
 * Change Password
 */
export async function changePassword(
  userId: string,
  oldPassword: string,
  newPassword: string
): Promise<void> {
  // Get user
  const user = await queryOne('SELECT password_hash FROM users WHERE id = $1', [userId]);

  if (!user) {
    throw new AuthenticationError('User not found');
  }

  // Verify old password
  const passwordValid = await comparePassword(oldPassword, user.password_hash);
  if (!passwordValid) {
    throw new ValidationError('Current password is incorrect');
  }

  // Validate new password
  if (newPassword.length < 8) {
    throw new ValidationError('New password must be at least 8 characters');
  }

  // Hash and update new password
  const hashedPassword = await hashPassword(newPassword);
  await query('UPDATE users SET password_hash = $1, updated_at = NOW() WHERE id = $2', [
    hashedPassword,
    userId,
  ]);

  logAuthEvent('PASSWORD_RESET', userId);
}
