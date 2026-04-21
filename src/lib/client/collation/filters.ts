import type { QueryState } from './query_state';

export const stringFilter = (value: string, queryState: QueryState) => {
	if (queryState.caseSensitive) return value.includes(queryState.trimmedQuery);
	return value.toLocaleLowerCase('cs').includes(queryState.lowercaseQuery);
};

export const stringFilterEqual = (value: string, queryState: QueryState) => {
	if (queryState.caseSensitive) return value === queryState.trimmedQuery;
	return value.toLocaleLowerCase('cs') === queryState.lowercaseQuery;
};
