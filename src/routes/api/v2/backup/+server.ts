import { backupBody } from '$shared/types/backup';
import { type } from 'arktype';
import type { RequestHandler } from './$types';
import { createAPIErrorResponse } from '../[apiTableName=apiTableName]/shared';
import { requestBodyMalformed } from '$shared/error/api_error';
import { Result } from '$shared/types/result';
import { createValidationResultErrorFromArkErrors } from '$shared/types/validators/validator_util';
import {
	applyDatabaseBackup,
	createDatabaseBackup,
	getDatabaseBackup,
	getDatabaseBackupList,
	removeDatabaseBackup
} from '$server/backup/backup';
import { json } from '@sveltejs/kit';
import { Option } from '$shared/types/option';

const handleCreateBackup = async () => json(Result.flatten(await createDatabaseBackup()));

const handleApplyBackup = async (backupName: string) => {
	const applyOption = await applyDatabaseBackup(backupName);
	if (Option.isSome(applyOption)) return new Response();
	else return new Response(undefined, { status: 400 });
};

const handleRemoveBackup = async (backupName: string) => {
	await removeDatabaseBackup(backupName);
	return new Response();
};

const handleListBackups = async () => {
	return json(Result.flatten(await getDatabaseBackupList()));
};

const handleDownloadBackup = async (backupName: string) => {
	console.log('handle download');

	const backupResult = await getDatabaseBackup(backupName);
	if (Result.isError(backupResult)) return new Response(undefined, { status: 400 });

	return new Response(backupResult.value, {
		headers: {
			'Content-Type': 'application/gzip',
			'Content-Disposition': `attachment; filename=${backupName}`
		}
	});
};

export const POST: RequestHandler = async ({ request }) => {
	let body;
	try {
		body = await request.json();
	} catch {
		return createAPIErrorResponse(Result.error(requestBodyMalformed()));
	}

	const backupBodyParsed = backupBody(body);
	if (backupBodyParsed instanceof type.errors) {
		return createAPIErrorResponse(createValidationResultErrorFromArkErrors(backupBodyParsed));
	}

	if (backupBodyParsed.type === 'create') return handleCreateBackup();
	else if (backupBodyParsed.type === 'apply') return handleApplyBackup(backupBodyParsed.backupName);
	else if (backupBodyParsed.type === 'delete')
		return handleRemoveBackup(backupBodyParsed.backupName);
	else if (backupBodyParsed.type === 'download')
		return handleDownloadBackup(backupBodyParsed.backupName);

	return handleListBackups();
};
