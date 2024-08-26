<script>
	import Vertical from './Vertical.svelte';
</script>

<div class="double-column">
	<Vertical><slot name="left"></slot></Vertical>
	<Vertical><slot name="right"></slot></Vertical>
</div>

<style>
	.double-column {
		display: grid;
		grid-template-columns: 1fr 1fr;
		gap: 32px;
	}
</style>
