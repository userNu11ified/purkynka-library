import { expect } from 'vitest';

export const arrayMatchesPartially = (original: object[], checked: object[]) =>
	checked.forEach((v, i) => expect(v).toMatchObject(original[i]));
