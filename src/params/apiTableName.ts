import { APITableNames, type APITableName } from '$shared/types/database/api';
import type { ParamMatcher } from '@sveltejs/kit';

export const match = ((param: string): param is APITableName =>
	APITableNames.includes(param as APITableName)) satisfies ParamMatcher;
