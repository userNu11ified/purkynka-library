<script lang="ts">
	import { fade } from 'svelte/transition';
	import Icon from '../icon/Icon.svelte';
	import Quote from './Quote.svelte';
	import { sineInOut } from 'svelte/easing';
</script>

<div class="loading fill-container" transition:fade={{ duration: 250, easing: sineInOut }}>
	<div class="loading-spinner center-grid">
		<Icon iconType="loading" width={64}></Icon>
	</div>
	<div class="quote-container">
		<Quote></Quote>
	</div>
</div>

<style>
	.loading {
		position: absolute;
		top: 0;
		left: 0;

		border-radius: 8px;

		background-color: rgba(0, 0, 0, 0.5);

		z-index: 1000;
	}

	@keyframes rotate {
		from {
			transform: translate(-50%, -50%) rotate(0deg);
		}
		to {
			transform: translate(-50%, -50%) rotate(360deg);
		}
	}

	.loading-spinner {
		position: absolute;
		top: 50%;
		left: 50%;

		background-color: transparent;

		animation: rotate 2s linear infinite;
	}

	.quote-container {
		position: absolute;
		top: calc(50% + 192px);
		left: 50%;
		transform: translate(-50%, -50%);

		background-color: transparent;
	}
</style>
