import { env } from 'bun';
import { Database } from 'bun:sqlite';
import { drizzle } from 'drizzle-orm/bun-sqlite';
import { migrate } from 'drizzle-orm/bun-sqlite/migrator';
import { databaseWorkerLogger } from './database_worker';

const PRAGMAS = [
	'synchronous = NORMAL', // Should already be enabled by WAL, increases performance
	'cache_size = 8192', // Increase cache size to improve performance
	'temp_store = MEMORY', // Store temporary tables in memory to improve performance
	'foreign_keys = ON', // Enable foreign key constraints
	'mmap_size = 268435456' // Enable memory mapped I/O, increases performance, 256MB
];

export const initializeDatabase = () => {
	if (env.DB_FILE_NAME === undefined)
		throw new Error('.env file is missing required DB_FILE_NAME key!');

	const sqlite = new Database(`data/${env.DB_FILE_NAME}`);
	PRAGMAS.forEach((pragma) => sqlite.run(`PRAGMA ${pragma}`));
	databaseWorkerLogger.debug('Created SQLite Client!');

	const db = drizzle({ client: sqlite, casing: 'camelCase' });
	databaseWorkerLogger.debug('Created Drizzle Client!');

	migrate(db, {
		migrationsFolder: 'drizzle'
	});
	databaseWorkerLogger.debug('Applied Database Migrations!');

	return db;
};
