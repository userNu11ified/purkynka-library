<script lang="ts">
	import { resolve as svelteResolve } from '$app/paths';
	import type { Snippet } from 'svelte';
	import Icon, { type IconType } from '../icon/Icon.svelte';
	import { getSidebarExpanded } from './ViewWithSidebar.svelte';
	import { page } from '$app/state';
	import type { Pathname } from '$app/types';
	import type { ResolvedPathname } from '$app/types';

	let {
		href,
		iconType,
		iconWidth = 28,
		children
	}: {
		href: Pathname;
		iconType: IconType;
		iconWidth?: number;
		children: Snippet;
	} = $props();

	const opened = $derived(page.url.pathname.startsWith(href));
	const resolve = svelteResolve as (path: Pathname) => ResolvedPathname;
</script>

<a class="sidebar-link button-like center-flex flex-column" class:opened href={resolve(href)}>
	<Icon {iconType} width={iconWidth} />
	{#if getSidebarExpanded().current}
		<span class="sidebar-link-text">{@render children()}</span>
	{/if}
</a>

<style>
	.sidebar-link {
		gap: 4px;

		width: 100%;
		aspect-ratio: 1;

		text-align: center;
	}

	.sidebar-link-text {
		font-size: 12px;
		font-weight: 500;
	}

	.opened {
		color: var(--text-link);
	}
</style>
