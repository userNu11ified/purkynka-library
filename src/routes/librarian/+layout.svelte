<script lang="ts">
	import Titlebar from '$client/components/titlebar/Titlebar.svelte';
	import SidebarLink from '$client/components/view_with_sidebar/SidebarLink.svelte';
	import SidebarSeparator from '$client/components/view_with_sidebar/SidebarSeparator.svelte';
	import ViewWithSidebar from '$client/components/view_with_sidebar/ViewWithSidebar.svelte';
	import type { LayoutProps } from './$types';

	let { children }: LayoutProps = $props();
</script>

<div class="librarian fill-container inverse-grid">
	<Titlebar />
	<div class="content">
		<ViewWithSidebar>
			{#snippet sidebar()}
				<SidebarLink href="/librarian/books" iconType="book">Books</SidebarLink>
				<SidebarLink href="/librarian/borrows" iconType="book-borrow">Borrows</SidebarLink>
				<SidebarLink href="/librarian/users" iconType="user">Users</SidebarLink>
				<SidebarLink href="/librarian/other" iconType="list">Other</SidebarLink>
				<SidebarSeparator />
				<SidebarLink href="/librarian/settings" iconType="settings">Settings</SidebarLink>
			{/snippet}

			{#snippet view()}
				{@render children()}
			{/snippet}
		</ViewWithSidebar>
	</div>
</div>

<style>
	.librarian {
		grid-template-rows: 32px auto;
	}
</style>
