<script>
	import Icon from './icon/Icon.svelte';
</script>

<div class="loading fill-container">
	<div class="loading-spinner center-grid">
		<Icon iconType="loading" width={64}></Icon>
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
</style>
