const UPPERCASE_LETTER = /([A-Z])/g;
export const camelCaseToKebabCase = <const Text extends string>(text: Text) =>
	text.replaceAll(UPPERCASE_LETTER, (s) => `-${s.toLowerCase()}`) as CamelCaseToKebabCase<Text>;

export type CamelCaseToKebabCase<S extends string> = S extends `${infer T}${infer U}`
	? `${T extends Capitalize<T> ? '-' : ''}${Lowercase<T>}${CamelCaseToKebabCase<U>}`
	: S;
