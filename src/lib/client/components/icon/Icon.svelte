<script lang="ts" module>
	export type IconType = 'hamburger-menu' | 'book' | 'book-borrow' | 'user' | 'list' | 'settings';
</script>

<script lang="ts">
	let {
		iconType,
		width = 32,
		height = width
	}: { iconType: IconType; width?: number; height?: number } = $props();
</script>

{#if iconType === 'hamburger-menu'}
	<svg xmlns="http://www.w3.org/2000/svg" {width} {height} viewBox="0 0 24 24"
		><path fill="currentColor" d="M3 6h18v2H3zm0 5h18v2H3zm0 5h18v2H3z" /></svg
	>
{:else if iconType === 'book'}
	<svg xmlns="http://www.w3.org/2000/svg" {width} {height} viewBox="0 0 24 24"
		><path
			fill="currentColor"
			d="M18 22a2 2 0 0 0 2-2V4a2 2 0 0 0-2-2h-6v7L9.5 7.5L7 9V2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2z"
		/></svg
	>
{:else if iconType === 'book-borrow'}
	<svg xmlns="http://www.w3.org/2000/svg" {width} {height} viewBox="0 0 24 24"
		><path
			fill="currentColor"
			d="M13 19c0 1.1.3 2.12.81 3H6c-1.11 0-2-.89-2-2V4a2 2 0 0 1 2-2h1v7l2.5-1.5L12 9V2h6a2 2 0 0 1 2 2v9.09c-.33-.05-.66-.09-1-.09c-3.31 0-6 2.69-6 6m6-4l-3 3h2v4h2v-4h2z"
		/></svg
	>
{:else if iconType === 'user'}
	<svg xmlns="http://www.w3.org/2000/svg" {width} {height} viewBox="0 0 24 24"
		><path
			fill="currentColor"
			d="M12 4a4 4 0 0 1 4 4a4 4 0 0 1-4 4a4 4 0 0 1-4-4a4 4 0 0 1 4-4m0 10c4.42 0 8 1.79 8 4v2H4v-2c0-2.21 3.58-4 8-4"
		/></svg
	>
{:else if iconType === 'list'}
	<svg xmlns="http://www.w3.org/2000/svg" {width} {height} viewBox="0 0 24 24"
		><path
			fill="currentColor"
			d="M19 3H5c-1.1 0-2 .9-2 2v14c0 1.1.9 2 2 2h14c1.1 0 2-.9 2-2V5c0-1.1-.9-2-2-2M7 7h2v2H7zm0 4h2v2H7zm0 4h2v2H7zm10 2h-6v-2h6zm0-4h-6v-2h6zm0-4h-6V7h6z"
		/></svg
	>
{:else if iconType === 'settings'}
	<svg xmlns="http://www.w3.org/2000/svg" {width} {height} viewBox="0 0 24 24"
		><path
			fill="currentColor"
			d="M12 15.5A3.5 3.5 0 0 1 8.5 12A3.5 3.5 0 0 1 12 8.5a3.5 3.5 0 0 1 3.5 3.5a3.5 3.5 0 0 1-3.5 3.5m7.43-2.53c.04-.32.07-.64.07-.97s-.03-.66-.07-1l2.11-1.63c.19-.15.24-.42.12-.64l-2-3.46c-.12-.22-.39-.31-.61-.22l-2.49 1c-.52-.39-1.06-.73-1.69-.98l-.37-2.65A.506.506 0 0 0 14 2h-4c-.25 0-.46.18-.5.42l-.37 2.65c-.63.25-1.17.59-1.69.98l-2.49-1c-.22-.09-.49 0-.61.22l-2 3.46c-.13.22-.07.49.12.64L4.57 11c-.04.34-.07.67-.07 1s.03.65.07.97l-2.11 1.66c-.19.15-.25.42-.12.64l2 3.46c.12.22.39.3.61.22l2.49-1.01c.52.4 1.06.74 1.69.99l.37 2.65c.04.24.25.42.5.42h4c.25 0 .46-.18.5-.42l.37-2.65c.63-.26 1.17-.59 1.69-.99l2.49 1.01c.22.08.49 0 .61-.22l2-3.46c.12-.22.07-.49-.12-.64z"
		/></svg
	>
{/if}

<style>
	svg {
		pointer-events: none;
	}
</style>
