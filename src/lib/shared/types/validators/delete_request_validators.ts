import { type } from 'arktype';

export const deleteByIdBody = type({
	ids: 'number[] > 0'
});

export const deleteAuthorToBookBody = type({
	deleteBy: "'bookId' | 'authorId'",
	ids: 'number[] > 0'
}).or(
	type({
		deleteBy: "'both'",
		ids: type({
			bookId: 'number',
			authorId: 'number'
		})
			.array()
			.atLeastLength(1)
	})
);
