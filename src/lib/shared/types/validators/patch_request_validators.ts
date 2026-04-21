import { type } from 'arktype';
import { objectWithAtLeastOneProperty } from './validator_util';

export const patchByIdBody = type({
	ids: 'number[] > 0',
	newValue: objectWithAtLeastOneProperty
});
