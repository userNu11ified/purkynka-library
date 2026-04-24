import { getDatabaseBackupList } from '$server/backup/backup';
import { Result } from '$shared/types/result';
import type { PageServerLoad } from './$types';

export const load: PageServerLoad = async () => {
	const backups = await getDatabaseBackupList();

	return { backups: Result.isError(backups) ? [] : backups.value.backups };
};
