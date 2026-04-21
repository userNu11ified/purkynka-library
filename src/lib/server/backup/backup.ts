import { serverLogger } from '$server/server_loggers';
import { Glob } from 'bun';
import fs from 'node:fs/promises';

const anyFile = new Glob('*');

export const createDatabaseBackup = async (backupName?: string) => {
	const foundFiles = [];
	for await (const file of anyFile.scan('./data/current')) {
		foundFiles.push(file);
	}

	if (foundFiles.length === 0) return;

	const dateIso = new Date().toISOString();
	const backupNamePathPart = backupName !== undefined ? `-${backupName}-` : '-';
	const backupPath = `data/backup${backupNamePathPart}${dateIso}`;

	await fs.mkdir(backupPath);

	await Promise.all(foundFiles.map((v) => fs.rename(`data/current/${v}`, `${backupPath}/${v}`)));
	serverLogger.info(`Created Database Backup: ${backupPath}!`);
};
