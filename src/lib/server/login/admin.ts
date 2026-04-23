import { serverLogger } from '$server/server_loggers';
import { SendInsertRequest } from '$server/worker/database_worker/messages/insert';
import { SendSelectRequest } from '$server/worker/database_worker/messages/select';
import { SendUpdateRequest } from '$server/worker/database_worker/messages/update';
import { Result } from '$shared/types/result';
import { hashPassword } from './hash';

const createAdminUser = async (adminPassword: string) =>
	SendInsertRequest('librarians', [
		{ id: 1, email: 'Admin', password: await hashPassword(adminPassword) }
	]);

const updateAdminUser = async (adminPassword: string) =>
	SendUpdateRequest(
		'librarians',
		{ password: await hashPassword(adminPassword) },
		{ filterType: 'eq', columnName: 'id', value: 1 }
	);

const sendAdminRequest = async (createAdmin: boolean, adminPassword: string) => {
	if (createAdmin) return createAdminUser(adminPassword);
	else return updateAdminUser(adminPassword);
};

export const initializeAdminUser = async (adminPassword: string) => {
	const getAdminUserResult = Result.flatten(
		await SendSelectRequest('librarians', {
			filterType: 'eq',
			columnName: 'id',
			value: 1
		})
	);

	if (Result.isFlatError(getAdminUserResult)) throw new Error('Failed to GET admin user!');

	const adminUserResult = await sendAdminRequest(
		getAdminUserResult.values.length === 0,
		adminPassword
	);
	if (Result.isError(adminUserResult)) {
		serverLogger.fatal('Failed to initialize Admin User!', { error: adminUserResult.value });
		throw new Error();
	}

	serverLogger.info('Initialized Admin User!');
};
