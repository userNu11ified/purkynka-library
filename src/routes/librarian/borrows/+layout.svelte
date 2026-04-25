<script lang="ts">
	import SidebarLink from '$client/components/view_with_sidebar/SidebarLink.svelte';
	import SidebarSeparator from '$client/components/view_with_sidebar/SidebarSeparator.svelte';
	import ViewWithSidebar from '$client/components/view_with_sidebar/ViewWithSidebar.svelte';
	import type { LayoutProps } from './$types';

	let { children }: LayoutProps = $props();
</script>

<ViewWithSidebar>
	{#snippet sidebar()}
		<SidebarLink href="/librarian/borrows/regular" iconType="book-borrow">Výpůjčky</SidebarLink>
		<SidebarLink href="/librarian/borrows/permanent" iconType="book-lock">Trvalé</SidebarLink>
		<SidebarSeparator />
		<SidebarLink href="/librarian/borrows/history" iconType="history">Historie</SidebarLink>
	{/snippet}
	{#snippet view()}
		{@render children()}
	{/snippet}
</ViewWithSidebar>
