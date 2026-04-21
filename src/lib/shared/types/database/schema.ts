import schema from '$shared/database/schema';
import type { ValueOf } from '../util';
import type { TableName } from './drizzle';

export type DatabaseSchema = typeof schema;

export type DatabaseTable = ValueOf<DatabaseSchema>;

export type DatabaseTableName = TableName<DatabaseTable>;
export const DatabaseTableNames = Object.keys(schema) as DatabaseTableName[];
export const isDatabaseTableName = (value: string): value is DatabaseTableName =>
	DatabaseTableNames.includes(value as DatabaseTableName);

export type DatabaseNotMatchedByIdTableName = (typeof DatabaseNotMatchedByIdTableNames)[number];
export const DatabaseNotMatchedByIdTableNames = [
	'authorToBook'
] as const satisfies DatabaseTableName[];
export const isDatabaseNotMatchedByIdTableName = (
	value: string
): value is DatabaseNotMatchedByIdTableName =>
	DatabaseNotMatchedByIdTableNames.includes(value as DatabaseNotMatchedByIdTableName);

export type DatabaseMatchedByIdTableName = Exclude<
	DatabaseTableName,
	DatabaseNotMatchedByIdTableName
>;
export const DatabaseMatchedByIdTableNames = DatabaseTableNames.filter(
	(v) => !isDatabaseNotMatchedByIdTableName(v)
);
export const isDatabaseMatchedByIdTableName = (
	value: string
): value is DatabaseMatchedByIdTableName =>
	DatabaseMatchedByIdTableNames.includes(value as DatabaseMatchedByIdTableName);
