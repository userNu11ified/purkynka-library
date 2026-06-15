<script lang="ts" module>
	import { PersistedState } from 'runed';

	export const SIDEBAR_COLLAPSED_WIDTH = '64px';
	export const SIDEBAR_EXPANDED_WIDTH = '80px';

	let sidebarExpanded: PersistedState<boolean> = new PersistedState('sidebar-expanded', true);
	const sidebarWidth = $derived(
		sidebarExpanded.current ? SIDEBAR_EXPANDED_WIDTH : SIDEBAR_COLLAPSED_WIDTH
	);

	export const getSidebarExpanded = () => sidebarExpanded;
	export const toggleSidebarExpanded = () => (sidebarExpanded.current = !sidebarExpanded.current);

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
		<div class="sidebar-padding"></div>
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

	.sidebar-padding {
		flex: 0 0 auto;

		height: calc(32px + var(--border-width));
		width: 100%;

		margin-top: auto;
		border-top: var(--border);
	}
</style>
