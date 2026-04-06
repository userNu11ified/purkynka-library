import { Logger } from '$shared/logger/logger';

export const serverLogger = new Logger(['Server']);

export const databaseWorkerLogger = serverLogger.subnamespace(['Database Worker']);
export const databaseInitializerLogger = databaseWorkerLogger.subnamespace([
	'Database Initializer'
]);

export const oldDataImporterLogger = serverLogger.subnamespace(['Old Data Importer']);
