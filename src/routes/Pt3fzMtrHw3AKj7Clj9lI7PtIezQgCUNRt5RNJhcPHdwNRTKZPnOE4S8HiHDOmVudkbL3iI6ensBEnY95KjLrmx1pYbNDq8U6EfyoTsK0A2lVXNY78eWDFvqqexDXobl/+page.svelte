<script lang="ts">
	import { CURRENTLY_EDITING_BOOK } from '$client/editors/book_editor';
	import { CURRENTLY_EDITING_BORROW } from '$client/editors/borrow_editor';
	import { CURRENTLY_EDITING_READER } from '$client/editors/reader_editor';
	import { CURRENT_STEP, load, TOTAL_STEPS } from '$client/loading_screen/loading_screen';
	import { PASSWORD, PASSWORD_UNSUBSCRIBER } from '$client/password/password';
	import { CURRENT_PAGE_OPENED, SIDEBAR_OPENED } from '$client/sidebar/sidebar';
	import { pixels } from '$client/style/css';
	import {
		BORDER_WIDTH,
		DARK_THEME,
		DARK_THEME_UNSUBSCRIBER,
		FONT_SIZE_HUGE,
		FONT_SIZE_LARGE,
		FONT_SIZE_MASSIVE,
		FONT_SIZE_REGULAR,
		SCROLLBAR_WIDTH,
		SIDEBAR_CLOSED_WIDTH,
		SIDEBAR_OPENED_WIDTH
	} from '$client/style/theme';
	import { WINDOW_HEIGHT, WINDOW_WIDTH } from '$client/window/window';
	import BookEditor from '$components/book_editor/BookEditor.svelte';
	import BookList from '$components/book_list/BookList.svelte';
	import BorrowEditor from '$components/borrow_editor/BorrowEditor.svelte';
	import BorrowHistoryList from '$components/borrow_history_list/BorrowHistoryList.svelte';
	import BorrowList from '$components/borrow_list/BorrowList.svelte';
	import Dashboard from '$components/dashboard/Dashboard.svelte';
	import DiscardedBookList from '$components/discarded_book_list/DiscardedBookList.svelte';
	import LoadingScreen from '$components/loading_screen/LoadingScreen.svelte';
	import PasswordPrompt from '$components/password_prompt/PasswordPrompt.svelte';
	import PermanentBorrowList from '$components/permanent_borrow_list/PermanentBorrowList.svelte';
	import ReaderList from '$components/reader_list/ReaderList.svelte';
	import Sidebar from '$components/sidebar/Sidebar.svelte';
	import UdcList from '$components/udc_list/UDCList.svelte';
	import '$style/app.css';
	import '$style/theme.css';
	import { onDestroy } from 'svelte';

	const on_key_down = (e: KeyboardEvent) => {
		if (e.altKey && e.code === 'KeyT') $DARK_THEME = !$DARK_THEME;
	};

	onDestroy(() => {
		DARK_THEME_UNSUBSCRIBER();
		PASSWORD_UNSUBSCRIBER();
	});
</script>

<svelte:window bind:innerWidth={$WINDOW_WIDTH} bind:innerHeight={$WINDOW_HEIGHT} on:keydown={on_key_down} />

<svelte:head>
	{#if $DARK_THEME}
		<link rel="icon" href="/favicon-dark.svg" />
	{:else}
		<link rel="icon" href="/favicon-light.svg" />
	{/if}
</svelte:head>

<div
	class="app-mount"
	style:--border-width={pixels(BORDER_WIDTH)}
	style:--font-size-regular={FONT_SIZE_REGULAR}
	style:--font-size-large={FONT_SIZE_LARGE}
	style:--font-size-huge={FONT_SIZE_HUGE}
	style:--font-size-massive={FONT_SIZE_MASSIVE}
	style:--sidebar-closed-width={pixels(SIDEBAR_CLOSED_WIDTH)}
	style:--sidebar-opened-width={pixels(SIDEBAR_OPENED_WIDTH)}
	style:--scrollbar-width={pixels(SCROLLBAR_WIDTH)}
	class:dark-theme={$DARK_THEME}
	class:light-theme={!$DARK_THEME}
>
	{#if $PASSWORD === null}
		<PasswordPrompt />
	{:else}
		{#await load()}
			<LoadingScreen current_step={$CURRENT_STEP} total_steps={TOTAL_STEPS} />
		{:then}
			<Sidebar></Sidebar>
			<div class="content" class:opened={$SIDEBAR_OPENED}>
				{#if $CURRENTLY_EDITING_BOOK !== null}
					<BookEditor />
				{/if}

				{#if $CURRENTLY_EDITING_BORROW !== null}
					<BorrowEditor />
				{/if}

				{#if $SIDEBAR_OPENED}
					<Dashboard />
				{:else if $CURRENT_PAGE_OPENED === 'Seznam'}
					<BookList />
				{:else if $CURRENT_PAGE_OPENED === 'Výpůjčky'}
					<BorrowList />
				{:else if $CURRENT_PAGE_OPENED === 'Trvalé'}
					<PermanentBorrowList />
				{:else if $CURRENT_PAGE_OPENED === 'Vyřazené'}
					<DiscardedBookList />
				{:else if $CURRENT_PAGE_OPENED === 'Historie'}
					<BorrowHistoryList />
				{:else if $CURRENT_PAGE_OPENED === 'Čtenáři'}
					<ReaderList />
				{:else if $CURRENT_PAGE_OPENED === 'MDT'}
					<UdcList />
				{/if}
			</div>
		{/await}
	{/if}
</div>

<style>
	.app-mount {
		--scrollbar-thumb-color: var(--border-color);

		position: absolute;
		left: 0;
		top: 0;

		width: 100dvw;
		height: 100dvh;

		background-color: var(--base-surface);

		transition: var(--variable-transitions);
	}

	.content {
		position: absolute;
		top: 0;
		bottom: 0;
		right: 0;

		width: calc(100% - var(--sidebar-closed-width));
	}

	.opened {
		width: calc(100% - var(--sidebar-opened-width));
	}
</style>
