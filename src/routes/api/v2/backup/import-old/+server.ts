import { createDatabaseBackup } from '$server/backup/backup';
import { importOldData } from '$server/import/import_old';
import { SendConfigureRequest } from '$server/worker/database_worker/messages/configure';
import { backupError } from '$shared/types/backup';
import { Result } from '$shared/types/result';
import { env } from 'bun';
import { createAPIErrorResponse } from '../../[apiTableName=apiTableName]/shared';
import type { RequestHandler } from './$types';
import fs from 'node:fs/promises';
import { initializeAdminUser } from '$server/login/admin';

export const POST: RequestHandler = async ({ request }) => {
	let formData;
	try {
		formData = await request.formData();
	} catch {
		return createAPIErrorResponse(Result.error(backupError()));
	}

	const file = formData.get('file');
	if (file === null) return createAPIErrorResponse(Result.error(backupError()));

	try {
		await createDatabaseBackup();

		await fs.rm('./data/current', { recursive: true, force: true });
		await fs.mkdir('./data/current');

		await SendConfigureRequest({ databaseFilePath: 'env' });

		await importOldData(await (file as File).json());

		await initializeAdminUser(env.ADMIN_PASSWORD!);
	} catch {
		return createAPIErrorResponse(Result.error(backupError()));
	}

	return new Response();
};
