<script lang="ts">
	import type { ListItem } from '$client/list/list';
	import type { BorrowListMappedItem } from '$client/lists/borrow_list';
	import { format_date } from '$shared/book_util';

	export let list_item: ListItem<BorrowListMappedItem>;
	$: item = list_item[1];

	export let even: boolean;
	export let searched: boolean;
	export let selected: boolean;

	let overdue = false;
	$: overdue = new Date().getTime() >= item.return_date.getTime();

	let overdue_long = false;
	$: {
		const return_date = new Date(item.return_date);
		return_date.setMonth(return_date.getMonth() + 1);
		overdue_long = new Date().getTime() >= return_date.getTime();
	}
</script>

<div class="part center" class:even class:searched class:selected>{item.book_id + 1}</div>
<div class="part center" class:even class:searched class:selected>{item.is_large ? 'V' : 'm'}</div>
<div class="part" class:even class:searched class:selected title={item.book_name}><span>{item.book_name}</span></div>
<div class="part center" class:even class:searched class:selected>{item.reader_name}</div>
<div class="part center" class:even class:searched class:selected>{item.reader_class}</div>
<div class="part center" class:even class:searched class:selected>{format_date(item.borrow_date)}</div>
<div class="part center" class:even class:searched class:selected>{item.times_extended}x</div>
<div class="part center" class:red={overdue} class:purple={overdue_long} class:even class:searched class:selected>
	{format_date(item.return_date)}
</div>

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

	.red {
		background-color: var(--borrowed-color);
		color: white;
	}

	.purple {
		background-color: var(--primary-700);
		color: white;
	}
</style>
