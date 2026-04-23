import type { FlattenedResult, Result } from '../result';
import { camelCaseToKebabCase, type CamelCaseToKebabCase } from '../string_util';
import {
	DatabaseMatchedByIdTableNames,
	DatabaseNotMatchedByIdTableNames,
	DatabaseTableNames,
	type DatabaseMatchedByIdTableName,
	type DatabaseNotMatchedByIdTableName,
	type DatabaseTableName
} from './schema';

export type APITableName = CamelCaseToKebabCase<DatabaseTableName>;
export const APITableNames = DatabaseTableNames.map(camelCaseToKebabCase);
export const isAPITableName = (value: string): value is APITableName =>
	APITableNames.includes(value as APITableName);
export const databaseTableNameFromAPITableName = (apiTableName: APITableName) =>
	DatabaseTableNames[APITableNames.indexOf(apiTableName)];

export type APINotMatchedByIdTableName = CamelCaseToKebabCase<DatabaseNotMatchedByIdTableName>;
export const APINotMatchedByIdTableNames =
	DatabaseNotMatchedByIdTableNames.map(camelCaseToKebabCase);
export const isAPINotMatchedByIdTableName = (value: string): value is APINotMatchedByIdTableName =>
	APINotMatchedByIdTableNames.includes(value as APINotMatchedByIdTableName);

export type APIMatchedByIdTableName = CamelCaseToKebabCase<DatabaseMatchedByIdTableName>;
export const APIMatchedByIdTableNames = DatabaseMatchedByIdTableNames.map(camelCaseToKebabCase);
export const isAPIMatchedByIdTableName = (value: string): value is APIMatchedByIdTableName =>
	APIMatchedByIdTableNames.includes(value as APIMatchedByIdTableName);

export const getAPIEndpointURL = (endpoint: string) =>
	`${window.location.origin}/api/v2/${endpoint}`;

export const getEndpointURL = (endpoint: string) => `${window.location.origin}/${endpoint}`;

type SupportedHTTPMethod = 'GET' | 'POST' | 'PATCH' | 'DELETE';

export const makeAPIJsonRequest = <R extends Result<unknown, unknown>>(
	method: SupportedHTTPMethod,
	endpoint: string,
	body?: any
) =>
	fetch(getAPIEndpointURL(endpoint), {
		method,
		body: body === undefined ? undefined : JSON.stringify(body)
	})
		.then((r) => {
			if (!r.ok) window.location.reload();
			return r as Response;
		})
		.then((r) => {
			r.json() as FlattenedResult<R>;
		});

export const makeRequest = <T = any>(method: SupportedHTTPMethod, endpoint: string, body?: T) =>
	fetch(getEndpointURL(endpoint), {
		method,
		body: body === undefined ? undefined : JSON.stringify(body)
	}).then((r) => {
		if (!r.ok) window.location.reload();
		return r as Response;
	});
