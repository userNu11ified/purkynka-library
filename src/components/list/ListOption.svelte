<script lang="ts">
	import type { IconType } from '$client/icon/icon';
	import Icon from '$components/icon/Icon.svelte';
	import type { Nullable } from '$shared/common_types';

	export let icon_type: IconType;
	export let disabled: Nullable<boolean> = null;
	export let red: Nullable<boolean> = null;
</script>

<button class="option button" class:red {disabled} on:click>
	<div class="icon"><Icon type={icon_type}></Icon></div>
	<div class="text"><slot></slot></div>
</button>

<style>
	.option {
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
</style>
