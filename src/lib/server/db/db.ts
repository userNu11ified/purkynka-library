import { env } from '$env/dynamic/private';
import { Database } from 'bun:sqlite';
import { drizzle } from 'drizzle-orm/bun-sqlite';
import { migrate } from 'drizzle-orm/bun-sqlite/migrator';

const initializeDatabase = () => {
	if (env.DB_FILE_NAME === undefined)
		throw new Error('.env file is missing required DB_FILE_NAME key!');

	const sqlite = new Database(`data/${env.DB_FILE_NAME}`);
	const db = drizzle({ client: sqlite, casing: 'camelCase' });
	migrate(db, {
		migrationsFolder: 'drizzle'
	});

	return db;
};

export default initializeDatabase();
