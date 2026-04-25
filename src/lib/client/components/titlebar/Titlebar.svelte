<script lang="ts">
	import { resolve } from '$app/paths';
	import Icon from '../icon/Icon.svelte';
	import {
		getSidebarWidth,
		SIDEBAR_EXPANDED_WIDTH,
		toggleSidebarExpanded
	} from '../view_with_sidebar/ViewWithSidebar.svelte';
</script>

<div class="titlebar flex">
	<button
		class="sidebar-toggle center-grid"
		style:--sidebar-width={getSidebarWidth()}
		onclick={toggleSidebarExpanded}
	>
		<Icon iconType="hamburger-menu" width={24} />
	</button>
	<div class="page-name-container center-grid" style:width={SIDEBAR_EXPANDED_WIDTH}>
		<a class="page-name button-like" href={resolve('/librarian')}>Knihovna</a>
	</div>
</div>

<style>
	.titlebar {
		align-items: center;
	}

	.sidebar-toggle {
		width: var(--sidebar-width);
		height: 100%;

		color: var(--text-disabled);
	}

	.page-name-container {
		height: 100%;
	}

	.page-name {
		padding: 2px 6px;
		border-radius: 4px;

		font-size: 13px;
		font-weight: 900;
		text-transform: uppercase;
	}
</style>
