<script lang="ts">
	import type { ListItem } from '$client/list/list';
	import type { ReaderListMappedItem } from '$client/lists/reader_list';
	import { format_date } from '$shared/book_util';

	export let list_item: ListItem<ReaderListMappedItem>;
	$: item = list_item[1];

	export let even: boolean;
	export let searched: boolean;
	export let selected: boolean;
</script>

<div class="part center" class:even class:searched class:selected>{item.id}</div>
<div class="part center" class:even class:searched class:selected>{item.name}</div>
<div class="part center" class:even class:searched class:selected>{item.class_name}</div>
<div class="part center" class:even class:searched class:selected>{format_date(item.added_date)}</div>
<div class="part center" class:even class:searched class:selected>{format_date(item.last_modifed_date)}</div>

<style>
	.part {
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
