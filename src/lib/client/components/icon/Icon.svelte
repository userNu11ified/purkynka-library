<script lang="ts" module>
	export type IconType =
		| 'hamburger-menu'
		| 'book'
		| 'book-info'
		| 'book-add'
		| 'book-discard'
		| 'book-restore'
		| 'book-borrow'
		| 'book-return'
		| 'book-lock'
		| 'history'
		| 'user'
		| 'user-add'
		| 'user-edit'
		| 'student'
		| 'teacher'
		| 'librarian'
		| 'list'
		| 'list-typed'
		| 'list-numbered'
		| 'nametag'
		| 'store'
		| 'place'
		| 'trash-can'
		| 'settings'
		| 'sort-descending'
		| 'sort-ascending'
		| 'case-sensitive'
		| 'add'
		| 'remove'
		| 'edit'
		| 'copy'
		| 'merge'
		| 'selection-remove'
		| 'column-width'
		| 'chevron-up'
		| 'chevron-right'
		| 'password-reset'
		| 'shield-add'
		| 'loading'
		| 'quote'
		| 'download'
		| 'upload'
		| 'monitor'
		| 'light-theme'
		| 'dark-theme'
		| 'purkynka'
		| 'help';
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
{:else if iconType === 'book-info'}
	<svg xmlns="http://www.w3.org/2000/svg" {width} {height} viewBox="0 0 24 24"
		><path
			fill="currentColor"
			d="M18 2h-6v7L9.5 7.5L7 9V2H6c-1.1 0-2 .9-2 2v16c0 1.1.9 2 2 2h12c1.1 0 2-.9 2-2V4a2 2 0 0 0-2-2m-.32 16.41c-.11.09-1.21.84-1.63 1.09c-.42.29-2.05 1.22-1.79-.58c.63-3.64 1.85-5.8.39-4.86c-.38.23-.6.37-.74.44c-.13.11-.12.1-.23-.09s-.15-.18-.01-.28c0 0 2.23-1.79 3.05-1.85c.78-.07.59.89.52 1.33c-.46 1.85-1.3 4.54-1.17 4.93c.11.39.93-.23 1.37-.54c0 0 .06-.07.17.05c.11.17.22.25.07.36m-.71-7.35c-.57 0-1.03-.46-1.03-1.03S16.4 9 16.97 9S18 9.46 18 10.03s-.46 1.03-1.03 1.03"
		/></svg
	>
{:else if iconType === 'book-add'}
	<svg xmlns="http://www.w3.org/2000/svg" {width} {height} viewBox="0 0 24 24"
		><path
			fill="currentColor"
			d="M13 19c0 1.1.3 2.12.81 3H6c-1.11 0-2-.89-2-2V4a2 2 0 0 1 2-2h1v7l2.5-1.5L12 9V2h6a2 2 0 0 1 2 2v9.09c-.33-.05-.66-.09-1-.09c-3.31 0-6 2.69-6 6m7-1v-3h-2v3h-3v2h3v3h2v-3h3v-2z"
		/></svg
	>
{:else if iconType === 'book-discard'}
	<svg xmlns="http://www.w3.org/2000/svg" {width} {height} viewBox="0 0 24 24"
		><path
			fill="currentColor"
			d="M13 19c0 1.1.3 2.12.81 3H6c-1.11 0-2-.89-2-2V4a2 2 0 0 1 2-2h1v7l2.5-1.5L12 9V2h6a2 2 0 0 1 2 2v9.09c-.33-.05-.66-.09-1-.09c-3.31 0-6 2.69-6 6m9.54-2.12l-1.42-1.41L19 17.59l-2.12-2.12l-1.41 1.41L17.59 19l-2.12 2.12l1.41 1.42L19 20.41l2.12 2.13l1.42-1.42L20.41 19z"
		/></svg
	>
{:else if iconType === 'book-restore'}
	<svg xmlns="http://www.w3.org/2000/svg" {width} {height} viewBox="0 0 24 24"
		><path
			fill="currentColor"
			d="M12 18.5c0 1.29.39 2.5 1.04 3.5H6c-1.11 0-2-.89-2-2V4a2 2 0 0 1 2-2h1v7l2.5-1.5L12 9V2h6a2 2 0 0 1 2 2v8.18c-.5-.11-1-.18-1.5-.18a6.5 6.5 0 0 0-6.5 6.5m10 0v-4l-1.17 1.17A4 4 0 0 0 18 14.5c-2.21 0-4 1.79-4 4s1.79 4 4 4c1.68 0 3.12-1.03 3.71-2.5H20a2.5 2.5 0 1 1-.23-3.27L18 18.5z"
		/></svg
	>
{:else if iconType === 'book-borrow'}
	<svg xmlns="http://www.w3.org/2000/svg" {width} {height} viewBox="0 0 24 24"
		><path
			fill="currentColor"
			d="M13 19c0 1.1.3 2.12.81 3H6c-1.11 0-2-.89-2-2V4a2 2 0 0 1 2-2h1v7l2.5-1.5L12 9V2h6a2 2 0 0 1 2 2v9.09c-.33-.05-.66-.09-1-.09c-3.31 0-6 2.69-6 6m6-4l-3 3h2v4h2v-4h2z"
		/></svg
	>
{:else if iconType === 'book-return'}
	<svg xmlns="http://www.w3.org/2000/svg" {width} {height} viewBox="0 0 24 24"
		><path
			fill="currentColor"
			d="M13 19c0 1.1.3 2.12.81 3H6c-1.11 0-2-.89-2-2V4a2 2 0 0 1 2-2h1v7l2.5-1.5L12 9V2h6a2 2 0 0 1 2 2v9.09c-.33-.05-.66-.09-1-.09c-3.31 0-6 2.69-6 6m7 1v-4h-2v4h-2l3 3l3-3z"
		/></svg
	>
{:else if iconType === 'book-lock'}
	<svg xmlns="http://www.w3.org/2000/svg" {width} {height} viewBox="0 0 24 24"
		><path
			fill="currentColor"
			d="M14.2 14.5v.24c-.7.6-1.2 1.5-1.2 2.46v3.5c0 .46.1.9.27 1.3H6c-1.11 0-2-.89-2-2V4a2 2 0 0 1 2-2h1v7l2.5-1.5L12 9V2h6a2 2 0 0 1 2 2v6.11c-.32-.07-.66-.11-1-.11c-2.6 0-4.8 2.06-4.8 4.5m8.8 2.8v3.5c0 .6-.6 1.2-1.3 1.2h-5.5c-.6 0-1.2-.6-1.2-1.3v-3.5c0-.6.6-1.2 1.2-1.2v-1.5c0-1.4 1.4-2.5 2.8-2.5s2.8 1.1 2.8 2.5V16c.6 0 1.2.6 1.2 1.3m-2.5-2.8c0-.8-.7-1.3-1.5-1.3s-1.5.5-1.5 1.3V16h3z"
		/></svg
	>
{:else if iconType === 'history'}
	<svg xmlns="http://www.w3.org/2000/svg" {width} {height} viewBox="0 0 24 24"
		><path
			fill="currentColor"
			d="M13.5 8H12v5l4.28 2.54l.72-1.21l-3.5-2.08zM13 3a9 9 0 0 0-9 9H1l3.96 4.03L9 12H6a7 7 0 0 1 7-7a7 7 0 0 1 7 7a7 7 0 0 1-7 7c-1.93 0-3.68-.79-4.94-2.06l-1.42 1.42A8.9 8.9 0 0 0 13 21a9 9 0 0 0 9-9a9 9 0 0 0-9-9"
		/></svg
	>
{:else if iconType === 'user'}
	<svg xmlns="http://www.w3.org/2000/svg" {width} {height} viewBox="0 0 24 24"
		><path
			fill="currentColor"
			d="M12 4a4 4 0 0 1 4 4a4 4 0 0 1-4 4a4 4 0 0 1-4-4a4 4 0 0 1 4-4m0 10c4.42 0 8 1.79 8 4v2H4v-2c0-2.21 3.58-4 8-4"
		/></svg
	>
{:else if iconType === 'user-add'}
	<svg xmlns="http://www.w3.org/2000/svg" {width} {height} viewBox="0 0 24 24"
		><path
			fill="currentColor"
			d="M15 14c-2.67 0-8 1.33-8 4v2h16v-2c0-2.67-5.33-4-8-4m-9-4V7H4v3H1v2h3v3h2v-3h3v-2m6 2a4 4 0 0 0 4-4a4 4 0 0 0-4-4a4 4 0 0 0-4 4a4 4 0 0 0 4 4"
		/></svg
	>
{:else if iconType === 'user-edit'}
	<svg xmlns="http://www.w3.org/2000/svg" {width} {height} viewBox="0 0 24 24"
		><path
			fill="currentColor"
			d="m21.7 13.35l-1 1l-2.05-2.05l1-1a.55.55 0 0 1 .77 0l1.28 1.28c.21.21.21.56 0 .77M12 18.94l6.06-6.06l2.05 2.05L14.06 21H12zM12 14c-4.42 0-8 1.79-8 4v2h6v-1.89l4-4c-.66-.08-1.33-.11-2-.11m0-10a4 4 0 0 0-4 4a4 4 0 0 0 4 4a4 4 0 0 0 4-4a4 4 0 0 0-4-4"
		/></svg
	>
{:else if iconType === 'student'}
	<svg xmlns="http://www.w3.org/2000/svg" {width} {height} viewBox="0 0 24 24"
		><path
			fill="currentColor"
			d="M16 8c0 2.21-1.79 4-4 4s-4-1.79-4-4l.11-.94L5 5.5L12 2l7 3.5v5h-1V6l-2.11 1.06zm-4 6c4.42 0 8 1.79 8 4v2H4v-2c0-2.21 3.58-4 8-4"
		/></svg
	>
{:else if iconType === 'teacher'}
	<svg xmlns="http://www.w3.org/2000/svg" {width} {height} viewBox="0 0 24 24"
		><path
			fill="currentColor"
			d="M12 3c2.21 0 4 1.79 4 4s-1.79 4-4 4s-4-1.79-4-4s1.79-4 4-4m4 10.54c0 1.06-.28 3.53-2.19 6.29L13 15l.94-1.88c-.62-.07-1.27-.12-1.94-.12s-1.32.05-1.94.12L11 15l-.81 4.83C8.28 17.07 8 14.6 8 13.54c-2.39.7-4 1.96-4 3.46v4h16v-4c0-1.5-1.6-2.76-4-3.46"
		/></svg
	>
{:else if iconType === 'librarian'}
	<svg xmlns="http://www.w3.org/2000/svg" {width} {height} viewBox="0 0 24 24"
		><path
			fill="currentColor"
			d="M12 1L3 5v6c0 5.55 3.84 10.74 9 12c5.16-1.26 9-6.45 9-12V5zm0 4a3 3 0 0 1 3 3a3 3 0 0 1-3 3a3 3 0 0 1-3-3a3 3 0 0 1 3-3m5.13 12A9.7 9.7 0 0 1 12 20.92A9.7 9.7 0 0 1 6.87 17c-.34-.5-.63-1-.87-1.53c0-1.65 2.71-3 6-3s6 1.32 6 3c-.24.53-.53 1.03-.87 1.53"
		/></svg
	>
{:else if iconType === 'list'}
	<svg xmlns="http://www.w3.org/2000/svg" {width} {height} viewBox="0 0 24 24"
		><path
			fill="currentColor"
			d="M19 3H5c-1.1 0-2 .9-2 2v14c0 1.1.9 2 2 2h14c1.1 0 2-.9 2-2V5c0-1.1-.9-2-2-2M7 7h2v2H7zm0 4h2v2H7zm0 4h2v2H7zm10 2h-6v-2h6zm0-4h-6v-2h6zm0-4h-6V7h6z"
		/></svg
	>
{:else if iconType === 'list-typed'}
	<svg xmlns="http://www.w3.org/2000/svg" {width} {height} viewBox="0 0 24 24"
		><path
			fill="currentColor"
			d="M5 9.5L7.5 14h-5zM3 4h4v4H3zm2 16a2 2 0 0 0 2-2a2 2 0 0 0-2-2a2 2 0 0 0-2 2a2 2 0 0 0 2 2M9 5v2h12V5zm0 14h12v-2H9zm0-6h12v-2H9z"
		/></svg
	>
{:else if iconType === 'list-numbered'}
	<svg xmlns="http://www.w3.org/2000/svg" {width} {height} viewBox="0 0 24 24"
		><path
			fill="currentColor"
			d="M7 13v-2h14v2zm0 6v-2h14v2zM7 7V5h14v2zM3 8V5H2V4h2v4zm-1 9v-1h3v4H2v-1h2v-.5H3v-1h1V17zm2.25-7a.75.75 0 0 1 .75.75c0 .2-.08.39-.21.52L3.12 13H5v1H2v-.92L4 11H2v-1z"
		/></svg
	>
{:else if iconType === 'nametag'}
	<svg xmlns="http://www.w3.org/2000/svg" {width} {height} viewBox="0 0 24 24"
		><path
			fill="currentColor"
			d="m21.41 11.58l-9-9A2 2 0 0 0 11 2H4a2 2 0 0 0-2 2v7a2 2 0 0 0 .59 1.41l9 9A2 2 0 0 0 13 22a2 2 0 0 0 1.41-.59l7-7A2 2 0 0 0 22 13a2 2 0 0 0-.59-1.42M6.5 8A1.5 1.5 0 1 1 8 6.5A1.5 1.5 0 0 1 6.5 8m5.09 7.41l-4-4L9 10l4 4m2.59.41l-5.5-5.5L11.5 7.5L17 13Z"
		/></svg
	>
{:else if iconType === 'store'}
	<svg xmlns="http://www.w3.org/2000/svg" {width} {height} viewBox="0 0 24 24"
		><path
			fill="currentColor"
			d="M12 18H6v-4h6m9 0v-2l-1-5H4l-1 5v2h1v6h10v-6h4v6h2v-6m0-10H4v2h16z"
		/></svg
	>
{:else if iconType === 'place'}
	<svg xmlns="http://www.w3.org/2000/svg" {width} {height} viewBox="0 0 24 24"
		><path
			fill="currentColor"
			d="M17.9 17.39c-.26-.8-1.01-1.39-1.9-1.39h-1v-3a1 1 0 0 0-1-1H8v-2h2a1 1 0 0 0 1-1V7h2a2 2 0 0 0 2-2v-.41a7.984 7.984 0 0 1 2.9 12.8M11 19.93c-3.95-.49-7-3.85-7-7.93c0-.62.08-1.22.21-1.79L9 15v1a2 2 0 0 0 2 2m1-16A10 10 0 0 0 2 12a10 10 0 0 0 10 10a10 10 0 0 0 10-10A10 10 0 0 0 12 2"
		/></svg
	>
{:else if iconType === 'trash-can'}
	<svg xmlns="http://www.w3.org/2000/svg" {width} {height} viewBox="0 0 24 24"
		><path
			fill="currentColor"
			d="M9 3v1H4v2h1v13a2 2 0 0 0 2 2h10a2 2 0 0 0 2-2V6h1V4h-5V3zm0 5h2v9H9zm4 0h2v9h-2z"
		/></svg
	>
{:else if iconType === 'settings'}
	<svg xmlns="http://www.w3.org/2000/svg" {width} {height} viewBox="0 0 24 24"
		><path
			fill="currentColor"
			d="M12 15.5A3.5 3.5 0 0 1 8.5 12A3.5 3.5 0 0 1 12 8.5a3.5 3.5 0 0 1 3.5 3.5a3.5 3.5 0 0 1-3.5 3.5m7.43-2.53c.04-.32.07-.64.07-.97s-.03-.66-.07-1l2.11-1.63c.19-.15.24-.42.12-.64l-2-3.46c-.12-.22-.39-.31-.61-.22l-2.49 1c-.52-.39-1.06-.73-1.69-.98l-.37-2.65A.506.506 0 0 0 14 2h-4c-.25 0-.46.18-.5.42l-.37 2.65c-.63.25-1.17.59-1.69.98l-2.49-1c-.22-.09-.49 0-.61.22l-2 3.46c-.13.22-.07.49.12.64L4.57 11c-.04.34-.07.67-.07 1s.03.65.07.97l-2.11 1.66c-.19.15-.25.42-.12.64l2 3.46c.12.22.39.3.61.22l2.49-1.01c.52.4 1.06.74 1.69.99l.37 2.65c.04.24.25.42.5.42h4c.25 0 .46-.18.5-.42l.37-2.65c.63-.26 1.17-.59 1.69-.99l2.49 1.01c.22.08.49 0 .61-.22l2-3.46c.12-.22.07-.49-.12-.64z"
		/></svg
	>
{:else if iconType === 'sort-descending'}
	<svg xmlns="http://www.w3.org/2000/svg" {width} {height} viewBox="0 0 24 24"
		><path fill="currentColor" d="M19 7h3l-4-4l-4 4h3v14h2M2 17h10v2H2M6 5v2H2V5m0 6h7v2H2z" /></svg
	>
{:else if iconType === 'sort-ascending'}
	<svg xmlns="http://www.w3.org/2000/svg" {width} {height} viewBox="0 0 24 24"
		><path fill="currentColor" d="M19 17h3l-4 4l-4-4h3V3h2M2 17h10v2H2M6 5v2H2V5m0 6h7v2H2z" /></svg
	>
{:else if iconType === 'case-sensitive'}
	<svg xmlns="http://www.w3.org/2000/svg" {width} {height} viewBox="0 0 24 24"
		><path
			fill="currentColor"
			d="M20.06 18a4 4 0 0 1-.2-.89c-.67.7-1.48 1.05-2.41 1.05c-.83 0-1.52-.24-2.05-.71c-.53-.45-.8-1.06-.8-1.79c0-.88.33-1.56 1-2.05s1.61-.73 2.83-.73h1.4v-.64q0-.735-.45-1.17c-.3-.29-.75-.43-1.33-.43c-.52 0-.95.12-1.3.36c-.35.25-.52.54-.52.89h-1.46c0-.43.15-.84.45-1.24c.28-.4.71-.71 1.22-.94c.51-.21 1.06-.35 1.69-.35c.98 0 1.74.24 2.29.73s.84 1.16.86 2.02V16c0 .8.1 1.42.3 1.88V18zm-2.4-1.12c.45 0 .88-.11 1.29-.32c.4-.21.7-.49.88-.83v-1.57H18.7c-1.77 0-2.66.47-2.66 1.41c0 .43.15.73.46.96c.3.23.68.35 1.16.35m-12.2-3.17h4.07L7.5 8.29zM6.64 6h1.72l4.71 12h-1.93l-.97-2.57H4.82L3.86 18H1.93z"
		/></svg
	>
{:else if iconType === 'add'}
	<svg xmlns="http://www.w3.org/2000/svg" {width} {height} viewBox="0 0 24 24"
		><path fill="currentColor" d="M19 13h-6v6h-2v-6H5v-2h6V5h2v6h6z" /></svg
	>
{:else if iconType === 'remove'}
	<svg xmlns="http://www.w3.org/2000/svg" {width} {height} viewBox="0 0 24 24"
		><path fill="currentColor" d="M19 13H5v-2h14z" /></svg
	>
{:else if iconType === 'edit'}
	<svg xmlns="http://www.w3.org/2000/svg" {width} {height} viewBox="0 0 24 24"
		><path
			fill="currentColor"
			d="M20.71 7.04c.39-.39.39-1.04 0-1.41l-2.34-2.34c-.37-.39-1.02-.39-1.41 0l-1.84 1.83l3.75 3.75M3 17.25V21h3.75L17.81 9.93l-3.75-3.75z"
		/></svg
	>
{:else if iconType === 'copy'}
	<svg xmlns="http://www.w3.org/2000/svg" {width} {height} viewBox="0 0 24 24"
		><path
			fill="currentColor"
			d="M19 21H8V7h11m0-2H8a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h11a2 2 0 0 0 2-2V7a2 2 0 0 0-2-2m-3-4H4a2 2 0 0 0-2 2v14h2V3h12z"
		/></svg
	>
{:else if iconType === 'merge'}
	<svg xmlns="http://www.w3.org/2000/svg" {width} {height} viewBox="0 0 24 24"
		><path
			fill="currentColor"
			d="M17 20.41L18.41 19L15 15.59L13.59 17M7.5 8H11v5.59L5.59 19L7 20.41l6-6V8h3.5L12 3.5"
		/></svg
	>
{:else if iconType === 'selection-remove'}
	<svg xmlns="http://www.w3.org/2000/svg" {width} {height} viewBox="0 0 24 24"
		><path
			fill="currentColor"
			d="M20 20v-3h2v3a2 2 0 0 1-2 2h-3v-2zM2 20v-3h2v3h3v2H4c-1.1 0-2-.9-2-2m8 0h4v2h-4zm4.59-12L12 10.59L9.41 8L8 9.41L10.59 12L8 14.59L9.41 16L12 13.41L14.59 16L16 14.59L13.41 12L16 9.41zM20 10h2v4h-2zM2 10h2v4H2zm0-6a2 2 0 0 1 2-2h3v2H4v3H2zm20 0v3h-2V4h-3V2h3c1.1 0 2 .9 2 2M10 2h4v2h-4z"
		/></svg
	>
{:else if iconType === 'column-width'}
	<svg xmlns="http://www.w3.org/2000/svg" {width} {height} viewBox="0 0 24 24"
		><path
			fill="currentColor"
			d="M9 11h6V8l4 4l-4 4v-3H9v3l-4-4l4-4zm-7 9V4h2v16zm18 0V4h2v16z"
		/></svg
	>
{:else if iconType === 'chevron-up'}
	<svg xmlns="http://www.w3.org/2000/svg" {width} {height} viewBox="0 0 24 24"
		><path fill="currentColor" d="M7.41 15.41L12 10.83l4.59 4.58L18 14l-6-6l-6 6z" /></svg
	>
{:else if iconType === 'chevron-right'}
	<svg xmlns="http://www.w3.org/2000/svg" {width} {height} viewBox="0 0 24 24"
		><path fill="currentColor" d="M8.59 16.58L13.17 12L8.59 7.41L10 6l6 6l-6 6z" /></svg
	>
{:else if iconType === 'password-reset'}
	<svg xmlns="http://www.w3.org/2000/svg" {width} {height} viewBox="0 0 24 24"
		><path
			fill="currentColor"
			d="M12.63 2c5.53 0 10.01 4.5 10.01 10s-4.48 10-10.01 10c-3.51 0-6.58-1.82-8.37-4.57l1.58-1.25C7.25 18.47 9.76 20 12.64 20a8 8 0 0 0 8-8a8 8 0 0 0-8-8C8.56 4 5.2 7.06 4.71 11h2.76l-3.74 3.73L0 11h2.69c.5-5.05 4.76-9 9.94-9m2.96 8.24c.5.01.91.41.91.92v4.61c0 .5-.41.92-.92.92h-5.53c-.51 0-.92-.42-.92-.92v-4.61c0-.51.41-.91.91-.92V9.23c0-1.53 1.25-2.77 2.77-2.77c1.53 0 2.78 1.24 2.78 2.77zm-2.78-2.38c-.75 0-1.37.61-1.37 1.37v1.01h2.75V9.23c0-.76-.62-1.37-1.38-1.37"
		/></svg
	>
{:else if iconType === 'shield-add'}
	<svg xmlns="http://www.w3.org/2000/svg" {width} {height} viewBox="0 0 24 24"
		><path
			fill="currentColor"
			d="M19 20v2.97h-2V20h-3v-2h3v-3h2v3h3v2zM12 1l9 4v6c0 .9-.1 1.78-.29 2.65A5.8 5.8 0 0 0 18 13a6 6 0 0 0-6 6c0 1.36.45 2.62 1.22 3.62L12 23c-5.16-1.26-9-6.45-9-12V5z"
		/></svg
	>
{:else if iconType === 'loading'}
	<svg xmlns="http://www.w3.org/2000/svg" {width} {height} viewBox="0 0 24 24"
		><path fill="currentColor" d="M12 4V2A10 10 0 0 0 2 12h2a8 8 0 0 1 8-8" /></svg
	>
{:else if iconType === 'quote'}
	<svg xmlns="http://www.w3.org/2000/svg" {width} {height} viewBox="0 0 24 24"
		><path fill="currentColor" d="M14 17h3l2-4V7h-6v6h3M6 17h3l2-4V7H5v6h3z" /></svg
	>
{:else if iconType === 'download'}
	<svg xmlns="http://www.w3.org/2000/svg" {width} {height} viewBox="0 0 24 24"
		><path fill="currentColor" d="M5 20h14v-2H5m14-9h-4V3H9v6H5l7 7z" /></svg
	>
{:else if iconType === 'upload'}
	<svg xmlns="http://www.w3.org/2000/svg" {width} {height} viewBox="0 0 24 24"
		><path fill="currentColor" d="M9 16v-6H5l7-7l7 7h-4v6zm-4 4v-2h14v2z" /></svg
	>
{:else if iconType === 'monitor'}
	<svg xmlns="http://www.w3.org/2000/svg" {width} {height} viewBox="0 0 24 24"
		><path
			fill="currentColor"
			d="M21 16H3V4h18m0-2H3c-1.11 0-2 .89-2 2v12a2 2 0 0 0 2 2h7v2H8v2h8v-2h-2v-2h7a2 2 0 0 0 2-2V4a2 2 0 0 0-2-2"
		/></svg
	>
{:else if iconType === 'light-theme'}
	<svg xmlns="http://www.w3.org/2000/svg" {width} {height} viewBox="0 0 24 24"
		><path
			fill="currentColor"
			d="m3.55 19.09l1.41 1.41l1.8-1.79l-1.42-1.42M12 6c-3.31 0-6 2.69-6 6s2.69 6 6 6s6-2.69 6-6c0-3.32-2.69-6-6-6m8 7h3v-2h-3m-2.76 7.71l1.8 1.79l1.41-1.41l-1.79-1.8M20.45 5l-1.41-1.4l-1.8 1.79l1.42 1.42M13 1h-2v3h2M6.76 5.39L4.96 3.6L3.55 5l1.79 1.81zM1 13h3v-2H1m12 9h-2v3h2"
		/></svg
	>
{:else if iconType === 'dark-theme'}
	<svg xmlns="http://www.w3.org/2000/svg" {width} {height} viewBox="0 0 24 24"
		><path
			fill="currentColor"
			d="m17.75 4.09l-2.53 1.94l.91 3.06l-2.63-1.81l-2.63 1.81l.91-3.06l-2.53-1.94L12.44 4l1.06-3l1.06 3zm3.5 6.91l-1.64 1.25l.59 1.98l-1.7-1.17l-1.7 1.17l.59-1.98L15.75 11l2.06-.05L18.5 9l.69 1.95zm-2.28 4.95c.83-.08 1.72 1.1 1.19 1.85c-.32.45-.66.87-1.08 1.27C15.17 23 8.84 23 4.94 19.07c-3.91-3.9-3.91-10.24 0-14.14c.4-.4.82-.76 1.27-1.08c.75-.53 1.93.36 1.85 1.19c-.27 2.86.69 5.83 2.89 8.02a9.96 9.96 0 0 0 8.02 2.89m-1.64 2.02a12.08 12.08 0 0 1-7.8-3.47c-2.17-2.19-3.33-5-3.49-7.82c-2.81 3.14-2.7 7.96.31 10.98c3.02 3.01 7.84 3.12 10.98.31"
		/></svg
	>
{:else if iconType === 'purkynka'}
	<!-- prettier-ignore -->
	<svg xmlns="http://www.w3.org/2000/svg" {width} height={width * 0.25} viewBox="0 0 275 68.8"><path fill="#3e6182" d="M61.2 51.6v-3.9l3.4-.7V24l-3.4-.7v-3.8h15.3q3.7 0 6.4 1.3 2.6 1.2 4 3.6 1.5 2.2 1.5 5.3T87 35.1q-1.5 2.3-4.1 3.6-2.7 1.2-6.4 1.2h-5.4V47l3.4.7v3.9zM71.1 35h5.4q2.7 0 4-1.5Q82 32 82 29.8q0-2.4-1.3-3.9-1.4-1.5-4.1-1.5h-5.4zm28.8 17q-3.7 0-5.9-2.4-2.1-2.4-2.1-7.4v-10l-2.7-.6v-3.9h9.1v14.5q0 2.6.9 3.7t2.7 1.1q1.4 0 2.5-.5 1.1-.6 1.8-1.6V32.2l-2.8-.6v-3.9h9.3V47l2.8.7v3.9H107l-.4-3q-1.1 1.6-2.8 2.5-1.7 1-3.9 1zm17.7-.4v-3.9l3.1-.7V32.2l-3.4-.6v-3.9h9.4l.3 3v.5q.9-2 2.2-3 1.3-1 3.1-1l1.3.2 1.2.2-.7 6-3.2-.2q-1.4-.1-2.2.4-.9.6-1.5 1.6V47l3 .7v3.9zm16.9 0v-3.9l3-.7V21.7l-3.4-.7v-3.8h9.9V47l2.8.7v3.9zm15.1 0v-3.7l1.9-.4v-.1l-4.8-6.4 4-4.2 8 10.2 2.9.7v3.9zm-6.3-6.6-3-3.6 10.3-9.4v-.1l-2.4-.4v-3.8h12.4v3.9l-3.1.8zm26.4 16.2-1.8-.2q-1 0-1.8-.3l.7-4.8 1 .2h.8q1.4 0 2.5-.7 1-.7 1.4-2.1l.6-1.5-8-19.8-3-.4v-3.9h12.7v3.9l-3 .4 3.8 10.5.5 1.3h.1l4.5-11.8-2.9-.4v-3.9h11.8v3.9l-2.7.4-9 23.1q-.7 1.7-1.8 3-1 1.4-2.6 2.3-1.5.8-3.8.8zm20.7-9.6v-3.9l3-.7V32.2l-3.4-.6v-3.9h9.4l.3 3.4q1.2-1.8 3-2.8 1.7-1 4-1 3.5 0 5.5 2.2 2 2.3 2 7.2V47l3.1.7v3.9H205v-3.9l2.8-.7V36.7q0-2.4-1-3.4t-2.8-1q-1.4 0-2.4.6-1 .5-1.7 1.6V47l2.6.7v3.9zm21.2-34.4v.5l-5.6 5.4h-4.7l-5.6-5.4v-.5h5l3 3.1 3-3.1zm6.7 34.4v-3.9l3.1-.7V21.7L218 21v-3.8h9.8V47l2.8.7v3.9zm15.2 0v-3.7l1.8-.4v-.1l-4.8-6.4 4.1-4.2 7.9 10.2 3 .7v3.9zM227 45l-3-3.6 10.3-9.4v-.1l-2.4-.4v-3.8h12.4v3.9l-3 .8zm27.8 7q-3.6 0-5.7-1.9-2-1.9-2-5.2 0-3.3 2.7-5.4 2.7-2.2 8-2.2h3.1v-1.7q0-1.7-1-2.8-1-1-3-1-1 0-1.8.2-.9.2-1.5.7l-.6 3.1h-4.6v-6.2q1.8-1 4-1.7 2.2-.6 4.9-.6 4.6 0 7.3 2.1 2.8 2.2 2.8 6.2V47.3l2.5.4v3.9h-8l-.4-1.4-.4-1.4q-1.1 1.5-2.7 2.4-1.5.8-3.6.8zm1.7-4.7q1.3 0 2.5-.6 1.3-.7 2-1.6v-3.8h-3.3q-2 0-3.2 1-1 1-1 2.3 0 1.3.7 2 .9.7 2.3.7z" aria-label="Purkyňka"/><path fill="#5284b0" d="m5 16.9 6.3-2.4v43.8L5 60.6z"/><path fill="#aad4f3" d="m13 10 6.2-2.4v43.7L13 53.6z"/><path fill="#77afe0" d="m20.9 11.7 6.3-2.3V53L21 55.4z"/><path fill="#5284b0" d="m28.8 16.9 6.3-2.4v43.8L29 60.5z"/></svg>
{:else if iconType === 'help'}
	<svg xmlns="http://www.w3.org/2000/svg" {width} {height} viewBox="0 0 24 24">
		<path d="M0 0h24v24H0z" fill="none" />
		<path
			fill="currentColor"
			d="M11 18h2v-2h-2zm1-12a4 4 0 0 0-4 4h2a2 2 0 0 1 2-2a2 2 0 0 1 2 2c0 2-3 1.75-3 5h2c0-2.25 3-2.5 3-5a4 4 0 0 0-4-4M5 3h14a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2"
		/>
	</svg>
{/if}

<style>
	svg {
		pointer-events: none;
	}
</style>
