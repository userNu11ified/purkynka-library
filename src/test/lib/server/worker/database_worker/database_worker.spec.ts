import { SendConfigureRequest } from '$server/worker/database_worker/messages/configure';
import { Result } from '$shared/types/result';
import { assert, describe, expect, it, suite } from 'vitest';
import {
	getAuthorToBookData,
	getBookTableData,
	getLookupTableData,
	getShorthandTableData,
	type DatabaseWorkerTestData
} from './database_worker_test_data';
import { SendInsertRequest } from '$server/worker/database_worker/messages/insert';
import { arrayMatchesPartially } from '$test/test_util';
import type { DatabaseSchema, DatabaseTableName } from '$shared/types/database/schema';
import { SendSelectRequest } from '$server/worker/database_worker/messages/select';
import type { WhereClause } from '$server/worker/database_worker/messages/where_clause';
import { SendUpdateRequest } from '$server/worker/database_worker/messages/update';
import { SendRemoveRequest } from '$server/worker/database_worker/messages/remove';

describe('Database Worker', async () => {
	const configureResult = await SendConfigureRequest({
		databaseFilePath: 'memory'
	});

	if (Result.isError(configureResult)) {
		assert.fail('Failed to configure Database Worker!');
	}

	const bookNames = getLookupTableData('bookName');
	const authorNames = getLookupTableData('authorName');
	const publishers = getLookupTableData('publisher');
	const placesOfPublishing = getLookupTableData('placeOfPublishing');
	const obtainedFrom = getLookupTableData('obtainedFrom');
	const discardReasons = getLookupTableData('discardReason');

	const literatureTypes = getShorthandTableData('literatureType');
	const udc = getShorthandTableData('udc');

	const books = getBookTableData();
	const authorToBook = getAuthorToBookData();

	suite('Insert Requests', () => {
		const insertRequestTest = <S extends object, I extends object>(
			tableName: DatabaseTableName,
			data: DatabaseWorkerTestData<S, I>
		) =>
			it(`Handles ${tableName} Requests`, async () => {
				const insertResult = await SendInsertRequest(tableName, data.insert);

				if (Result.isOk(insertResult)) {
					const { values } = insertResult.value;
					arrayMatchesPartially(data.select, values);
				} else {
					assert.fail('Database Worker returned an Error!');
				}
			});

		insertRequestTest('bookNames', bookNames);
		insertRequestTest('authorNames', authorNames);
		insertRequestTest('publishers', publishers);
		insertRequestTest('placesOfPublishing', placesOfPublishing);
		insertRequestTest('obtainedFrom', obtainedFrom);
		insertRequestTest('discardReasons', discardReasons);

		insertRequestTest('literatureTypes', literatureTypes);
		insertRequestTest('udc', udc);

		insertRequestTest('books', books);
		insertRequestTest('authorToBook', authorToBook);
	});

	suite('Insert Errors', () => {
		const insertErrorTest = (
			tableName: DatabaseTableName,
			data: object[],
			expectedErrorType: string
		) =>
			it(`Handles ${expectedErrorType} Errors`, async () => {
				const insertResult = await SendInsertRequest(tableName, data);

				if (Result.isError(insertResult)) {
					const error = insertResult.value;
					expect(error.errorType).toBe(expectedErrorType);
				} else {
					assert.fail('Database Worker did not return an Error!');
				}
			});

		insertErrorTest('bookNames', bookNames.select, 'primaryKeyConstraintViolated');
		insertErrorTest(
			'authorToBook',
			[{ bookId: 1000, authorId: 1000 }],
			'foreignKeyConstraintViolated'
		);
	});

	suite('Select Requests', () => {
		const selectRequestTest = <S extends object, I extends object>(
			tableName: DatabaseTableName,
			data: DatabaseWorkerTestData<S, I>
		) =>
			it(`Handles ${tableName} Requests`, async () => {
				const selectResult = await SendSelectRequest(tableName);

				if (Result.isOk(selectResult)) {
					const { values } = selectResult.value;

					values.forEach((selectedValue, i) => expect(selectedValue).toMatchObject(data.select[i]));
				} else {
					assert.fail('Database Worker returned an Error!');
				}
			});

		selectRequestTest('bookNames', bookNames);
		selectRequestTest('authorNames', authorNames);
		selectRequestTest('publishers', publishers);
		selectRequestTest('placesOfPublishing', placesOfPublishing);
		selectRequestTest('obtainedFrom', obtainedFrom);
		selectRequestTest('discardReasons', discardReasons);

		selectRequestTest('literatureTypes', literatureTypes);
		selectRequestTest('udc', udc);

		selectRequestTest('books', books);
		selectRequestTest('authorToBook', authorToBook);
	});

	suite('Select Requests with Where Clause', () => {
		const selectRequestWithWhereTest = <
			S extends object,
			const TableName extends DatabaseTableName
		>(
			tableName: TableName,
			where: WhereClause<DatabaseSchema[TableName]>,
			expectedValues: S[]
		) =>
			it(`Handles ${where.filterType} Filters`, async () => {
				const selectResult = await SendSelectRequest(tableName, where);

				if (Result.isOk(selectResult)) {
					const { values } = selectResult.value;

					expect(values.length).toBe(expectedValues.length);
					arrayMatchesPartially(expectedValues, values);
				} else {
					assert.fail('Database Worker returned an Error!');
				}
			});

		selectRequestWithWhereTest(
			'bookNames',
			{ filterType: 'eq', columnName: 'id', value: bookNames.select[0].id },
			[bookNames.select[0]]
		);

		selectRequestWithWhereTest(
			'bookNames',
			{ filterType: 'neq', columnName: 'id', value: 1 },
			bookNames.select.slice(1)
		);

		selectRequestWithWhereTest(
			'bookNames',
			{ filterType: 'inArray', columnName: 'id', values: [1, 3] },
			[bookNames.select[0], bookNames.select[2]]
		);

		selectRequestWithWhereTest(
			'bookNames',
			{ filterType: 'notInArray', columnName: 'id', values: [1, 3] },
			[bookNames.select[1]]
		);

		selectRequestWithWhereTest('bookNames', { filterType: 'gt', columnName: 'id', value: 2 }, [
			bookNames.select[2]
		]);

		selectRequestWithWhereTest(
			'bookNames',
			{ filterType: 'gte', columnName: 'id', value: 2 },
			bookNames.select.slice(1)
		);

		selectRequestWithWhereTest('bookNames', { filterType: 'lt', columnName: 'id', value: 2 }, [
			bookNames.select[0]
		]);

		selectRequestWithWhereTest(
			'bookNames',
			{ filterType: 'lte', columnName: 'id', value: 2 },
			bookNames.select.slice(0, 2)
		);

		selectRequestWithWhereTest(
			'bookNames',
			{
				filterType: 'and',
				filters: [
					{
						filterType: 'eq',
						columnName: 'id',
						value: 1
					},
					{
						filterType: 'eq',
						columnName: 'value',
						value: 'bookName1'
					}
				]
			},
			[bookNames.select[0]]
		);

		selectRequestWithWhereTest(
			'bookNames',
			{
				filterType: 'or',
				filters: [
					{
						filterType: 'eq',
						columnName: 'id',
						value: 1
					},
					{
						filterType: 'eq',
						columnName: 'value',
						value: 'bookName2'
					}
				]
			},
			bookNames.select.slice(0, 2)
		);
	});

	suite('Update Requests', () => {
		const updateRequestTest = <
			S extends object,
			I extends object,
			U extends object,
			const TableName extends DatabaseTableName
		>(
			tableName: TableName,
			data: DatabaseWorkerTestData<S, I, U>
		) =>
			it(`Handles ${tableName} Requests`, async () => {
				const updateResult = await SendUpdateRequest(tableName, data.updateAll);

				if (Result.isOk(updateResult)) {
					const { values } = updateResult.value;
					arrayMatchesPartially(data.updateAllResults, values);
				} else {
					assert.fail('Database Worker returned an Error!');
				}
			});

		updateRequestTest('bookNames', bookNames);
		updateRequestTest('authorNames', authorNames);
		updateRequestTest('publishers', publishers);
		updateRequestTest('placesOfPublishing', placesOfPublishing);
		updateRequestTest('obtainedFrom', obtainedFrom);
		updateRequestTest('discardReasons', discardReasons);

		updateRequestTest('literatureTypes', literatureTypes);
		updateRequestTest('udc', udc);

		updateRequestTest('books', books);
		updateRequestTest('authorToBook', authorToBook);
	});

	suite('Update Requests with Where Clause', () => {
		const updateRequestWithWhereTest = <
			S extends object,
			I extends object,
			U extends object,
			const TableName extends DatabaseTableName
		>(
			tableName: TableName,
			data: DatabaseWorkerTestData<S, I, U>,
			where: WhereClause<DatabaseSchema[TableName]>
		) =>
			it(`Handles ${tableName} Requests`, async () => {
				const updateResult = await SendUpdateRequest(tableName, data.updateOne, where);

				if (Result.isOk(updateResult)) {
					const { values } = updateResult.value;
					expect(values[0]).toMatchObject(data.updateOneResult);
				}
			});

		updateRequestWithWhereTest('bookNames', bookNames, {
			filterType: 'eq',
			columnName: 'id',
			value: 1
		});
		updateRequestWithWhereTest('authorNames', authorNames, {
			filterType: 'eq',
			columnName: 'id',
			value: 1
		});
		updateRequestWithWhereTest('publishers', publishers, {
			filterType: 'eq',
			columnName: 'id',
			value: 1
		});
		updateRequestWithWhereTest('placesOfPublishing', placesOfPublishing, {
			filterType: 'eq',
			columnName: 'id',
			value: 1
		});
		updateRequestWithWhereTest('obtainedFrom', obtainedFrom, {
			filterType: 'eq',
			columnName: 'id',
			value: 1
		});
		updateRequestWithWhereTest('discardReasons', discardReasons, {
			filterType: 'eq',
			columnName: 'id',
			value: 1
		});

		updateRequestWithWhereTest('literatureTypes', literatureTypes, {
			filterType: 'eq',
			columnName: 'id',
			value: 1
		});
		updateRequestWithWhereTest('udc', udc, {
			filterType: 'eq',
			columnName: 'id',
			value: 1
		});

		updateRequestWithWhereTest('books', books, {
			filterType: 'eq',
			columnName: 'id',
			value: 1
		});
		updateRequestWithWhereTest('authorToBook', authorToBook, {
			filterType: 'eq',
			columnName: 'authorId',
			value: 1
		});
	});

	suite('Update Errors', () => {
		const updateErrorTest = <const TableName extends DatabaseTableName>(
			tableName: TableName,
			newValue: object,
			where: WhereClause<DatabaseSchema[TableName]>,
			expectedErrorType: string
		) =>
			it(`Handles ${expectedErrorType} Errors`, async () => {
				const updateRequest = await SendUpdateRequest(tableName, newValue, where);

				if (Result.isError(updateRequest)) {
					const value = updateRequest.value;
					expect(value.errorType).toBe(expectedErrorType);
				} else {
					assert.fail('Database Worker did not return an Error!');
				}
			});

		updateErrorTest(
			'authorToBook',
			{ bookId: 2, authorId: 1 },
			{ filterType: 'eq', columnName: 'authorId', value: 3 },
			'primaryKeyConstraintViolated'
		);

		updateErrorTest(
			'bookNames',
			{ id: 1000 },
			{ filterType: 'eq', columnName: 'id', value: 3 },
			'foreignKeyConstraintViolated'
		);
	});

	suite('Remove Errors', () => {
		const removeErrorTest = <const TableName extends DatabaseTableName>(
			tableName: TableName,
			expectedErrorType: string,
			where: WhereClause<DatabaseSchema[TableName]>
		) =>
			it(`Handles ${expectedErrorType} Errors`, async () => {
				const removeResult = await SendRemoveRequest(tableName, where);

				if (Result.isError(removeResult)) {
					const value = removeResult.value;
					expect(value.errorType).toBe(expectedErrorType);
				}
			});

		removeErrorTest('bookNames', 'foreignKeyConstraintViolated', {
			filterType: 'eq',
			columnName: 'id',
			value: 3
		});
	});

	suite('Remove Requests with Where Clause', () => {
		const removeRequestWithWhereTest = <
			S extends object,
			I extends object,
			U extends object,
			const TableName extends DatabaseTableName
		>(
			tableName: TableName,
			data: DatabaseWorkerTestData<S, I, U>,
			where: WhereClause<DatabaseSchema[TableName]>
		) =>
			it(`Handles ${tableName} Requests`, async () => {
				const removeResult = await SendRemoveRequest(tableName, where);

				if (Result.isOk(removeResult)) {
					const { values } = removeResult.value;
					expect(values[0]).toMatchObject(data.removeOneResult);
				} else {
					assert.fail('Database Worker returned an error!');
				}
			});

		removeRequestWithWhereTest('bookNames', bookNames, {
			filterType: 'eq',
			columnName: 'id',
			value: 1
		});
		removeRequestWithWhereTest('publishers', publishers, {
			filterType: 'eq',
			columnName: 'id',
			value: 1
		});
		removeRequestWithWhereTest('placesOfPublishing', placesOfPublishing, {
			filterType: 'eq',
			columnName: 'id',
			value: 1
		});
		removeRequestWithWhereTest('obtainedFrom', obtainedFrom, {
			filterType: 'eq',
			columnName: 'id',
			value: 1
		});
		removeRequestWithWhereTest('discardReasons', discardReasons, {
			filterType: 'eq',
			columnName: 'id',
			value: 1
		});

		removeRequestWithWhereTest('literatureTypes', literatureTypes, {
			filterType: 'eq',
			columnName: 'id',
			value: 1
		});
		removeRequestWithWhereTest('udc', udc, {
			filterType: 'eq',
			columnName: 'id',
			value: 1
		});

		removeRequestWithWhereTest('authorToBook', authorToBook, {
			filterType: 'eq',
			columnName: 'authorId',
			value: 1
		});
		removeRequestWithWhereTest('books', books, {
			filterType: 'eq',
			columnName: 'id',
			value: 3
		});
		removeRequestWithWhereTest('authorNames', authorNames, {
			filterType: 'eq',
			columnName: 'id',
			value: 1
		});
	});
});
