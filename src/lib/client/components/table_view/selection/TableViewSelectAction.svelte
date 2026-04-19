<script lang="ts">
	import ButtonWithPopup from '$client/components/ButtonWithPopup.svelte';
	import Icon, { type IconType } from '$client/components/icon/Icon.svelte';
	import type { Snippet } from 'svelte';

	let {
		iconType,
		onClick,
		children
	}: { iconType: IconType; onClick: () => void; children: Snippet } = $props();
</script>

<ButtonWithPopup class="table-view-select-action center-grid" popup={children} onclick={onClick}>
	<Icon {iconType} width={20} />
</ButtonWithPopup>

<style>
	:global .table-view-select-action {
		padding: 4px;
		border: var(--border);
		border-radius: 4px;
	}
</style>
