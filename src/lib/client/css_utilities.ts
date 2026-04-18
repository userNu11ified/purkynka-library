import { browser } from '$app/environment';

export const getCSSVariable = (variableName: string) => {
	if (!browser) return '1';

	return getComputedStyle(document.documentElement).getPropertyValue(variableName);
};

export const getCSSVariablePixels = (variableName: string) =>
	parseInt(getCSSVariable(variableName));

export class CSSVariables {
	public static get BORDER_WIDTH() {
		return getCSSVariablePixels('--border-width');
	}

	public static get SCROLLBAR_WIDTH() {
		return getCSSVariablePixels('--scrollbar-width');
	}
}
