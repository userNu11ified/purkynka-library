import { DATABASE } from '$client/database/database';
import { map_or_null } from '$shared/book_util';
import type { Nullable } from '$shared/common_types';
import { get } from 'svelte/store';

export type InputSnapshot = {
	editor_context: any;
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

export const NUMBER_CHECKER: ErrorChecker = (snapshot) => {
	return isNaN(+snapshot.context_value) ? 'Položka musí být číslo!' : null;
};

export const UNIQUE_READER_CHECKER: ErrorChecker = (snapshot) => {
	if (snapshot.editor_context['name'] === '' || snapshot.editor_context['class_name'] === '') return null;
	if (typeof snapshot.editor_context['class_name'] === 'string') return null;

	const database = get(DATABASE);
	const found_identical_reader_id = database.readers.findIndex(
		(v) => v.name === snapshot.editor_context['name'] && v.class_name === snapshot.editor_context['class_name']
	);

	return found_identical_reader_id === -1 ? null : 'Nalezen čtenář se stejným jménem a třídou!';
};
