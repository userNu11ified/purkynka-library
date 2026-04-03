import { env } from 'bun';
import { defineConfig } from 'drizzle-kit';
import { mkdir } from 'node:fs/promises';

if (env.DB_FILE_NAME === undefined)
	throw new Error('.env file is missing required DB_FILE_NAME key!');

await mkdir('./data', { recursive: true });

export default defineConfig({
	dialect: 'sqlite',
	out: 'drizzle',
	casing: 'camelCase',
	schema: 'src/lib/shared/database/schema.ts',
	dbCredentials: {
		url: `data/${env.DB_FILE_NAME}`
	}
});
