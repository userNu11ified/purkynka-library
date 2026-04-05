<script lang="ts">
	import SidebarLink from '$client/components/view_with_sidebar/SidebarLink.svelte';
	import SidebarSeparator from '$client/components/view_with_sidebar/SidebarSeparator.svelte';
	import ViewWithSidebar from '$client/components/view_with_sidebar/ViewWithSidebar.svelte';
	import type { LayoutProps } from './$types';

	let { children }: LayoutProps = $props();
</script>

<ViewWithSidebar>
	{#snippet sidebar()}
		<SidebarLink href="/librarian/users/students" iconType="student">Students</SidebarLink>
		<SidebarLink href="/librarian/users/teachers" iconType="teacher">Teachers</SidebarLink>
		<SidebarLink href="/librarian/users/librarians" iconType="librarian">Librarians</SidebarLink>

		<SidebarSeparator />
		<SidebarLink href="/librarian/users/add-user" iconType="user-add">Add User</SidebarLink>
	{/snippet}
	{#snippet view()}
		{@render children()}
	{/snippet}
</ViewWithSidebar>
