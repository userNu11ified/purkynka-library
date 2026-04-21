import { isAPITableName } from '$shared/types/database/api';
import type { ParamMatcher } from '@sveltejs/kit';

export const match = isAPITableName satisfies ParamMatcher;
