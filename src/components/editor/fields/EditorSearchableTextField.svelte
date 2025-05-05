<script lang="ts" generics="T">
	import {
		get_editor_context,
		get_editor_error_context,
		type EditorContext,
		type EditorErrorContext
	} from '$client/editor/editor';
	import type { ErrorChecker, InputSnapshot } from '$client/editor/error_checkers';
	import type { ListItem } from '$client/list/list';
	import { percent } from '$client/style/css';
	import { WINDOW_HEIGHT } from '$client/window/window';
	import Icon from '$components/icon/Icon.svelte';
	import type { ID, Nullable } from '$shared/common_types';
	import { fade } from 'svelte/transition';
	import EditorTextField from './EditorTextField.svelte';
	import { tick } from 'svelte';

	// VALUE
	export let value: Nullable<T>;
	export let item_stringifier = (item: T) => `${item}`;

	let string_value = value === null ? '' : item_stringifier(value);
	export const update_string_value = (value: Nullable<T>, should_update_context = true) => {
		string_value = value === null ? '' : item_stringifier(value);
		if (should_update_context) update_context(string_value);
	};
	$: update_string_value(value);

	// SEARCHING
	export let sorter: (left: [number, T], right: [number, T]) => number;
	export let filter: (lowercase_query: string, item: T) => boolean = (lowercase_query, item) =>
		item_stringifier(item).trim().toLocaleLowerCase('cs').includes(lowercase_query);
	export let id_mapper = (items: T[], lowercase_query: string) =>
		items.findIndex((v) => lowercase_query === item_stringifier(v).trim().toLocaleLowerCase('cs'));
	export let search_result_max_count: Nullable<number> = 10;
	export let base_item_id_mapper: (item: T, index: number) => [number, T] = (item, index) => [index, item];
	export let items: T[];
	$: base_items = structuredClone(items).map(base_item_id_mapper).sort(sorter);

	export let option_filter: (item: [number, T]) => boolean = () => true;

	const get_items = (items: [number, T][], option_filter: (item: [number, T]) => boolean) =>
		structuredClone(items).filter(option_filter);

	$: current_items = get_items(base_items, option_filter);

	export const recalculate_items = () => {
		current_items = get_items(base_items, option_filter);
	};

	let input_element: EditorTextField;

	export const focus = () => input_element.focus();
	let focused = false;
	const on_focus_in = () => {
		if (reset_on_focus) update_string_value(null);
		focused = true;
	};
	const on_focus_out = (e: FocusEvent) => {
		if (search_results_container?.contains(e.relatedTarget as HTMLElement)) return;
		focused = false;
	};

	const get_search_results = (current_items: [number, T][], string_value: string) => {
		const lowercase_query = string_value.trim().toLocaleLowerCase('cs');
		const found_items = [];

		for (let i = 0; i < current_items.length; i++) {
			if (filter(lowercase_query, current_items[i][1])) found_items.push(current_items[i]);
			if (found_items.length === search_result_max_count) break;
		}

		return found_items;
	};

	let editor_searchable_text_field_container: HTMLDivElement;
	let search_results_container: HTMLDivElement;
	$: search_results = get_search_results(current_items, string_value);

	// HIDE NOTHING FOUND AFTER 2 SECONDS
	let hide_nothing_found: boolean = false;
	let hide_nothing_found_timeout: number | undefined = undefined;

	const check_search_results = (search_results: [number, T][]) => {
		clearTimeout(hide_nothing_found_timeout);

		if (search_results.length === 0) {
			hide_nothing_found_timeout = setTimeout(() => (hide_nothing_found = true), 2000) as any;
		} else {
			hide_nothing_found = false;
		}
	};

	$: check_search_results(search_results);

	const on_click_search_result = (id: number) => {
		update_context(id);
		string_value = item_stringifier(current_items.find(([item_id, item_value]) => item_id === id)![1]);
		focused = false;
	};

	const is_up = () => {
		const rect = editor_searchable_text_field_container.getBoundingClientRect();
		return rect.bottom >= $WINDOW_HEIGHT / 1.5;
	};

	export let get_option_key: (item: ListItem<T>) => any = (item: ListItem<T>) => item[0];

	// PRESELECTED OPTIONS
	export let preselected_ids: Nullable<number[]> = null;
	$: preselected_search_results = preselected_ids?.map((v) => current_items.find(([id]) => id === v)!);

	// OPTION SELECTED
	export let on_option_selected: Nullable<(value: Nullable<number | string>) => void> = null;

	// CONTEXT UPDATING
	export let context_field: Nullable<string> = null;
	const editor_context = get_editor_context<EditorContext>();

	const update_context = (string_value: string | number) => {
		if (context_field === null) return;

		editor_context.update((v) => {
			if (typeof string_value === 'string') {
				const found_id = id_mapper(items, string_value.trim().toLocaleLowerCase('cs'));
				const value = found_id === -1 ? (string_value === '' ? null : string_value.trim()) : found_id;

				v[context_field] = value;
				if (on_option_selected !== null) on_option_selected(value);
			} else {
				v[context_field] = string_value;
				if (on_option_selected !== null) on_option_selected(string_value);
			}

			return v;
		});
	};

	// POST INPUT ACTION
	export let after_input: Nullable<() => void> = null;

	// ERROR CHECKING
	export let error_checkers: ErrorChecker[] = [];
	const editor_error_context = get_editor_error_context<EditorErrorContext>();

	const check_errors = (editor_context: EditorContext, string_value: string) => {
		if (error_checkers.length === 0 || context_field === null) return;

		editor_error_context.update((v) => {
			const errors = new Set<string>();

			const snapshot: InputSnapshot = {
				context_value: editor_context[context_field],
				string_value,
				special_adder: $$slots['special-adder']
			};

			error_checkers.forEach((error_checker) => {
				const error_value = error_checker(snapshot);
				if (error_value !== null) errors.add(error_value);
			});

			v[context_field] = errors;
			return v;
		});
	};

	const get_errors = (error_context: EditorErrorContext) => {
		if (context_field === null || error_context[context_field] === undefined) return null;
		const error_array = [...error_context[context_field].values()];
		return error_array.length === 0 ? null : error_array;
	};

	$: check_errors($editor_context, string_value);
	$: errors = get_errors($editor_error_context);

	// SPECIAL ADDER
	let special_adder_open = false;

	const on_click_special_adder = () => (special_adder_open = true);

	const special_adder_submit = async (id: number) => {
		await tick();
		current_items = get_items(base_items, option_filter);
		update_context(id);
		string_value = item_stringifier(current_items.find(([item_id, item]) => item_id === id)![1]);
		special_adder_open = false;
	};

	const special_adder_cancel = () => (special_adder_open = false);

	// EDITOR
	export let has_editor: Nullable<boolean> = null;
	let editor_open = false;
	$: editor_button_visible = has_editor && context_field && typeof $editor_context[context_field!] === 'number';
	export let on_click_editor: Nullable<(id: number) => void> = null;
	const on_click_editor_button = () => {
		if (on_click_editor) on_click_editor($editor_context[context_field!]);
	};

	// STYLE
	export let error_left: Nullable<boolean> = null;
	export let center: Nullable<boolean> = null;
	export let flex: Nullable<boolean> = null;
	export let reset_on_focus: Nullable<boolean> = null;
	export let width: string = percent(100);
	export let placeholder: Nullable<string> = null;
