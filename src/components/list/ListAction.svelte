<script lang="ts">
	import type { IconType } from '$client/icon/icon';
	import { pixels } from '$client/style/css';
	import Icon from '$components/icon/Icon.svelte';

	export let icon_type: IconType;
	export let icon_size = 32;
</script>

<button class="action button" class:padding={$$slots['default']} style:--icon-size={pixels(icon_size)} on:click>
	<div class="icon"><Icon type={icon_type} size={icon_size}></Icon></div>
	{#if $$slots['default']}
		<div class="text"><slot></slot></div>
	{/if}
</button>

<style>
	.action {
		display: flex;
		align-items: center;
		gap: 16px;

		min-width: 36px;
		min-height: 36px;

		border: var(--border);
		border-radius: var(--border-radius-regular);

		font-weight: bold;
		color: var(--text-color);

		&:not(.padding) {
			display: grid;
			place-items: center;
		}

		&.padding {
			padding-inline: 4px 10px;
		}

		& > div {
			pointer-events: none;
		}
	}

	.icon {
		width: var(--icon-size);
		height: var(--icon-size);
	}
</style>
