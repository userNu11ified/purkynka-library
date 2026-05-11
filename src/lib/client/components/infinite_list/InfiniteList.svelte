<script lang="ts" generics="T">
	import type { Nullable } from '$shared/types/util';
	import type { Snippet } from 'svelte';
	import type { UIEventHandler } from 'svelte/elements';

	let {
		items,
		itemHeight,
		itemOverscan = 10,
		listRow
	}: {
		items: T[];
		itemHeight: number;
		itemOverscan?: number;
		listRow: Snippet<[visibleRowItem: T, visibleRowIndex: number]>;
	} = $props();

	let infiniteList: HTMLDivElement | undefined = $state();

	let currentScrollTop: number = $state(0);
	let currentListHeight: number = $state(0);

	const visibleRowsStartIndex = $derived(
		Math.max(0, Math.floor(currentScrollTop / itemHeight) - itemOverscan)
	);

	const visibleRowCount = $derived(
		Math.min(
			items.length - visibleRowsStartIndex,
			Math.floor(currentListHeight / itemHeight) + 2 * itemOverscan
		)
	);

	const visibleRowIndices = $derived(
		Array.from({ length: visibleRowCount }, (_, i) => visibleRowsStartIndex + i)
	);

	const onInfiniteListScroll: UIEventHandler<HTMLDivElement> = (e) => {
		currentScrollTop = e.currentTarget.scrollTop;
	};

	const scrollToCenterAlignOffset = $derived(currentListHeight / itemHeight / 2 - 1);

	export const scrollTo = (rowIndex: Nullable<number>) => {
		if (rowIndex === null) return;

		const scrollTo = Math.max(0, rowIndex - scrollToCenterAlignOffset) * itemHeight;
		infiniteList?.scrollTo({ top: scrollTo, behavior: 'instant' });
	};
</script>

<div
	class="infinite-list fill-container"
	style:--item-height={`${itemHeight}px`}
	onscroll={onInfiniteListScroll}
	bind:clientHeight={currentListHeight}
	bind:this={infiniteList}
>
	<div class="infinite-list-filler" style:--filler-height={`${items.length * itemHeight}px`}>
		<div
			class="infinite-list-item-container"
			style:--item-container-y-offset={`${visibleRowsStartIndex * itemHeight}px`}
		>
			{#each visibleRowIndices as visibleRowIndex (visibleRowIndex)}
				{@const visibleRowItem = items[visibleRowIndex]}
				<div class="infinite-list-item">
					{@render listRow(visibleRowItem, visibleRowIndex)}
				</div>
			{/each}
		</div>
	</div>
</div>

<style>
	.infinite-list {
		position: relative;

		overflow: hidden scroll;
	}

	.infinite-list-filler {
		position: absolute;

		width: 100%;
		height: var(--filler-height);

		border-right: var(--border);
	}

	.infinite-list-item-container {
		transform: translateY(var(--item-container-y-offset));
	}

	.infinite-list-item {
		width: 100%;
		height: var(--item-height);
	}
</style>
