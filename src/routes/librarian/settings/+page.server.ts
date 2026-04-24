import { getDatabaseBackupList } from '$server/backup/backup';
import { Result } from '$shared/types/result';
import type { PageServerLoad } from './$types';

export const load: PageServerLoad = async ({ depends }) => {
	const backups = await getDatabaseBackupList();

	depends('app:backups');

	return { backups: Result.isError(backups) ? [] : backups.value.backups };
};
