<script lang="ts">
	import Icon from '$components/icon/Icon.svelte';
</script>

<div class="dashboard-text">
	<Icon type="purkynka" size={256} />
	<div class="title">Školní knihovna</div>
	<div class="subtitle">SŠ Purkyňova</div>
	<div class="address">Brno, Purkyňova 97</div>
</div>

<style>
	.dashboard-text {
		display: flex;
		flex-direction: column;
		align-items: center;

		width: max-content;
		height: max-content;
	}

	.title {
		margin-top: 32px;
		font-size: var(--font-size-massive);
		font-weight: bold;

		color: var(--text-color);
	}

	.subtitle {
		font-size: var(--font-size-huge);
	}

	.subtitle,
	.address {
		color: var(--subtext-color);
	}
</style>
