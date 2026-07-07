import { readFileSync, readdirSync } from 'fs';
import path from 'path';
import { pool } from '../config/database';
import { logger } from '../middleware/logger';

/**
 * Run Database Migrations
 * Executes all .sql files in this directory in order
 */
async function runMigrations(): Promise<void> {
  const client = await pool.connect();

  try {
    logger.info('Starting database migrations...');

    // Create migrations tracking table if it doesn't exist
    await client.query(`
      CREATE TABLE IF NOT EXISTS migrations (
        id SERIAL PRIMARY KEY,
        name VARCHAR(255) UNIQUE NOT NULL,
        executed_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      )
    `);

    // Get all migration files
    const migrationDir = __dirname;
    const files = readdirSync(migrationDir)
      .filter(f => f.endsWith('.sql') && !f.includes('seed'))
      .sort();

    logger.info(`Found ${files.length} migration files`);

    let migrationsRun = 0;

    for (const file of files) {
      try {
        // Check if migration already executed
        const result = await client.query(
          'SELECT id FROM migrations WHERE name = $1',
          [file]
        );

        if (result.rows.length > 0) {
          logger.info(`✓ Migration already run: ${file}`);
          continue;
        }

        // Read and execute migration
        const filePath = path.join(migrationDir, file);
        const sql = readFileSync(filePath, 'utf-8');

        logger.info(`Running migration: ${file}`);
        await client.query(sql);

        // Record migration execution
        await client.query(
          'INSERT INTO migrations (name) VALUES ($1)',
          [file]
        );

        logger.info(`✓ Migration completed: ${file}`);
        migrationsRun++;
      } catch (error) {
        logger.error(`✗ Migration failed: ${file}`, error);
        throw error;
      }
    }

    if (migrationsRun === 0) {
      logger.info('✓ All migrations already executed');
    } else {
      logger.info(`✓ Successfully ran ${migrationsRun} migration(s)`);
    }
  } catch (error) {
    logger.error('Migration process failed:', error);
    throw error;
  } finally {
    client.release();
  }
}

/**
 * Run migrations when this script is executed directly
 */
if (require.main === module) {
  runMigrations()
    .then(() => {
      logger.info('Database migrations completed successfully');
      process.exit(0);
    })
    .catch((error) => {
      logger.error('Database migrations failed:', error);
      process.exit(1);
    });
}

export { runMigrations };
