import { defineConfig } from 'drizzle-kit';

const url = process.env.DATABASE_URL || 'postgresql://user:password@localhost:5432/celestial';

export default defineConfig({
  dialect: 'postgresql',
  schema: './server/schema.ts',
  dbCredentials: {
    url: process.env.DATABASE_URL ? `${url}${url.includes('?') ? '&' : '?'}sslmode=require` : url,
  },
});
