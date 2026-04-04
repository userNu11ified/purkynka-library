import { databaseWorkerLogger } from '$server/server_loggers';
import { DrizzleError } from 'drizzle-orm';
import { DatabaseWorkerError } from '../messages/error';
import { SQLiteError } from 'bun:sqlite';

export const handleError = (e: unknown): DatabaseWorkerError => {
	if (e instanceof SQLiteError) {
		if (e.code === 'SQLITE_CONSTRAINT_PRIMARYKEY')
			return DatabaseWorkerError.primaryKeyConstraintViolated();

		if (e.code === 'SQLITE_CONSTRAINT_FOREIGNKEY')
			return DatabaseWorkerError.foreignKeyConstraintViolated();

		databaseWorkerLogger.fatal('Unknown SQLiteError!', { e });
		return DatabaseWorkerError.unknownDatabaseError();
	}

	if (e instanceof DrizzleError) {
		databaseWorkerLogger.fatal('Unknown DrizzleError!', { e });
		return DatabaseWorkerError.unknownDatabaseError();
	}

	databaseWorkerLogger.fatal('Unknown Error!', { e });
	return DatabaseWorkerError.unknownDatabaseError();
};