</script>

{#if editor_open}
	<slot name="editor"></slot>
{/if}

{#if special_adder_open}
	<slot name="special-adder" submit={special_adder_submit} cancel={special_adder_cancel}></slot>
{/if}

<div
	class="editor-searchable-text-field"
	class:flex
	style:--width={width}
	bind:this={editor_searchable_text_field_container}
>
	<EditorTextField
		context_field={null}
		bind:value={string_value}
		bind:this={input_element}
		{center}
		{width}
		{placeholder}
		on:focusin={on_focus_in}
		on:focusout={on_focus_out}
		on:input={() => update_context(string_value)}
		{after_input}
	></EditorTextField>
	<div class="extra-buttons">
		{#if editor_button_visible}
			<button class="extra-button" on:click={on_click_editor_button}>
				<Icon type="edit" size={24}></Icon>
			</button>
		{:else if $$slots['special-adder']}
			<button class="extra-button" on:click={on_click_special_adder}>
				<Icon type="plus"></Icon>
			</button>
		{/if}
	</div>
	{#if errors !== null}
		<div class="error" style:--width={width} class:visible={focused}>
			<div class="error-text" class:error-left={error_left}>
				{#each errors as error, i}
					<div class="line">{error}</div>
					{#if i !== errors.length - 1}
						<br />
					{/if}
				{/each}
			</div>
		</div>
	{/if}
	{#if focused && hide_nothing_found !== true}
		<div
			class="search-results"
			class:hide-border={string_value !== '' && search_results.length === 0}
			class:up={is_up()}
			bind:this={search_results_container}
			transition:fade={{ duration: 250 }}
		>
			{#each string_value === '' && preselected_search_results !== undefined ? preselected_search_results : search_results as [id, item] (get_option_key( [id, item] ))}
				<button
					class="button search-result"
					class:selected={$editor_context[context_field ?? ''] === id}
					on:click={() => on_click_search_result(id)}
					on:focusout={on_focus_out}
				>
					<slot name="search-result" {id} {item}>
						{item_stringifier(item)}
					</slot>
				</button>
			{/each}
		</div>
	{/if}
</div>

<style>
	.editor-searchable-text-field {
		flex: 0 0 auto;

		position: relative;
		width: var(--width);

		&.flex {
			flex: 1 1 auto;
		}

		&:hover .error-text {
			display: block;
		}
	}

	.search-results {
		--offset: calc(100% + 6px);
		position: absolute;
		top: var(--offset);

		display: flex;
		flex-direction: column;
		gap: var(--border-width);

		min-width: 256px;
		width: 100%;
		max-height: 256px;

		border: var(--border);
		border-radius: var(--border-radius-regular) 0px 0px var(--border-radius-regular);

		background-color: var(--border-color);

		overflow-y: scroll;

		z-index: 10;

		box-shadow: var(--box-shadow);

		&.up {
			top: unset;
			bottom: var(--offset);
		}

		&::-webkit-scrollbar {
			width: calc(var(--scrollbar-width) + var(--border-width));

			border-left: var(--border);

			background: var(--base-surface);
		}

		&::-webkit-scrollbar-thumb {
			background: var(--scrollbar-thumb-color);
		}
	}

	.hide-border {
		border: none;
	}

	.search-result {
		flex: 0 0 auto;

		min-height: 32px;
		height: max-content;

		padding: 8px;
		text-align: left;

		color: var(--text-color);
		background-color: var(--base-surface);

		&.selected {
			font-weight: bold;
		}
	}

	.error {
		position: absolute;
		top: 0;
		left: 0;

		width: var(--width);
		height: var(--field-height);

		border: var(--border);
		border-color: var(--error-600);
		border-radius: var(--border-radius-regular);

		pointer-events: none;

		&.visible .error-text {
			display: block;
		}
	}

	.error-text {
		display: none;

		position: absolute;
		left: calc(100% + 8px);
		top: 50%;

		transform: translateY(-50%);

		width: max-content;

		padding: 8px 16px;
		border: var(--border);
		border-color: var(--error-600);
		border-radius: var(--border-radius-regular);

		background-color: var(--base-surface);

		z-index: 100;

		&.error-left {
			left: unset;
			right: calc(100% + 8px);
		}
	}

	.extra-buttons {
		display: flex;

		position: absolute;
		right: 4px;
		top: 50%;

		transform: translateY(-50%);

		height: 32px;
		width: max-content;
	}

	.extra-button {
		display: grid;
		place-items: center;

		height: 32px;
		width: 32px;

		border-radius: var(--border-radius-regular);

		color: var(--text-color);
	}
</style>
