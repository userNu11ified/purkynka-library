<script lang="ts">
	import { CURRENT_PAGE_OPENED_UNSUBSCRIBER, SIDEBAR_OPENED } from '$client/sidebar/sidebar';
	import { onDestroy, onMount } from 'svelte';
	import SidebarButton from './SidebarButton.svelte';
	import { CURRENTLY_EDITING_BOOK } from '$client/editors/book_editor';
	import { DATABASE } from '$client/database/database';
	import type { ID } from '$shared/common_types';

	const on_click_add_book = () =>
		($CURRENTLY_EDITING_BOOK =
			$CURRENTLY_EDITING_BOOK === null ? ['Vytvořit knihu', $DATABASE.books.length as ID] : null);

	onDestroy(CURRENT_PAGE_OPENED_UNSUBSCRIBER);
</script>

<div class="sidebar" class:opened={$SIDEBAR_OPENED}>
	<div class="section">
		<SidebarButton icon="book" page="Seznam" />
		<div class="divider"></div>
		<SidebarButton
			icon="book-add"
			page="Zapsat knihu"
			is_shifted={$CURRENTLY_EDITING_BOOK !== null}
			on_click={on_click_add_book}
		/>
	</div>
	<div class="section">
		<SidebarButton icon="book-borrow" page="Výpůjčky" />
		<div class="divider"></div>
		<SidebarButton icon="book-lock" page="Trvalé" />
	</div>
	<div class="section">
		<SidebarButton icon="book-discard" page="Vyřazené" />
		<div class="divider"></div>
		<SidebarButton icon="history" page="Historie" />
	</div>
	<div class="section">
		<SidebarButton icon="user" page="Čtenáři" />
		<div class="divider"></div>
		<SidebarButton icon="list" page="MDT" />
	</div>
</div>

<style>
	.sidebar {
		--sidebar-padding: 8px;

		display: flex;
		flex-direction: column;

		position: absolute;
		top: 0;
		bottom: 0;
		left: 0;

		width: var(--sidebar-closed-width);

		padding: var(--sidebar-padding);
		border-right: var(--border);

		background-color: var(--base-surface);

		z-index: 1000;

		transition: var(--width-transition);
	}

	.opened {
		width: var(--sidebar-opened-width);
	}

	.section {
		flex: 1 1 auto;

		display: flex;
		flex-direction: column;
		justify-content: center;
		align-items: center;
		gap: 8px;

		&:first-child {
			justify-content: start;
		}

		&:last-child {
			justify-content: end;
		}
	}

	.divider {
		width: calc(var(--sidebar-closed-width) / 2);
		height: var(--border-width);

		margin-left: 0px;

		background-color: var(--border-color);
	}

	.opened .divider {
		margin-left: calc(var(--sidebar-closed-width) - var(--sidebar-padding) * 2);
	}
</style>
