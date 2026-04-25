<script>
	import Icon from './icon/Icon.svelte';
</script>

<div class="school-info-container fill-container center-grid">
	<div class="school-info flex-column center-flex">
		<Icon iconType="purkynka" width={384}></Icon>
		<h1>Školní knihovna</h1>
		<h2>Střední průmyslová škola Brno,</h2>
		<h3>Purkyňova, příspěvková organizace</h3>
	</div>
</div>

<style>
	h1 {
		margin-top: 64px;
		font-size: 48px;
	}

	h2 {
		color: var(--text-muted);
		font-size: 32px;
		font-weight: 500;
	}

	h3 {
		color: var(--text-disabled);
		font-size: 20px;
		font-weight: normal;
	}
</style>
