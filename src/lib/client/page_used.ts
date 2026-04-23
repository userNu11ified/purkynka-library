import type { RouteId } from '$app/types';
import type { Nullable } from '$shared/types/util';
import { PersistedState } from 'runed';

export const createPageUsed = (pageGroupIdentifier: string, defaultPage?: Nullable<RouteId>) =>
	new PersistedState<Nullable<RouteId>>(pageGroupIdentifier, defaultPage!);
