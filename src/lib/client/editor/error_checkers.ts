import type { Nullable } from '$shared/common_types';

export type InputSnapshot = {
	context_value: string | number;
	string_value: string;
	special_adder: boolean;
};

export type ErrorChecker = (snapshot: InputSnapshot) => Nullable<string>;

export const REQUIRED_CHECKER: ErrorChecker = (snapshot) => {
	if (snapshot.string_value === '') return 'Povinná položka!';

	return null;
};

export const ID_REQUIRED_CHECKER: ErrorChecker = (snapshot) => {
	if (snapshot.string_value !== '' && typeof snapshot.context_value !== 'number')
		return 'Položka musí být vybrána z listu!';

	return null;
};

export const DATE_CHECKER: ErrorChecker = (snapshot) => {
	if (
		snapshot.string_value !== '' &&
		!/^(0?[1-9]|[12][0-9]|3[01])\.\s*(0?[1-9]|1[012])\.\s*\d+$/g.test(snapshot.string_value)
	)
		return 'Špatný formát! (D. M. RRRR)';

	return null;
};

export const SPECIAL_ADDER_CHECKER: ErrorChecker = (snapshot) => {
	if (snapshot.special_adder && snapshot.string_value !== '' && typeof snapshot.context_value !== 'number')
		return 'Položka musí být vybrána z listu nebo přidána tlačítkem + vpravo!';

	return null;
};

export const PASSWORD_CHECKER: ErrorChecker = (snapshot) => {
	if (snapshot.string_value.length < 8) return 'Heslo musí být minimálně 8 znaků dlouhé!';
	if (/[^a-zA-Z0-9\.\-\_\:]/g.test(snapshot.string_value)) return 'Heslo může obsahovat jen: a-Z 0-9 . - _ :';
	return null;
};
