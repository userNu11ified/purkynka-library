<script lang="ts">
	import { goto } from '$app/navigation';
	import SchoolInfo from '$client/components/SchoolInfo.svelte';
	import { createPageUsed } from '$client/page_used';
	import { onMount } from 'svelte';

	onMount(() => {
		const pageUsed = createPageUsed('books', '/librarian/books/view');
		if (pageUsed.current !== null) goto(pageUsed.current);
	});
</script>

<SchoolInfo></SchoolInfo>
