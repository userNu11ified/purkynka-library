<script lang="ts">
	import faviconLight from '$lib/assets/favicon-light.svg';

	import '$style/font.css';
	import '$style/theme.css';
	import '$style/base.css';
	import '$style/util.css';
	import type { LayoutProps } from './$types';

	let { children }: LayoutProps = $props();
</script>

<svelte:head>
	<link rel="icon" href={faviconLight} />
	<title>Knihovna</title>
</svelte:head>

<div class="app-mount">
	{@render children()}
</div>

<style>
	.app-mount {
		width: 100dvw;
		height: 100dvh;

		overflow: hidden;
	}
</style>
