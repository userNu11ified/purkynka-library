import schema from '$shared/database/schema';
import type { ValueOf } from '../util';
import type { TableName } from './drizzle';

export type DatabaseSchema = typeof schema;

export type DatabaseTable = ValueOf<DatabaseSchema>;

export type DatabaseTableName = TableName<DatabaseTable>;
export const DatabaseTableNames = Object.keys(schema) as DatabaseTableName[];
