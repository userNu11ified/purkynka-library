import { createDatabaseBackup } from '$server/backup/backup';
import { SendConfigureRequest } from '$server/worker/database_worker/messages/configure';
import { backupError } from '$shared/types/backup';
import { Result } from '$shared/types/result';
import { createAPIErrorResponse } from '../../[apiTableName=apiTableName]/shared';
import type { RequestHandler } from './$types';
import fs from 'node:fs/promises';

export const POST: RequestHandler = async ({ request }) => {
	let formData;
	try {
		formData = await request.formData();
	} catch {
		return createAPIErrorResponse(Result.error(backupError()));
	}

	const file = formData.get('file');
	if (file === null) return createAPIErrorResponse(Result.error(backupError()));

	const archive = new Bun.Archive(file as File, { compress: 'gzip', level: 12 });

	try {
		await createDatabaseBackup();

		await fs.rm('./data/current', { recursive: true, force: true });
		await fs.mkdir('./data/current');

		await archive.extract('./data/current');

		await SendConfigureRequest({ databaseFilePath: 'env' });
	} catch {
		return createAPIErrorResponse(Result.error(backupError()));
	}

	return new Response();
};
