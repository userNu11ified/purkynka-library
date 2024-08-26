<script lang="ts">
	import Icon from '$components/icon/Icon.svelte';

	export let ascending: boolean;
	export let centered: boolean;
</script>

<div class="list-sort-icon" class:centered>
	<Icon type={ascending ? 'arrow-up' : 'arrow-down'} />
</div>

<style>
	.list-sort-icon {
		position: absolute;
		top: 50%;
		right: 4px;

		height: 32px;
		width: 32px;

		transform: translateY(-50%);

		pointer-events: none;
	}

	.centered {
		right: 50%;

		transform: translate(50%, -50%);
	}
</style>
