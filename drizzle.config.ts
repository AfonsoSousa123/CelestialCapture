import { defineConfig } from 'drizzle-kit';
import dotenv from 'dotenv';
dotenv.config({ path: ['.env.local', '.env'] });

const url = process.env.DATABASE_URL || 'postgresql://user:password@localhost:5432/celestial';

export default defineConfig({
  dialect: 'postgresql',
  schema: './server/schema.ts',
  dbCredentials: {
    url: process.env.DATABASE_URL ? `${url}${url.includes('?') ? '&' : '?'}sslmode=require` : url,
  },
});
