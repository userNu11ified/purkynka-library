import { env } from 'bun';
import { Database } from 'bun:sqlite';
import { drizzle } from 'drizzle-orm/bun-sqlite';
import { migrate } from 'drizzle-orm/bun-sqlite/migrator';
import { databaseInitializerLogger } from '$server/server_loggers';
import type { DatabaseWorkerConfig } from './messages/configure';

export const getDatabaseFilePath = (databaseWorkerConfig: DatabaseWorkerConfig) => {
	if (databaseWorkerConfig.databaseFilePath === 'memory') return ':memory:';

	if (env.DB_FILE_NAME === undefined)
		throw new Error('.env file is missing required DB_FILE_NAME key!');

	return `data/current/${env.DB_FILE_NAME}`;
};

const PRAGMAS = [
	'journal_mode = WAL', // Enable WAL journal mode, improves performance
	'synchronous = NORMAL', // Should already be enabled by WAL, increases performance
	'cache_size = 8192', // Increase cache size to improve performance
	'temp_store = MEMORY', // Store temporary tables in memory to improve performance
	'foreign_keys = ON', // Enable foreign key constraints
	'mmap_size = 268435456' // Enable memory mapped I/O, increases performance, 256MB
];

export const initializeDatabase = (databaseWorkerConfig: DatabaseWorkerConfig) => {
	const databaseFilePath = getDatabaseFilePath(databaseWorkerConfig);
	databaseInitializerLogger.debug(`Using '${databaseFilePath}'!`);

	const sqlite = new Database(databaseFilePath);
	PRAGMAS.forEach((pragma) => sqlite.run(`PRAGMA ${pragma}`));
	databaseInitializerLogger.debug('Created SQLite Client!');

	const db = drizzle({ client: sqlite, casing: 'camelCase' });
	databaseInitializerLogger.debug('Created Drizzle Client!');

	migrate(db, {
		migrationsFolder: 'drizzle'
	});
	databaseInitializerLogger.debug('Applied Database Migrations!');

	return db;
};
