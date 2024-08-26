<script lang="ts">
	import type { IconType } from '$client/icon/icon';
	import Icon from '$components/icon/Icon.svelte';
	import type { Nullable } from '$shared/common_types';

	export let icon_type: IconType;
	export let disabled: Nullable<boolean> = null;
	export let red: Nullable<boolean> = null;
	export let show_hover: boolean = false;
</script>

<button class="option button" class:red {disabled} on:click>
	<div class="icon"><Icon type={icon_type}></Icon></div>
	<div class="text"><slot></slot></div>
	{#if $$slots['on-hover'] && show_hover}
		<div class="on-hover">
			<slot name="on-hover"></slot>
		</div>
	{/if}
</button>

<style>
	.option {
		position: relative;

		flex: 0 0 auto;

		display: flex;
		align-items: center;
		gap: 16px;

		width: 100%;
		height: max-content;

		padding-inline: 6px 10px;
		padding-block: 4px;

		font-weight: bold;
		text-align: right;

		color: var(--text-color);

		cursor: pointer;

		&:hover .on-hover {
			display: block;
		}

		&:disabled {
			color: var(--subtext-color);
			cursor: not-allowed;
		}

		& > div {
			pointer-events: none;
		}
	}

	.icon {
		width: 32px;
		height: 32px;
	}

	.text {
		flex: 1 1 auto;
	}

	.red {
		color: var(--error-600);
	}

	.on-hover {
		display: none;

		position: absolute;
		right: calc(100% + 8px);
		top: 50%;

		transform: translateY(-50%);
	}
</style>
