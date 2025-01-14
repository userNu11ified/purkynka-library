<script lang="ts" generics="T, V">
	import { writable } from 'svelte/store';

	import { STUDENT_DATABASE } from '$client/student/student';

	import Icon from '$components/icon/Icon.svelte';

	import { sum } from '$client/math/math';

	import type { Nullable } from '$shared/common_types';

	import { BORDER_WIDTH, SCROLLBAR_WIDTH } from '$client/style/theme';

	import {
		ACTION_BAR_HEIGHT,
		FORCE_UPDATE,
		get_list_height,
		HEADER_HEIGHT,
		ITEM_SIZE,
		SEARCH_BAR_HEIGHT,
		type CopyTransformer,
		type Filter,
		type ItemMapper,
		type ListItem,
		type Sorter
	} from '$client/list/list';
	import {
		get_default_column_sizes,
		get_minimum_column_sizes,
		get_usable_width,
		resize_columns
	} from '$client/list/resizing';
	import { setup_synced_store } from '$client/local_storage/local_storage';
	import { percent, pixels } from '$client/style/css';
	import { WINDOW_HEIGHT, WINDOW_WIDTH } from '$client/window/window';
	import { onDestroy, onMount } from 'svelte';
	import ListSortIcon from './ListSortIcon.svelte';
	import { get_placeholder, type SearchedBy, type SortedBy } from '$client/list/search';
	import VirtualList from 'svelte-tiny-virtual-list';
	import ListAction from './ListAction.svelte';
	import { tick } from 'svelte';
	import CopyPartEditor from './CopyPartEditor.svelte';

	export let local_storage_key: string;
	export let headers: string[];
	export let items: T[];
	export let item_mapper: ItemMapper<T, V>;

	// LIST STUFF
	$: list_height = get_list_height($WINDOW_HEIGHT);
	$: visible_items = Math.ceil(list_height / 34);

	let scroll_to_index: number | undefined = undefined;
	let searched_item: Nullable<number> = null;
	export let has_options: boolean = true;
	export let has_sidebar: boolean = true;

	export const go_to_index = async (index: number | undefined, search: boolean = false) => {
		scroll_to_index = index;

		if (search) {
			searched_item = index === undefined ? null : index;
		} else {
			searched_item = null;
		}

		await tick();
		scroll_to_index = undefined;
	};

	const has_border = (current_items: ListItem<V>[]) => current_items.length <= visible_items;
	$: last_has_border = has_border(current_items);

	export let sync_to_local_storage = true;

	export let placeholders: Nullable<Nullable<string>[]> = null;

	// RESIZING

	const minimum_column_sizes = get_minimum_column_sizes(headers);
	const [column_sizes, column_sizes_unsubscriber] = sync_to_local_storage
		? setup_synced_store(
				`${local_storage_key}-columns`,
				get_default_column_sizes(get_usable_width($WINDOW_WIDTH, headers, has_options, has_sidebar), headers)
			)
		: [
				writable(get_default_column_sizes(get_usable_width($WINDOW_WIDTH, headers, has_options, has_sidebar), headers)),
				null
			];
	$: usable_width = get_usable_width($WINDOW_WIDTH, headers, has_options, has_sidebar);
	$: grid_layout = `${$column_sizes.map((v) => pixels(v)).join(' ')} ${has_options ? pixels(ITEM_SIZE) : ''}`;

	let resizing: Nullable<number> = null;

	const on_mouse_down_resizer = (index: number) => (resizing = index);
	const on_mouse_move_resizer = (e: MouseEvent) => {
		if (resizing === null) return;
		$column_sizes = resize_columns(resizing, $column_sizes, minimum_column_sizes, usable_width, e.movementX);
	};
	const on_mouse_up_resizer = () => (resizing = null);

	const reset_column_sizes = () =>
		($column_sizes = get_default_column_sizes(
			get_usable_width($WINDOW_WIDTH, headers, has_options, has_sidebar),
			headers
		));

	// SORTING

	export let sorters: (Sorter<V> | Sorter<V>[])[];

	const [sorted_by, sorted_by_unsubscriber] = sync_to_local_storage
		? setup_synced_store<SortedBy>(`${local_storage_key}-sorted-by`, [0, false])
		: [writable<SortedBy>([0, false]), null];

	const on_click_header = (e: MouseEvent, index: number) => {
		if ($sorted_by[0] === index) $sorted_by[1] = !$sorted_by[1];
		else $sorted_by = [index, false];

		close_options();
	};

	// SEARCHING

	export let filters: Filter<V>[];

	const [searched_by, searched_by_unsubscriber] = sync_to_local_storage
		? setup_synced_store<SearchedBy>(`${local_storage_key}-searched-by`, [null, ''])
		: [writable<SearchedBy>([null, '']), null];

	let search_bars: HTMLInputElement[] = [];
	let debounce_bars: HTMLDivElement[] = [];
	let debounce_width_animation: Nullable<Animation> = null;
	let debounce_hide_animation: Nullable<Animation> = null;

	const on_input_search_bar = (index: number) => {
		search_bars.forEach((search_bar, i) => {
			if (i !== index) search_bar.value = '';
		});

		debounce_width_animation?.cancel();
		debounce_hide_animation?.cancel();

		const new_value = search_bars[index].value;

		debounce_width_animation = debounce_bars[index].animate([{ width: percent(0) }, { width: percent(100) }], {
			duration: 1000,
			fill: 'forwards'
		});

		debounce_width_animation.onfinish = () => {
			$searched_by = [index, new_value];

			close_options();

			debounce_hide_animation = debounce_bars[index].animate([{ opacity: 1 }, { opacity: 0 }], {
				duration: 100,
				fill: 'forwards'
			});
		};
	};

	export const set_search = (value: string, index: number) => {
		search_bars[index].value = value;
		$searched_by = [index, value];
	};

	export let item_filter: Nullable<(items: ListItem<V>[]) => ListItem<V>[]> = null;

	// ITEM GETTING
	const get_items = (
		items: T[],
		[sorted_by_column_index, sort_ascending]: SortedBy,
		[searched_by_column_index, search_query]: SearchedBy
	) => {
		let new_items = structuredClone(items).map((v, i) => [i, item_mapper(v, i)] as ListItem<V>);

		const current_sorter = sorters[sorted_by_column_index];

		if (Array.isArray(current_sorter)) {
			current_sorter.forEach((sorter) =>
				new_items.sort((left, right) => sorter(left, right) * (sort_ascending ? 1 : -1))
			);
		} else {
			new_items.sort((left, right) => current_sorter(left, right) * (sort_ascending ? 1 : -1));
		}

		if (item_filter !== null) {
			new_items = item_filter(new_items);
		}

		if (searched_by_column_index === null) {
			go_to_index(0);
			return new_items;
		}

		let filtered_items = filters[searched_by_column_index](new_items, search_query.trim().toLocaleLowerCase('cs'));

		if (filtered_items !== null) go_to_index(0);

		return filtered_items === null || search_query === '' ? new_items : filtered_items;
	};

	export let current_items: ListItem<V>[] = [];

	export const refresh_items = () => (current_items = get_items(items, $sorted_by, $searched_by));
	$: current_items = get_items(items, $sorted_by, $searched_by);

	// SELECTING
	export let copy_transformer: CopyTransformer<V>;
	let selecting = false;
	let selected_items: number[] = [];

	const on_mouse_down_list_item = (e: MouseEvent, index: number) => {
		if (e.button !== 0 || (e.target as HTMLElement).nodeName === 'BUTTON') return;

		selected_items.includes(index)
			? selected_items.splice(selected_items.indexOf(index), 1)
			: selected_items.push(index);
		selected_items = selected_items;
		selecting = true;
	};

	const on_mouse_enter_list_item = (index: number) => {
		if (!selecting) return;
		if (!selected_items.includes(index)) selected_items.push(index);
		selected_items = selected_items;
	};

	const on_mouse_up_list_item = () => (selecting = false);

	const copy_selected_items = () => {
		const [sorted_by_column_index, sort_ascending] = $sorted_by;
		const mapped_selected_items = selected_items.map(
			(id) => current_items.find(([item_id, item_value]) => item_id === id) as ListItem<V>
		);

		const current_sorter = sorters[sorted_by_column_index];
		if (Array.isArray(current_sorter)) {
			current_sorter.forEach((sorter) =>
				mapped_selected_items.sort((left, right) => sorter(left, right) * (sort_ascending ? 1 : -1))
			);
		} else {
			mapped_selected_items.sort((left, right) => current_sorter(left, right) * (sort_ascending ? 1 : -1));
		}

		const copied_items = copy_transformer(mapped_selected_items);
		navigator.clipboard.writeText(`${headers.join('\t')}\n${copied_items}`);
		selected_items = [];
	};

	const on_key_down_copy = (e: KeyboardEvent) => {
		if (e.code === 'Escape') selected_items = [];
		else if (e.ctrlKey && e.code === 'KeyC') copy_selected_items();
	};

	// OPTIONS
	let options_opened: Nullable<number> = null;

	export const close_options = () => (options_opened = null);

	const on_click_options = (index: number) => {
		options_opened = options_opened === index ? null : index;
	};

	const is_up = (index: number) => {
		const button = document.getElementById(`options-${index}`) as HTMLButtonElement;
		if (!button) return false;

		const rect = button.getBoundingClientRect();

		return rect.bottom - HEADER_HEIGHT - SEARCH_BAR_HEIGHT > list_height / 2;
	};

	let copy_part_editor_visible = false;
	const on_click_copy_part = () => (copy_part_editor_visible = true);
	const cancel_copy_part = () => (copy_part_editor_visible = false);
	const submit_copy_part = (ids: number[]) => {
		selected_items = ids;
		copy_selected_items();
		copy_part_editor_visible = false;
	};

	// FORCE UPDATE
	let list: VirtualList;
	const force_update_unsubscriber = FORCE_UPDATE.subscribe((v) => {
		if (v === true) {
			list.recomputeSizes();
			$FORCE_UPDATE = false;
		}
	});

	const on_click_search_bar = (index: number) => {
		if (search_bars[index].value === '') return;

		search_bars[index].value = '';
		on_input_search_bar(index);
	};

	onMount(() => {
		if ($searched_by[0] !== null) search_bars[$searched_by[0]].value = $searched_by[1];
	});

	onDestroy(() => {
		if (column_sizes_unsubscriber !== null) column_sizes_unsubscriber();
		if (sorted_by_unsubscriber !== null) sorted_by_unsubscriber();
		if (searched_by_unsubscriber !== null) searched_by_unsubscriber();
		force_update_unsubscriber();
	});
