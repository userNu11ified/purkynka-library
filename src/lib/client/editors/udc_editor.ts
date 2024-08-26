import type { Nullable } from '$shared/common_types';
import { writable, type Writable } from 'svelte/store';

export type UDCEditorContext = { short_name: string; long_name: string };
export type UDCEditorErrorContext = {
	short_name: Set<string>;
	long_name: Set<string>;
};

export type UDCEditType = 'Přidat MDT' | 'Upravit MDT';
export const CURRENTLY_EDITING_UDC: Writable<Nullable<[UDCEditType, Nullable<number>]>> = writable(null);
