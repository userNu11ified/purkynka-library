import { camelCaseToKebabCase, type CamelCaseToKebabCase } from '../string_util';
import { DatabaseTableNames, type DatabaseTableName } from './schema';

export type APITableName = CamelCaseToKebabCase<DatabaseTableName>;
export const APITableNames = DatabaseTableNames.map((databaseTableName) =>
	camelCaseToKebabCase(databaseTableName)
);
