import { serverLogger } from '$server/server_loggers';
import { SendConfigureRequest } from '$server/worker/database_worker/messages/configure';
import {
	backupError,
	type BackupError,
	type BackupInformation,
	type BackupList
} from '$shared/types/backup';
import { Option } from '$shared/types/option';
import { Result } from '$shared/types/result';
import { Archive, Glob } from 'bun';
import fs from 'node:fs/promises';
import { server } from 'typescript';

const anyFile = new Glob('*');
const anyBackup = new Glob('backup-*.tar.gz');

const timestampRegex = /\d+-\d{2}-\d{2}T\d{2}-\d{2}-\d{2}/;

const getTimestamp = (date: Date) => {
	const year = date.getFullYear();
	const month = (date.getMonth() + 1).toString().padStart(2, '0');
	const day = date.getDate().toString().padStart(2, '0');

	const hours = date.getHours().toString().padStart(2, '0');
	const minutes = date.getMinutes().toString().padStart(2, '0');
	const seconds = date.getSeconds().toString().padStart(2, '0');

	return `${year}-${month}-${day}T${hours}-${minutes}-${seconds}`;
};

export const createDatabaseBackup = async (): Promise<Result<BackupInformation, BackupError>> => {
	console.log('creating');

	try {
		await getDatabaseBackupList();

		const foundFiles = [];
		for await (const file of anyFile.scan('./data/current')) {
			foundFiles.push(file);
		}

		const date = new Date();
		if (foundFiles.length === 0)
			return Result.ok({ backupName: 'Nothing To Backup!', backupDate: 'Nothing To Backup!' });

		const backupFileName = `backup-${getTimestamp(date)}`;

		const readFiles = Object.fromEntries(
			await Promise.all(
				foundFiles.map((fileName) =>
					Bun.file(`./data/current/${fileName}`)
						.arrayBuffer()
						.then((v) => [fileName, v])
				)
			)
		);

		const archive = new Bun.Archive(readFiles, { compress: 'gzip', level: 12 });
		await Bun.write(`./data/${backupFileName}.tar.gz`, archive);

		serverLogger.info(`Created Database Backup: ${backupFileName}.tar.gz!`);

		return Result.ok({
			backupName: backupFileName,
			backupDate: getTimestamp(date)
		});
	} catch {
		return Result.error(backupError());
	}
};

export const getDatabaseBackup = async (
	backupName: string
): Promise<Result<Bun.BunFile, BackupError>> => {
	const backupFile = Bun.file(`./data/${backupName}`);
	if (!(await backupFile.exists())) return Result.error(backupError());

	return Result.ok(backupFile);
};

export const getDatabaseBackupList = async (): Promise<Result<BackupList, BackupError>> => {
	const foundFiles = [];
	for await (const file of anyBackup.scan('./data')) {
		foundFiles.push(file);
	}

	const parsedFiles = foundFiles.map(
		(v): BackupInformation => ({ backupName: v, backupDate: timestampRegex.exec(v)?.[0]! })
	);

	return Result.ok({ backups: parsedFiles });
};

export const applyDatabaseBackup = async (backupName: string): Promise<Option<boolean>> => {
	const backupFile = Bun.file(`./data/${backupName}`);
	if (!(await backupFile.exists())) return Option.none();

	await fs.rm('./data/current', { recursive: true, force: true });
	await fs.mkdir('./data/current');

	const archive = new Bun.Archive(await backupFile.bytes(), { compress: 'gzip', level: 12 });
	await archive.extract('./data/current');

	await SendConfigureRequest({ databaseFilePath: 'env' });

	serverLogger.warning(`Applied database backup ${backupName}!`);

	return Option.some(true);
};

export const removeDatabaseBackup = async (backupName: string) => {
	await fs.rm(`./data/current/${backupName}`, { recursive: true, force: true });
};
