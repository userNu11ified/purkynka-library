import { type } from 'arktype';
import { descriptiveErrorConstructor } from './descriptive_error';

export const backupBody = type({
	type: "'list' | 'create'"
}).or({
	type: "'delete' | 'apply' | 'download'",
	backupName: 'string'
});

export type BackupBody = typeof backupBody.infer;

export const backupError = descriptiveErrorConstructor(
	'backupError',
	'There was an error during a backup operation!'
);
export type BackupError = ReturnType<typeof backupError>;

export const backupInformation = type({
	backupName: 'string',
	backupDate: 'string'
});
export type BackupInformation = typeof backupInformation.infer;

export type BackupList = {
	backups: BackupInformation[];
};
