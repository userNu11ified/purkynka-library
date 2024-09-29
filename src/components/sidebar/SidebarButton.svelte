<script lang="ts">
	import { CURRENTLY_EDITING_BOOK } from '$client/editors/book_editor';
	import type { IconType } from '$client/icon/icon';
	import { CURRENT_PAGE_OPENED, type Page } from '$client/sidebar/sidebar';
	import Icon from '$components/icon/Icon.svelte';
	import type { Nullable } from '$shared/common_types';

	export let icon: IconType;
	export let page: Page;

	export let is_shifted: Nullable<boolean> = null;
	export let disabled: Nullable<boolean> = null;

	export let on_click = () => {
		CURRENT_PAGE_OPENED.update((v) => (v === page ? null : page));
	};
</script>

<button
	class="sidebar-button button"
	class:enabled={$CURRENT_PAGE_OPENED === page || is_shifted}
	{disabled}
	on:click={on_click}
>
	<div class="icon"><Icon type={icon} /></div>
	<div class="text">{page}</div>
</button>

<style>
	.sidebar-button {
		display: grid;
		grid-template-columns: calc(48px - var(--border-width-added)) auto;

		width: 100%;
		height: 48px;

		border: var(--border);
		border-radius: var(--border-radius-regular);

		color: var(--text-color);
		font-size: var(--font-size-large);
		font-weight: 600;
		white-space: nowrap;

		overflow: hidden;

		transition: var(--outline-transition);

		&:disabled {
			color: var(--subtext-color);
			cursor: not-allowed;
		}

		&.enabled {
			color: var(--tertiary-900);
		}

		& > div {
			display: grid;
			place-items: center;

			height: 100%;

			pointer-events: none;
		}
	}
</style>
