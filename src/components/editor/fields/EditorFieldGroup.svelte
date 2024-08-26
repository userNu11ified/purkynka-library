<script lang="ts">
	import Vertical from '../layouts/Vertical.svelte';
</script>

<div class="field-group">
	<div class="name"><slot name="name"></slot></div>
	<div class="fields">
		<Vertical><slot name="fields"></slot></Vertical>
	</div>
</div>

<style>
	.field-group {
		display: grid;
		grid-template-columns: 1fr 1fr;

		width: 100%;
		min-height: var(--field-height);
		height: max-content;
	}

	.name {
		padding-top: 10px;

		line-height: 1;
		font-size: var(--font-size-large);
		color: var(--text-color);
	}
</style>
