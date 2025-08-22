import { defineConfig } from 'drizzle-kit';

const databaseUrl = process.env.DATABASE_URL;

if (!databaseUrl) {
  throw new Error('DATABASE_URL is not set in environment variables');
}

export default defineConfig({
  dialect: 'postgresql',
  schema: './libs/db/src/lib/db.schema.ts',
  out: './libs/db/src/drizzle',
  dbCredentials: {
    url: databaseUrl,
  },
});
