import { drizzle } from 'drizzle-orm/node-postgres';
import pkg from 'pg';
import dotenv from 'dotenv';

dotenv.config({ path: ['.env.local', '.env'] });

const { Pool } = pkg;
import * as schema from './schema.ts';

const connectionString = process.env.DATABASE_URL || 'postgresql://user:password@localhost:5432/celestial';

const pool = new Pool({
  connectionString,
  ...(process.env.DATABASE_URL ? { ssl: { rejectUnauthorized: false } } : {}),
});

export const db = drizzle(pool, { schema });
