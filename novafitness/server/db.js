import 'dotenv/config';
import { Pool } from 'pg';

const databaseUrl = process.env.DATABASE_URL;

if (!databaseUrl) {
  throw new Error('DATABASE_URL is required. Add it to your environment variables.');
}

const useSsl = (process.env.DATABASE_SSL ?? 'false').toLowerCase() === 'true';

const pool = new Pool({
  connectionString: databaseUrl,
  ssl: useSsl ? { rejectUnauthorized: false } : undefined,
});

export const initializeDatabase = async () => {
  await pool.query(`
    CREATE TABLE IF NOT EXISTS users (
      email TEXT PRIMARY KEY,
      password_hash TEXT NOT NULL,
      created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
    );

    CREATE TABLE IF NOT EXISTS workout_plans (
      id BIGSERIAL PRIMARY KEY,
      user_email TEXT NOT NULL REFERENCES users(email) ON UPDATE CASCADE ON DELETE CASCADE,
      plan_date DATE NOT NULL,
      exercise_slug TEXT NOT NULL,
      exercise_name TEXT NOT NULL,
      sets INTEGER NOT NULL,
      reps INTEGER NOT NULL,
      notes TEXT NOT NULL DEFAULT '',
      created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
    );

    CREATE INDEX IF NOT EXISTS idx_workout_plans_user_date
      ON workout_plans(user_email, plan_date);

    CREATE TABLE IF NOT EXISTS progress_logs (
      id BIGSERIAL PRIMARY KEY,
      user_email TEXT NOT NULL REFERENCES users(email) ON UPDATE CASCADE ON DELETE CASCADE,
      exercise_slug TEXT NOT NULL,
      exercise_name TEXT NOT NULL,
      weight NUMERIC(10,2) NOT NULL CHECK(weight >= 0),
      logged_at DATE NOT NULL,
      notes TEXT NOT NULL DEFAULT '',
      created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
    );

    CREATE INDEX IF NOT EXISTS idx_progress_logs_user_logged_at
      ON progress_logs(user_email, logged_at);
  `);
};

export const query = (text, params = []) => pool.query(text, params);

export const withTransaction = async (handler) => {
  const client = await pool.connect();
  try {
    await client.query('BEGIN');
    const result = await handler(client);
    await client.query('COMMIT');
    return result;
  } catch (error) {
    await client.query('ROLLBACK');
    throw error;
  } finally {
    client.release();
  }
};

export default pool;
