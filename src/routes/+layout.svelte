<script lang="ts">
	import favicon from '$lib/assets/favicon.svg';
	import '$style/font.css';
	import '$style/theme.css';
	import '$style/base.css';

	let { children } = $props();
</script>

<svelte:head>
	<link rel="icon" href={favicon} />
</svelte:head>

<div class="app-mount">
	{@render children()}
</div>

<style>
	.app-mount {
		width: 100dvw;
		height: 100dvh;

		padding: 16px;

		overflow: hidden;
	}
</style>
