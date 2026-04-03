import { int, SQLiteColumn } from 'drizzle-orm/sqlite-core';

export const primaryKeyId = () => int().primaryKey({ autoIncrement: true }).notNull();
export const foreignKeyId = <const ForeignColumn extends SQLiteColumn>(
	foreignColumn: ForeignColumn
) => int().references(() => foreignColumn);

export const boolean = () => int({ mode: 'boolean' });
export const date = () => int({ mode: 'timestamp' });
