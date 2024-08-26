import * as t from 'io-ts';
import { either } from 'fp-ts/Either';

interface PositiveBrand {
	readonly Positive: unique symbol;
}

export const TPositive = t.brand(
	t.number,
	(number): number is t.Branded<number, PositiveBrand> => number >= 0,
	'Positive'
);
export type Positive = t.TypeOf<typeof TPositive>;

export const TPositiveInteger = t.intersection([t.Int, TPositive]);
export type PositiveInteger = t.TypeOf<typeof TPositiveInteger>;

export const TID = TPositiveInteger;
export type ID = PositiveInteger;

export const TNullable = <T extends t.Mixed>(type_codec: T) => t.union([type_codec, t.null]);
export type Nullable<T> = t.TypeOf<ReturnType<typeof TNullable<t.Type<T>>>>;

export const TNullableString = TNullable(t.string);

export const TDate = new t.Type<Date, string, unknown>(
	'DateType',
	(val): val is Date => val instanceof Date,
	(val, context) =>
		either.chain(t.string.validate(val, context), (date_string) => {
			const date = new Date(date_string);
			return isNaN(date.getTime()) ? t.failure(val, context) : t.success(date);
		}),
	(val) => val.toISOString()
);
