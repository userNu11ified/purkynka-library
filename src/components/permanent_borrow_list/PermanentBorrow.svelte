<script lang="ts">
	import type { ListItem } from '$client/list/list';
	import type { PermanentBorrowListMappedItem } from '$client/lists/permanent_borrow_list';
	import { format_date } from '$shared/book_util';

	export let list_item: ListItem<PermanentBorrowListMappedItem>;
	$: item = list_item[1];

	export let even: boolean;
	export let searched: boolean;
	export let selected: boolean;
</script>

<div class="part center" class:even class:searched class:selected>{item.book_id + 1}</div>
<div class="part center" class:even class:searched class:selected>{item.is_large ? 'V' : 'm'}</div>
<div class="part" class:even class:searched class:selected title={item.book_name}><span>{item.book_name}</span></div>
<div class="part center" class:even class:searched class:selected>{item.price ?? ''}</div>
<div class="part center" class:even class:searched class:selected>{item.reader_name}</div>
<div class="part center" class:even class:searched class:selected>{format_date(item.borrow_date)}</div>

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

		& > span {
			cursor: help;
		}
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
