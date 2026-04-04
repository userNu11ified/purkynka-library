import { descriptiveErrorConstructor } from '$shared/types/descriptive_error';

const unknownDatabaseError = descriptiveErrorConstructor(
	'unknownDatabaseError',
	'The database ran into an unexpected error!'
);
export type UnknownDatabaseError = ReturnType<typeof unknownDatabaseError>;

const primaryKeyConstraintViolated = descriptiveErrorConstructor(
	'primaryKeyConstraintViolated',
	'The request violated the primary key constraints of the table!'
);
export type PrimaryKeyConstraintViolated = ReturnType<typeof primaryKeyConstraintViolated>;

const foreignKeyConstraintViolated = descriptiveErrorConstructor(
	'foreignKeyConstraintViolated',
	'The request violated the foreign key constraints of the table!'
);
export type ForeignKeyConstraintViolated = ReturnType<typeof foreignKeyConstraintViolated>;

export const DatabaseWorkerError = {
	unknownDatabaseError,
	primaryKeyConstraintViolated,
	foreignKeyConstraintViolated
};

export type DatabaseWorkerError =
	| UnknownDatabaseError
	| PrimaryKeyConstraintViolated
	| ForeignKeyConstraintViolated;
