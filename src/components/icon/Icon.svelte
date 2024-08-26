<script lang="ts">
	import type { IconType } from '$client/icon/icon';

	export let type: IconType;
	export let size: number = 32;
</script>

{#if type === 'book'}
	<!-- prettier-ignore -->
	<svg xmlns="http://www.w3.org/2000/svg" width={size} height={size} viewBox="0 0 24 24"><path fill="currentColor" d="M18 22a2 2 0 0 0 2-2V4a2 2 0 0 0-2-2h-6v7L9.5 7.5L7 9V2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2z"/></svg>
{:else if type === 'book-add'}
	<!-- prettier-ignore -->
	<svg xmlns="http://www.w3.org/2000/svg" width={size} height={size} viewBox="0 0 24 24"><path fill="currentColor" d="M13 19c0 1.1.3 2.12.81 3H6c-1.11 0-2-.89-2-2V4a2 2 0 0 1 2-2h1v7l2.5-1.5L12 9V2h6a2 2 0 0 1 2 2v9.09c-.33-.05-.66-.09-1-.09c-3.31 0-6 2.69-6 6m7-1v-3h-2v3h-3v2h3v3h2v-3h3v-2z"/></svg>
{:else if type === 'book-borrow'}
	<!-- prettier-ignore -->
	<svg xmlns="http://www.w3.org/2000/svg" width={size} height={size} viewBox="0 0 24 24"><path fill="currentColor" d="M13 19c0 1.1.3 2.12.81 3H6c-1.11 0-2-.89-2-2V4a2 2 0 0 1 2-2h1v7l2.5-1.5L12 9V2h6a2 2 0 0 1 2 2v9.09c-.33-.05-.66-.09-1-.09c-3.31 0-6 2.69-6 6m6-4l-3 3h2v4h2v-4h2z"/></svg>
{:else if type === 'book-lock'}
	<!-- prettier-ignore -->
	<svg xmlns="http://www.w3.org/2000/svg" width={size} height={size} viewBox="0 0 24 24"><path fill="currentColor" d="M14.2 14.5v.24c-.7.6-1.2 1.5-1.2 2.46v3.5c0 .46.1.9.27 1.3H6c-1.11 0-2-.89-2-2V4a2 2 0 0 1 2-2h1v7l2.5-1.5L12 9V2h6a2 2 0 0 1 2 2v6.11c-.32-.07-.66-.11-1-.11c-2.6 0-4.8 2.06-4.8 4.5m8.8 2.8v3.5c0 .6-.6 1.2-1.3 1.2h-5.5c-.6 0-1.2-.6-1.2-1.3v-3.5c0-.6.6-1.2 1.2-1.2v-1.5c0-1.4 1.4-2.5 2.8-2.5s2.8 1.1 2.8 2.5V16c.6 0 1.2.6 1.2 1.3m-2.5-2.8c0-.8-.7-1.3-1.5-1.3s-1.5.5-1.5 1.3V16h3z"/></svg>
{:else if type === 'book-discard'}
	<!-- prettier-ignore -->
	<svg xmlns="http://www.w3.org/2000/svg" width={size} height={size} viewBox="0 0 24 24"><path fill="currentColor" d="M13 19c0 1.1.3 2.12.81 3H6c-1.11 0-2-.89-2-2V4a2 2 0 0 1 2-2h1v7l2.5-1.5L12 9V2h6a2 2 0 0 1 2 2v9.09c-.33-.05-.66-.09-1-.09c-3.31 0-6 2.69-6 6m9.54-2.12l-1.42-1.41L19 17.59l-2.12-2.12l-1.41 1.41L17.59 19l-2.12 2.12l1.41 1.42L19 20.41l2.12 2.13l1.42-1.42L20.41 19z"/></svg>
{:else if type === 'book-edit'}
	<!-- prettier-ignore -->
	<svg xmlns="http://www.w3.org/2000/svg" width={size} height={size} viewBox="0 0 24 24"><path fill="currentColor" d="M19.39 10.74L11 19.13V22H6c-1.11 0-2-.89-2-2V4a2 2 0 0 1 2-2h1v7l2.5-1.5L12 9V2h6a2 2 0 0 1 2 2v6.3c-.22.12-.43.26-.61.44M13 19.96V22h2.04l6.13-6.12l-2.04-2.05zm9.85-6.49l-1.32-1.32c-.2-.2-.53-.2-.72 0l-.98.98l2.04 2.04l.98-.98c.2-.19.2-.52 0-.72"/></svg>
{:else if type === 'book-return-discard'}
	<!-- prettier-ignore -->
	<svg xmlns="http://www.w3.org/2000/svg" width={size} height={size} viewBox="0 0 24 24"><path fill="currentColor" d="M12 18.5c0 1.29.39 2.5 1.04 3.5H6c-1.11 0-2-.89-2-2V4a2 2 0 0 1 2-2h1v7l2.5-1.5L12 9V2h6a2 2 0 0 1 2 2v8.18c-.5-.11-1-.18-1.5-.18a6.5 6.5 0 0 0-6.5 6.5m10 0v-4l-1.17 1.17A4 4 0 0 0 18 14.5c-2.21 0-4 1.79-4 4s1.79 4 4 4c1.68 0 3.12-1.03 3.71-2.5H20a2.5 2.5 0 1 1-.23-3.27L18 18.5z"/></svg>
{:else if type === 'book-return'}
	<!-- prettier-ignore -->
	<svg xmlns="http://www.w3.org/2000/svg" width={size} height={size} viewBox="0 0 24 24"><path fill="currentColor" d="M13 19c0 1.1.3 2.12.81 3H6c-1.11 0-2-.89-2-2V4a2 2 0 0 1 2-2h1v7l2.5-1.5L12 9V2h6a2 2 0 0 1 2 2v9.09c-.33-.05-.66-.09-1-.09c-3.31 0-6 2.69-6 6m7 1v-4h-2v4h-2l3 3l3-3z"/></svg>
{:else if type === 'history'}
	<!-- prettier-ignore -->
	<svg xmlns="http://www.w3.org/2000/svg" width={size} height={size} viewBox="0 0 24 24"><path fill="currentColor" d="M13.5 8H12v5l4.28 2.54l.72-1.21l-3.5-2.08zM13 3a9 9 0 0 0-9 9H1l3.96 4.03L9 12H6a7 7 0 0 1 7-7a7 7 0 0 1 7 7a7 7 0 0 1-7 7c-1.93 0-3.68-.79-4.94-2.06l-1.42 1.42A8.9 8.9 0 0 0 13 21a9 9 0 0 0 9-9a9 9 0 0 0-9-9"/></svg>
{:else if type === 'list'}
	<!-- prettier-ignore -->
	<svg xmlns="http://www.w3.org/2000/svg" width={size} height={size} viewBox="0 0 24 24"><path fill="currentColor" d="M19 3H5c-1.1 0-2 .9-2 2v14c0 1.1.9 2 2 2h14c1.1 0 2-.9 2-2V5c0-1.1-.9-2-2-2M7 7h2v2H7zm0 4h2v2H7zm0 4h2v2H7zm10 2h-6v-2h6zm0-4h-6v-2h6zm0-4h-6V7h6z"/></svg>
{:else if type === 'purkynka'}
	<!-- prettier-ignore -->
	<svg xmlns="http://www.w3.org/2000/svg" width={size} height={size * 0.25} viewBox="0 0 275 68.8"><path fill="#3e6182" d="M61.2 51.6v-3.9l3.4-.7V24l-3.4-.7v-3.8h15.3q3.7 0 6.4 1.3 2.6 1.2 4 3.6 1.5 2.2 1.5 5.3T87 35.1q-1.5 2.3-4.1 3.6-2.7 1.2-6.4 1.2h-5.4V47l3.4.7v3.9zM71.1 35h5.4q2.7 0 4-1.5Q82 32 82 29.8q0-2.4-1.3-3.9-1.4-1.5-4.1-1.5h-5.4zm28.8 17q-3.7 0-5.9-2.4-2.1-2.4-2.1-7.4v-10l-2.7-.6v-3.9h9.1v14.5q0 2.6.9 3.7t2.7 1.1q1.4 0 2.5-.5 1.1-.6 1.8-1.6V32.2l-2.8-.6v-3.9h9.3V47l2.8.7v3.9H107l-.4-3q-1.1 1.6-2.8 2.5-1.7 1-3.9 1zm17.7-.4v-3.9l3.1-.7V32.2l-3.4-.6v-3.9h9.4l.3 3v.5q.9-2 2.2-3 1.3-1 3.1-1l1.3.2 1.2.2-.7 6-3.2-.2q-1.4-.1-2.2.4-.9.6-1.5 1.6V47l3 .7v3.9zm16.9 0v-3.9l3-.7V21.7l-3.4-.7v-3.8h9.9V47l2.8.7v3.9zm15.1 0v-3.7l1.9-.4v-.1l-4.8-6.4 4-4.2 8 10.2 2.9.7v3.9zm-6.3-6.6-3-3.6 10.3-9.4v-.1l-2.4-.4v-3.8h12.4v3.9l-3.1.8zm26.4 16.2-1.8-.2q-1 0-1.8-.3l.7-4.8 1 .2h.8q1.4 0 2.5-.7 1-.7 1.4-2.1l.6-1.5-8-19.8-3-.4v-3.9h12.7v3.9l-3 .4 3.8 10.5.5 1.3h.1l4.5-11.8-2.9-.4v-3.9h11.8v3.9l-2.7.4-9 23.1q-.7 1.7-1.8 3-1 1.4-2.6 2.3-1.5.8-3.8.8zm20.7-9.6v-3.9l3-.7V32.2l-3.4-.6v-3.9h9.4l.3 3.4q1.2-1.8 3-2.8 1.7-1 4-1 3.5 0 5.5 2.2 2 2.3 2 7.2V47l3.1.7v3.9H205v-3.9l2.8-.7V36.7q0-2.4-1-3.4t-2.8-1q-1.4 0-2.4.6-1 .5-1.7 1.6V47l2.6.7v3.9zm21.2-34.4v.5l-5.6 5.4h-4.7l-5.6-5.4v-.5h5l3 3.1 3-3.1zm6.7 34.4v-3.9l3.1-.7V21.7L218 21v-3.8h9.8V47l2.8.7v3.9zm15.2 0v-3.7l1.8-.4v-.1l-4.8-6.4 4.1-4.2 7.9 10.2 3 .7v3.9zM227 45l-3-3.6 10.3-9.4v-.1l-2.4-.4v-3.8h12.4v3.9l-3 .8zm27.8 7q-3.6 0-5.7-1.9-2-1.9-2-5.2 0-3.3 2.7-5.4 2.7-2.2 8-2.2h3.1v-1.7q0-1.7-1-2.8-1-1-3-1-1 0-1.8.2-.9.2-1.5.7l-.6 3.1h-4.6v-6.2q1.8-1 4-1.7 2.2-.6 4.9-.6 4.6 0 7.3 2.1 2.8 2.2 2.8 6.2V47.3l2.5.4v3.9h-8l-.4-1.4-.4-1.4q-1.1 1.5-2.7 2.4-1.5.8-3.6.8zm1.7-4.7q1.3 0 2.5-.6 1.3-.7 2-1.6v-3.8h-3.3q-2 0-3.2 1-1 1-1 2.3 0 1.3.7 2 .9.7 2.3.7z" aria-label="Purkyňka"/><path fill="#5284b0" d="m5 16.9 6.3-2.4v43.8L5 60.6z"/><path fill="#aad4f3" d="m13 10 6.2-2.4v43.7L13 53.6z"/><path fill="#77afe0" d="m20.9 11.7 6.3-2.3V53L21 55.4z"/><path fill="#5284b0" d="m28.8 16.9 6.3-2.4v43.8L29 60.5z"/></svg>
{:else if type === 'quote'}
	<!-- prettier-ignore -->
	<svg xmlns="http://www.w3.org/2000/svg" width={size} height={size} viewBox="0 0 24 24"><path fill="currentColor" d="m10 7l-2 4h3v6H5v-6l2-4zm8 0l-2 4h3v6h-6v-6l2-4z"/></svg>
{:else if type === 'arrow-left'}
	<!-- prettier-ignore -->
	<svg xmlns="http://www.w3.org/2000/svg" width={size} height={size} viewBox="0 0 24 24"><path fill="currentColor" d="M15.41 16.58L10.83 12l4.58-4.59L14 6l-6 6l6 6z"/></svg>
{:else if type === 'arrow-right'}
	<!-- prettier-ignore -->
	<svg xmlns="http://www.w3.org/2000/svg" width={size} height={size} viewBox="0 0 24 24"><path fill="currentColor" d="M8.59 16.58L13.17 12L8.59 7.41L10 6l6 6l-6 6z"/></svg>
{:else if type === 'arrow-up'}
	<!-- prettier-ignore -->
	<svg xmlns="http://www.w3.org/2000/svg" width={size} height={size} viewBox="0 0 24 24"><path fill="currentColor" d="M7.41 15.41L12 10.83l4.59 4.58L18 14l-6-6l-6 6z"/></svg>
{:else if type === 'arrow-down'}
	<!-- prettier-ignore -->
	<svg xmlns="http://www.w3.org/2000/svg" width={size} height={size} viewBox="0 0 24 24"><path fill="currentColor" d="M7.41 8.58L12 13.17l4.59-4.59L18 10l-6 6l-6-6z"/></svg>
{:else if type === 'reset'}
	<!-- prettier-ignore -->
	<svg xmlns="http://www.w3.org/2000/svg" width={size} height={size} viewBox="0 0 24 24"><path fill="currentColor" d="m19 8l-4 4h3a6 6 0 0 1-6 6c-1 0-1.97-.25-2.8-.7l-1.46 1.46A7.93 7.93 0 0 0 12 20a8 8 0 0 0 8-8h3M6 12a6 6 0 0 1 6-6c1 0 1.97.25 2.8.7l1.46-1.46A7.93 7.93 0 0 0 12 4a8 8 0 0 0-8 8H1l4 4l4-4"/></svg>
{:else if type === 'eyes'}
	<!-- prettier-ignore -->
	<svg xmlns="http://www.w3.org/2000/svg" width={size} height={size} viewBox="0 0 36 36"><ellipse fill="#F5F8FA" cx="8.828" cy="18" rx="7.953" ry="13.281"/><path fill="#E1E8ED" d="M8.828 32.031C3.948 32.031.125 25.868.125 18S3.948 3.969 8.828 3.969 17.531 10.132 17.531 18s-3.823 14.031-8.703 14.031zm0-26.562C4.856 5.469 1.625 11.09 1.625 18s3.231 12.531 7.203 12.531S16.031 24.91 16.031 18 12.8 5.469 8.828 5.469z"/><circle fill="#8899A6" cx="6.594" cy="18" r="4.96"/><circle fill="#292F33" cx="6.594" cy="18" r="3.565"/><circle fill="#F5F8FA" cx="7.911" cy="15.443" r="1.426"/><ellipse fill="#F5F8FA" cx="27.234" cy="18" rx="7.953" ry="13.281"/><path fill="#E1E8ED" d="M27.234 32.031c-4.88 0-8.703-6.163-8.703-14.031s3.823-14.031 8.703-14.031S35.938 10.132 35.938 18s-3.824 14.031-8.704 14.031zm0-26.562c-3.972 0-7.203 5.622-7.203 12.531 0 6.91 3.231 12.531 7.203 12.531S34.438 24.91 34.438 18 31.206 5.469 27.234 5.469z"/><circle fill="#8899A6" cx="25" cy="18" r="4.96"/><circle fill="#292F33" cx="25" cy="18" r="3.565"/><circle fill="#F5F8FA" cx="26.317" cy="15.443" r="1.426"/></svg>
{:else if type === 'plus'}
	<!-- prettier-ignore -->
	<svg xmlns="http://www.w3.org/2000/svg" width={size} height={size} shape-rendering="crispEdges" viewBox="0 0 24 24"><path fill="currentColor" d="M19 13h-6v6h-2v-6H5v-2h6V5h2v6h6z"/></svg>
{:else if type === 'dark-theme'}
	<!-- prettier-ignore -->
	<svg xmlns="http://www.w3.org/2000/svg" width={size} height={size} viewBox="0 0 24 24"><path fill="currentColor" d="m17.75 4.09l-2.53 1.94l.91 3.06l-2.63-1.81l-2.63 1.81l.91-3.06l-2.53-1.94L12.44 4l1.06-3l1.06 3zm3.5 6.91l-1.64 1.25l.59 1.98l-1.7-1.17l-1.7 1.17l.59-1.98L15.75 11l2.06-.05L18.5 9l.69 1.95zm-2.28 4.95c.83-.08 1.72 1.1 1.19 1.85c-.32.45-.66.87-1.08 1.27C15.17 23 8.84 23 4.94 19.07c-3.91-3.9-3.91-10.24 0-14.14c.4-.4.82-.76 1.27-1.08c.75-.53 1.93.36 1.85 1.19c-.27 2.86.69 5.83 2.89 8.02a9.96 9.96 0 0 0 8.02 2.89m-1.64 2.02a12.08 12.08 0 0 1-7.8-3.47c-2.17-2.19-3.33-5-3.49-7.82c-2.81 3.14-2.7 7.96.31 10.98c3.02 3.01 7.84 3.12 10.98.31"/></svg>
{:else if type === 'light-theme'}
	<!-- prettier-ignore -->
	<svg xmlns="http://www.w3.org/2000/svg" width={size} height={size} viewBox="0 0 24 24"><path fill="currentColor" d="m3.55 19.09l1.41 1.41l1.8-1.79l-1.42-1.42M12 6c-3.31 0-6 2.69-6 6s2.69 6 6 6s6-2.69 6-6c0-3.32-2.69-6-6-6m8 7h3v-2h-3m-2.76 7.71l1.8 1.79l1.41-1.41l-1.79-1.8M20.45 5l-1.41-1.4l-1.8 1.79l1.42 1.42M13 1h-2v3h2M6.76 5.39L4.96 3.6L3.55 5l1.79 1.81zM1 13h3v-2H1m12 9h-2v3h2"/></svg>
{:else if type === 'user'}
	<!-- prettier-ignore -->
	<svg xmlns="http://www.w3.org/2000/svg" width={size} height={size} viewBox="0 0 24 24"><path fill="currentColor" d="M12 4a4 4 0 0 1 4 4a4 4 0 0 1-4 4a4 4 0 0 1-4-4a4 4 0 0 1 4-4m0 10c4.42 0 8 1.79 8 4v2H4v-2c0-2.21 3.58-4 8-4"/></svg>
{:else if type === 'edit'}
	<!-- prettier-ignore -->
	<svg xmlns="http://www.w3.org/2000/svg" width={size} height={size} viewBox="0 0 24 24"><path fill="currentColor" d="M20.71 7.04c.39-.39.39-1.04 0-1.41l-2.34-2.34c-.37-.39-1.02-.39-1.41 0l-1.84 1.83l3.75 3.75M3 17.25V21h3.75L17.81 9.93l-3.75-3.75z"/></svg>
{:else if type === 'remove'}
	<!-- prettier-ignore -->
	<svg xmlns="http://www.w3.org/2000/svg" width={size} height={size} viewBox="0 0 24 24"><path fill="currentColor" d="M19 4h-3.5l-1-1h-5l-1 1H5v2h14M6 19a2 2 0 0 0 2 2h8a2 2 0 0 0 2-2V7H6z"/></svg>
{:else if type === 'extend'}
	<!-- prettier-ignore -->
	<svg xmlns="http://www.w3.org/2000/svg" width={size} height={size} viewBox="0 0 24 24"><path fill="currentColor" d="M13.72 21.84c-.56.1-1.13.16-1.72.16c-5.5 0-10-4.5-10-10S6.5 2 12 2s10 4.5 10 10c0 .59-.06 1.16-.16 1.72A5.9 5.9 0 0 0 19 13c-1.26 0-2.43.39-3.4 1.06l-3.1-1.86V7H11v6l3.43 2.11A5.96 5.96 0 0 0 13 19c0 1.03.26 2 .72 2.84M18 15v3h-3v2h3v3h2v-3h3v-2h-3v-3z"/></svg>
{:else if type === 'cross'}
	<!-- prettier-ignore -->
	<svg xmlns="http://www.w3.org/2000/svg" width={size} height={size} viewBox="0 0 24 24"><path fill="currentColor" d="M19 6.41L17.59 5L12 10.59L6.41 5L5 6.41L10.59 12L5 17.59L6.41 19L12 13.41L17.59 19L19 17.59L13.41 12z"/></svg>
{:else if type === 'checkmark'}
	<!-- prettier-ignore -->
	<svg xmlns="http://www.w3.org/2000/svg" width={size} height={size} viewBox="0 0 24 24"><path fill="currentColor" d="M21 7L9 19l-5.5-5.5l1.41-1.41L9 16.17L19.59 5.59z"/></svg>
{:else if type === 'settings'}
	<!-- prettier-ignore -->
	<svg xmlns="http://www.w3.org/2000/svg" width={size} height={size} viewBox="0 0 24 24"><path fill="currentColor" d="M12 15.5A3.5 3.5 0 0 1 8.5 12A3.5 3.5 0 0 1 12 8.5a3.5 3.5 0 0 1 3.5 3.5a3.5 3.5 0 0 1-3.5 3.5m7.43-2.53c.04-.32.07-.64.07-.97s-.03-.66-.07-1l2.11-1.63c.19-.15.24-.42.12-.64l-2-3.46c-.12-.22-.39-.31-.61-.22l-2.49 1c-.52-.39-1.06-.73-1.69-.98l-.37-2.65A.506.506 0 0 0 14 2h-4c-.25 0-.46.18-.5.42l-.37 2.65c-.63.25-1.17.59-1.69.98l-2.49-1c-.22-.09-.49 0-.61.22l-2 3.46c-.13.22-.07.49.12.64L4.57 11c-.04.34-.07.67-.07 1s.03.65.07.97l-2.11 1.66c-.19.15-.25.42-.12.64l2 3.46c.12.22.39.3.61.22l2.49-1.01c.52.4 1.06.74 1.69.99l.37 2.65c.04.24.25.42.5.42h4c.25 0 .46-.18.5-.42l.37-2.65c.63-.26 1.17-.59 1.69-.99l2.49 1.01c.22.08.49 0 .61-.22l2-3.46c.12-.22.07-.49-.12-.64z"/></svg>
{:else if type === 'password-viewer'}
	<!-- prettier-ignore -->
	<svg xmlns="http://www.w3.org/2000/svg" width={size} height={size} viewBox="0 0 24 24"><path fill="currentColor" d="M12 9a3 3 0 0 0-3 3a3 3 0 0 0 3 3a3 3 0 0 0 3-3a3 3 0 0 0-3-3m0 8a5 5 0 0 1-5-5a5 5 0 0 1 5-5a5 5 0 0 1 5 5a5 5 0 0 1-5 5m0-12.5C7 4.5 2.73 7.61 1 12c1.73 4.39 6 7.5 11 7.5s9.27-3.11 11-7.5c-1.73-4.39-6-7.5-11-7.5"/></svg>
{:else if type === 'password-hider'}
	<!-- prettier-ignore -->
	<svg xmlns="http://www.w3.org/2000/svg" width={size} height={size} viewBox="0 0 24 24"><path fill="currentColor" d="M11.83 9L15 12.16V12a3 3 0 0 0-3-3zm-4.3.8l1.55 1.55c-.05.21-.08.42-.08.65a3 3 0 0 0 3 3c.22 0 .44-.03.65-.08l1.55 1.55c-.67.33-1.41.53-2.2.53a5 5 0 0 1-5-5c0-.79.2-1.53.53-2.2M2 4.27l2.28 2.28l.45.45C3.08 8.3 1.78 10 1 12c1.73 4.39 6 7.5 11 7.5c1.55 0 3.03-.3 4.38-.84l.43.42L19.73 22L21 20.73L3.27 3M12 7a5 5 0 0 1 5 5c0 .64-.13 1.26-.36 1.82l2.93 2.93c1.5-1.25 2.7-2.89 3.43-4.75c-1.73-4.39-6-7.5-11-7.5c-1.4 0-2.74.25-4 .7l2.17 2.15C10.74 7.13 11.35 7 12 7"/></svg>
{:else if type === 'info'}
	<!-- prettier-ignore -->
	<svg xmlns="http://www.w3.org/2000/svg" width={size} height={size} viewBox="0 0 24 24"><path fill="currentColor" d="M5 3h14a2 2 0 0 1 2 2v14c0 .53-.21 1.04-.59 1.41c-.37.38-.88.59-1.41.59H5c-.53 0-1.04-.21-1.41-.59C3.21 20.04 3 19.53 3 19V5c0-1.11.89-2 2-2m6 6h2V7h-2zm3 8v-2h-1v-4h-3v2h1v2h-1v2z"/></svg>
{/if}

<style>
	svg {
		pointer-events: none;
	}
</style>
