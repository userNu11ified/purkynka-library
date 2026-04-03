import type { SQLiteTable } from 'drizzle-orm/sqlite-core';

export type TableName<Table extends SQLiteTable> = Table['_']['name'];

export type TableColumns<Table extends SQLiteTable> = Table['_']['columns'];
export type TableColumnKeys<Table extends SQLiteTable> = keyof TableColumns<Table> & keyof Table;
