import '$shared/database/validators/validator_config';
import { createDatabaseBackup } from '$server/backup/backup';
import { importOldData } from '$server/import/import_old';
import { serverLogger } from '$server/server_loggers';
import { SendConfigureRequest } from '$server/worker/database_worker/messages/configure';
import { Result } from '$shared/types/result';
import { env } from 'bun';
import { initializeAdminUser } from '$server/login/admin';

if (env.DB_FILE_NAME === undefined)
	throw new Error('.env file is missing required DB_FILE_NAME key!');

if (env.ADMIN_PASSWORD === undefined)
	throw new Error('.env file is missing required ADMIN_PASSWORD key!');

if (env.IMPORT_OLD_DATA !== undefined) await createDatabaseBackup('pre-import');
const configureResult = await SendConfigureRequest({
	databaseFilePath: 'env'
});

if (Result.isError(configureResult)) {
	serverLogger.fatal('Failed to configure Database Worker!', { e: configureResult.value });
}

serverLogger.info('Database Worker Initialized!');

if (env.IMPORT_OLD_DATA !== undefined) await importOldData(env.IMPORT_OLD_DATA);

await initializeAdminUser(env.ADMIN_PASSWORD);
