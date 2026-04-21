import type { DatabaseWorkerError } from '$server/worker/database_worker/messages/error';
import type {
	FailedToDelete,
	FailedToPatch,
	FailedToPost,
	ValidationError
} from '$shared/error/api_error';
import type { DatabaseTableName } from '$shared/types/database/schema';
import type { Result } from '$shared/types/result';
import { camelCaseToKebabCase, type CamelCaseToKebabCase } from '$shared/types/string_util';

export type PostError = DatabaseWorkerError | FailedToPost | ValidationError;
export type PatchError = DatabaseWorkerError | FailedToPatch | ValidationError;
export type DeleteError = DatabaseWorkerError | FailedToDelete | ValidationError;

export abstract class TableData<
	T,
	PostOptions,
	PatchOptions,
	DeleteOptions,
	const TableName extends DatabaseTableName
> {
	protected databaseTableName: TableName;
	protected apiTableName: CamelCaseToKebabCase<TableName>;

	protected array: T[];

	constructor(databaseTableName: TableName) {
		this.databaseTableName = databaseTableName;
		this.apiTableName = camelCaseToKebabCase(databaseTableName);

		this.array = $state([]);
	}

	public initialize(array: typeof this.array) {
		this.array = array;
	}

	public getDatabaseTableName() {
		return this.databaseTableName;
	}

	public getArray() {
		return this.array;
	}

	public abstract post(postOptions: PostOptions): Promise<Result<T[], PostError>>;
	public abstract patch(patchOptions: PatchOptions): Promise<Result<T[], PatchError>>;
	public abstract delete(deleteOptions: DeleteOptions): Promise<Result<T[], DeleteError>>;
}