</script>

<svelte:window
	on:mouseup={() => {
		on_mouse_up_resizer();
		on_mouse_up_list_item();
	}}
	on:mousemove={on_mouse_move_resizer}
	on:keydown={on_key_down_copy}
/>

{#if copy_part_editor_visible}
	<CopyPartEditor cancel={cancel_copy_part} submit={submit_copy_part}></CopyPartEditor>
{/if}

<div
	class="list"
	style:--grid-layout={`${grid_layout} ${pixels(SCROLLBAR_WIDTH)}`}
	style:--item-grid-layout={grid_layout}
	style:--header-height={pixels(HEADER_HEIGHT)}
	style:--item-height={pixels(ITEM_SIZE)}
	style:--search-bar-height={pixels(SEARCH_BAR_HEIGHT)}
	style:--action-bar-height={pixels(ACTION_BAR_HEIGHT)}
>
	<div class="headers">
		{#each headers as header, i}
			<button class="header button" on:click|self={(e) => on_click_header(e, i)}>
				{header}
				{#if $sorted_by[0] === i}
					<ListSortIcon centered={header === ''} ascending={$sorted_by[1]}></ListSortIcon>
				{/if}
			</button>
			{#if i < headers.length - 1}
				<button
					class="column-resizer"
					style:--left={pixels(sum($column_sizes.slice(0, i)) + BORDER_WIDTH * i + $column_sizes[i])}
					on:mousedown={() => on_mouse_down_resizer(i)}
				>
					<div class="column-resizer-inner" />
				</button>
			{/if}
		{/each}
		{#if has_options}
			<div class="filler"></div>
		{/if}
		<div class="filler"></div>
	</div>
	<div class="search-bars">
		{#each headers as header, i}
			<div class="search-bar-container">
				<input
					class="search-bar input"
					class:highlighted={$searched_by[0] === i && $searched_by[1] !== ''}
					type="text"
					placeholder={placeholders !== null && placeholders[i] !== null ? placeholders[i] : get_placeholder(header)}
					bind:this={search_bars[i]}
					on:input={() => on_input_search_bar(i)}
					on:click={() => on_click_search_bar(i)}
				/>
				<div class="debounce-bar" bind:this={debounce_bars[i]} />
			</div>
		{/each}
		{#if has_options}
			<div class="filler"></div>
		{/if}
		<div class="filler"></div>
	</div>
	<div class="list-container">
		{#if current_items.length > 0}
			{#key `${$sorted_by[0]}-${$sorted_by[1]}-${$searched_by[0]}-${$sorted_by[1]}-${FORCE_UPDATE}`}
				<VirtualList
					bind:this={list}
					height={list_height}
					itemCount={current_items.length}
					itemSize={(i) => (!last_has_border && i === current_items.length - 1 ? ITEM_SIZE : ITEM_SIZE + BORDER_WIDTH)}
					getKey={(i) => current_items[i][0]}
					scrollToAlignment="center"
					bind:scrollToIndex={scroll_to_index}
				>
					<!-- svelte-ignore a11y-no-static-element-interactions -->
					<div
						slot="item"
						let:style
						let:index
						class="list-item"
						class:hide-border={!last_has_border && index === current_items.length - 1}
						class:searched={index === searched_item}
						class:selected={selected_items.includes(current_items[index][0])}
						{style}
						on:mousedown={(e) => on_mouse_down_list_item(e, current_items[index][0])}
						on:mouseenter={() => on_mouse_enter_list_item(current_items[index][0])}
					>
						{@const even = index % 2 === 0}
						{@const searched = index === searched_item}
						{@const selected = selected_items.includes(current_items[index][0])}

						{#if searched || selected}
							<div class="border" class:border-searched={searched} class:border-selected={selected}></div>
						{/if}

						<slot name="item" list_item={current_items[index]} {even} {searched} {selected}></slot>

						{#if has_options}
							<button
								class="options button"
								class:shifted-button={even}
								class:searched-button={searched}
								class:selected-button={selected}
								id={`options-${index}`}
								on:click|self={() => on_click_options(current_items[index][0])}
							>
								{#if options_opened === current_items[index][0]}
									<Icon type="arrow-up"></Icon>
									<div class="options-menu" class:up={is_up(index)}>
										<slot name="options" item={current_items[index]}></slot>
									</div>
								{:else}
									<Icon type="arrow-down"></Icon>
								{/if}
							</button>
						{/if}
					</div>
				</VirtualList>
			{/key}
		{/if}
		<div class="overscroll"><Icon type="eyes" size={256}></Icon></div>
	</div>
	<div class="action-bar">
		<div class="left">
			<ListAction icon_type="reset" on:click={reset_column_sizes}>Resetovat sloupce</ListAction>
		</div>
		<div class="middle">
			<slot name="action-bar"></slot>
		</div>
		<div class="right">
			<ListAction icon_type="copy" icon_size={24} on:click={on_click_copy_part}>Zkopírovat část</ListAction>
			<ListAction icon_type="arrow-up" on:click={() => go_to_index(0)}>Zpátky nahoru</ListAction>
		</div>
	</div>
</div>

<style>
	.list {
		display: grid;
		grid-template-rows: var(--header-height) var(--search-bar-height) auto var(--action-bar-height);
		gap: var(--border-width);

		width: 100%;
		height: 100%;

		background-color: var(--border-color);
	}

	.filler {
		background-color: var(--base-surface);
	}

	.headers,
	.search-bars {
		display: grid;
		grid-template-columns: var(--grid-layout);
		gap: var(--border-width);

		background-color: var(--border-color);
	}

	.header {
		position: relative;

		color: var(--text-color);
		font-size: var(--font-size-large);
		font-weight: bold;

		transition: var(--outline-transition);
	}

	.column-resizer {
		--column-resizer-width: 16px;

		display: grid;
		place-items: center;

		position: absolute;
		left: calc(var(--left) - var(--column-resizer-width) / 2 + var(--border-width) / 2);
		top: 0;

		width: var(--column-resizer-width);
		height: var(--header-height);

		outline: none;

		background: transparent;

		cursor: col-resize;

		z-index: 10;

		transition: var(--background-color-transition);

		&:is(:hover, :focus-visible) > .column-resizer-inner {
			color: var(--outline-color);
			background-color: var(--outline-color);
		}

		&:active > .column-resizer-inner {
			color: var(--highlighted-outline-color);
			background-color: var(--highlighted-outline-color);
		}
	}

	.column-resizer-inner {
		width: calc(var(--border-width) * 2);
		height: 100%;

		pointer-events: none;
	}

	.search-bar-container {
		position: relative;
	}

	.search-bar {
		width: 100%;
		height: 100%;

		color: var(--text-color);
		text-align: center;

		transition: var(--outline-transition);
	}

	.search-bar::placeholder {
		color: var(--subtext-color);
	}

	.debounce-bar {
		position: absolute;
		bottom: 0;
		left: 0;

		width: 0%;
		height: var(--border-width);

		background-color: var(--primary-600);
	}

	.list-container {
		background-color: var(--base-surface);
	}

	.list-container :global(.virtual-list-wrapper) {
		position: relative;

		overflow: hidden scroll;

		z-index: 10;
	}

	.list-item {
		flex: 0 0 auto;

		display: grid;
		grid-template-columns: var(--item-grid-layout);
		gap: var(--border-width);

		border-bottom: var(--border);

		background-color: var(--border-color);

		user-select: none;

		color: var(--text-color);
	}

	.hide-border {
		border-bottom: unset;
	}

	.searched {
		background-color: var(--searched-border);

		color: black;
	}

	.selected {
		background-color: var(--selected-border);

		color: black;
	}

	.border {
		position: absolute;
		width: 100%;
		top: var(--border-width-negative);
		bottom: var(--border-width-negative);

		border-top: var(--border);
		border-bottom: var(--border);

		pointer-events: none;
	}

	.border-searched {
		border-color: var(--searched-border);
	}

	.border-selected {
		border-color: var(--selected-border);
	}

	.overscroll {
		position: absolute;
		bottom: 64px;
		left: 50%;

		transform: translateX(-50%);

		filter: grayscale(1) opacity(0.25);
	}

	.options {
		display: grid;
		place-items: center;

		position: relative;

		width: 32px;
		height: 32px;

		border: none;

		color: inherit;
	}

	.options-menu {
		display: flex;
		flex-direction: column;
		gap: var(--border-width);

		position: absolute;
		top: 100%;
		right: var(--border-width-negative);

		width: max-content;
		height: max-content;

		border: var(--border);

		background-color: var(--border-color);

		z-index: 100;
	}

	.up {
		top: unset;
		bottom: 100%;
	}

	.action-bar {
		display: grid;
		grid-template-columns: 1fr 1fr 1fr;

		padding-inline: 8px;

		background-color: var(--base-surface);

		& > div {
			display: flex;
			align-items: center;

			gap: 16px;
		}
	}

	.middle {
		justify-content: center;
	}

	.right {
		justify-content: end;
	}

	.highlighted {
		background-color: var(--highlighted-search-field);
	}
</style>
