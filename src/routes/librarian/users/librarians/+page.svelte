<script lang="ts">
	import { page } from '$app/state';
	import { createPageUsed } from '$client/page_used';
	import { onMount } from 'svelte';

	onMount(() => (createPageUsed('users').current = page.route.id));
</script>
