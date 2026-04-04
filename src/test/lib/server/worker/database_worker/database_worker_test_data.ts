export type DatabaseWorkerTestData<
	S extends object,
	I extends object = S,
	U extends object = I,
	R extends object = U
> = {
	select: S[];

	insert: I[];

	updateAll: U;
	updateAllResults: S[];

	updateOne: U;
	updateOneResult: S;

	removeOneResult: R;
	removeAllResults: R[];
};

export const getLookupTableData = (
	prefix: string
): DatabaseWorkerTestData<{ id: number; value: string }, { value: string }> => {
	const insert = [{ value: `${prefix}1` }, { value: `${prefix}2` }, { value: `${prefix}3` }];

	const select = [
		{ id: 1, value: insert[0].value },
		{ id: 2, value: insert[1].value },
		{ id: 3, value: insert[2].value }
	];

	const updateAll = { value: 'AllUpdatedValue' };
	const updateAllResults = select.map((v) => ({ id: v.id, value: updateAll.value }));

	const updateOne = { value: 'OneUpdatedValue' };
	const updateOneResult = { id: select[0].id, value: updateOne.value };

	const removeOneResult = updateOneResult;
	const removeAllResults = updateAllResults.slice(1);

	return {
		select,
		insert,

		updateAll,
		updateAllResults,

		updateOne,
		updateOneResult,

		removeOneResult,
		removeAllResults
	};
};

export const getShorthandTableData = (
	prefix: string
): DatabaseWorkerTestData<
	{ id: number; shortName: string; longName: string },
	{ shortName: string; longName: string }
> => {
	const insert = [
		{ shortName: `${prefix}ShortName1`, longName: `${prefix}LongName1` },
		{ shortName: `${prefix}ShortName2`, longName: `${prefix}LongName2` },
		{ shortName: `${prefix}ShortName3`, longName: `${prefix}LongName3` }
	];

	const select = [
		{ id: 1, shortName: insert[0].shortName, longName: insert[0].longName },
		{ id: 2, shortName: insert[1].shortName, longName: insert[1].longName },
		{ id: 3, shortName: insert[2].shortName, longName: insert[2].longName }
	];

	const updateAll = { shortName: 'AllUpdatedShortName', longName: 'AllUpdatedLongName' };
	const updateAllResults = select.map((v) => ({
		id: v.id,
		shortName: updateAll.shortName,
		longName: updateAll.longName
	}));

	const updateOne = { shortName: 'OneUpdatedShortName', longName: 'OneUpdatedLongName' };
	const updateOneResult = {
		id: select[0].id,
		shortName: updateOne.shortName,
		longName: updateOne.longName
	};

	const removeOneResult = updateOneResult;
	const removeAllResults = updateAllResults.slice(1);

	return {
		select,
		insert,

		updateAll,
		updateAllResults,

		updateOne,
		updateOneResult,

		removeOneResult,
		removeAllResults
	};
};

export const getBookTableData = (): DatabaseWorkerTestData<
	{ id: number; bookNameId: number },
	{ bookNameId: number }
> => {
	const insert = [{ bookNameId: 1 }, { bookNameId: 2 }, { bookNameId: 3 }];

	const select = [
		{ id: 1, bookNameId: insert[0].bookNameId },
		{ id: 2, bookNameId: insert[1].bookNameId },
		{ id: 3, bookNameId: insert[2].bookNameId }
	];

	const updateAll = { bookNameId: 2 };
	const updateAllResults = select.map((v) => ({ id: v.id, bookNameId: updateAll.bookNameId }));

	const updateOne = { bookNameId: 3 };
	const updateOneResult = { id: select[0].id, bookNameId: updateOne.bookNameId };

	const removeOneResult = updateAllResults[2];
	const removeAllResults = updateAllResults.slice(0, -1);

	return {
		select,
		insert,

		updateAll,
		updateAllResults,

		updateOne,
		updateOneResult,

		removeOneResult,
		removeAllResults
	};
};

export const getAuthorToBookData = (): DatabaseWorkerTestData<
	{ bookId: number; authorId: number },
	{ bookId: number; authorId: number },
	{ bookId: number }
> => {
	const insert = [
		{ bookId: 1, authorId: 1 },
		{ bookId: 2, authorId: 2 },
		{ bookId: 3, authorId: 3 }
	];

	const select = insert;

	const updateAll = { bookId: 1 };
	const updateAllResults = select.map((v) => ({ bookId: updateAll.bookId, authorId: v.authorId }));

	const updateOne = { bookId: 2 };
	const updateOneResult = { bookId: updateOne.bookId, authorId: select[0].authorId };

	const removeOneResult = { bookId: 2, authorId: 1 };
	const removeAllResults = updateAllResults.slice(1);

	return {
		select,
		insert,

		updateAll,
		updateAllResults,

		updateOne,
		updateOneResult,

		removeOneResult,
		removeAllResults
	};
};
