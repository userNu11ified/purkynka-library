import { serverLogger } from '$server/server_loggers';
import { SendConfigureRequest } from '$server/worker/database_worker/messages/configure';
import { setupValidatorConfig } from '$shared/database/validators/validator_config';
import { Result } from '$shared/types/result';

setupValidatorConfig();

const configureResult = await SendConfigureRequest({
	databaseFilePath: 'env'
});

if (Result.isError(configureResult)) {
	serverLogger.fatal('Failed to configure Database Worker!', { e: configureResult.value });
}

serverLogger.info('Database Worker Initialized!');
