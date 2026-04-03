import { env } from 'bun';
import { defineConfig } from 'drizzle-kit';

if (env.DB_FILE_NAME === undefined)
	throw new Error('.env file is missing required DB_FILE_NAME key!');

export default defineConfig({
	dialect: 'sqlite',
	out: 'drizzle',
	casing: 'camelCase',
	schema: 'src/lib/shared/database/schema/schema.ts',
	dbCredentials: {
		url: env.DB_FILE_NAME
	}
});
