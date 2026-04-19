<script lang="ts" module>
	export const SIDEBAR_COLLAPSED_WIDTH = '64px';
	export const SIDEBAR_EXPANDED_WIDTH = '80px';

	let sidebarExpanded: boolean = $state(true);
	const sidebarWidth = $derived(sidebarExpanded ? SIDEBAR_EXPANDED_WIDTH : SIDEBAR_COLLAPSED_WIDTH);

	export const getSidebarExpanded = () => sidebarExpanded;
	export const toggleSidebarExpanded = () => (sidebarExpanded = !sidebarExpanded);

	export const getSidebarWidth = () => sidebarWidth;
</script>

<script lang="ts">
	import type { Snippet } from 'svelte';

	let { sidebar, view }: { sidebar: Snippet; view: Snippet } = $props();
</script>

<div
	class="view-with-sidebar fill-container inverse-grid"
	style:--sidebar-width={getSidebarWidth()}
>
	<div class="sidebar flex-column">
		{@render sidebar()}
	</div>
	<div class="view">
		{@render view()}
	</div>
</div>

<style>
	.view-with-sidebar {
		grid-template-columns: var(--sidebar-width) auto;
	}

	.view {
		position: relative;
	}
</style>
