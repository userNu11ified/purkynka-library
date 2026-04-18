<script lang="ts">
	import Icon from '../icon/Icon.svelte';
	import { TableViewFilterManager } from './logic/table_view_filter_manager.svelte';

	const tableViewFilterManager = TableViewFilterManager.context.get();

	const onCaseSensitiveClick = () => {
		tableViewFilterManager.caseSensitive = !tableViewFilterManager.caseSensitive;
	};
</script>

<div class="table-view-status-bar">
	<button
		class="table-view-case-sensitive center-flex"
		class:active={tableViewFilterManager.caseSensitive}
		onclick={onCaseSensitiveClick}
	>
		<Icon iconType="case-sensitive" width={20} />
		Case Sensitive
	</button>
</div>

<style>
	.active {
		color: var(--information-color);
	}

	.table-view-case-sensitive {
		gap: 4px;

		height: 100%;

		margin-left: auto;
		padding-inline: 8px;
	}
</style>
