<script lang="ts">
	import type { ListItem } from '$client/list/list';
	import type { Shorthand } from '$shared/book_types';
	import { format_date } from '$shared/book_util';

	export let list_item: ListItem<Shorthand>;
	$: item = list_item[1];

	export let even: boolean;
	export let searched: boolean;
	export let selected: boolean;
</script>

<div class="part center" class:even class:searched class:selected>{item.short_name}</div>
<div class="part center" class:even class:searched class:selected>{item.long_name}</div>

<style>
	.part {
		height: 32px;

		line-height: 1;
		padding: 8px;

		background-color: var(--base-surface);

		color: var(--text-color);

		text-overflow: ellipsis;
		white-space: nowrap;
		overflow: hidden;

		pointer-events: none;
	}

	.center {
		text-align: center;
	}

	.even {
		background-color: var(--shifted-base-surface);
	}

	.searched {
		background-color: var(--searched-base-surface);
		color: black;
	}

	.selected {
		background-color: var(--selected-base-surface);
		color: black;
	}
</style>
