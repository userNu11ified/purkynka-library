<script lang="ts">
	import { resolve } from '$app/paths';
	import type { Pathname } from '$app/types';
	import type { Snippet } from 'svelte';
	import Icon, { type IconType } from '../icon/Icon.svelte';
	import { getSidebarExpanded } from './ViewWithSidebar.svelte';
	import { page } from '$app/state';

	let { href, iconType, children }: { href: Pathname; iconType: IconType; children: Snippet } =
		$props();

	const opened = $derived(page.url.pathname.startsWith(href));
</script>

<a class="sidebar-link button-like center-flex flex-column" class:opened href={resolve(href)}>
	<Icon {iconType} width={28} />
	{#if getSidebarExpanded()}
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
