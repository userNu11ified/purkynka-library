<script lang="ts">
	import '$style/app.css';
	import '$style/theme.css';

	import type { ListItem } from '$client/list/list';
	import type { StudentBookListMappedItem } from '$client/lists/student_book_list';
	import { format_date } from '$shared/book_util';

	export let list_item: ListItem<StudentBookListMappedItem>;
	$: item = list_item[1];

	export let even: boolean;
	export let searched: boolean;
	export let selected: boolean;

	$: borrowed = item?.permanent ? 'Trvale' : item?.return_date ? `Do ${format_date(item.return_date)}` : 'Volné';
</script>

<div
	class="part center red"
	class:even
	class:searched
	class:selected
	class:green={borrowed === 'Volné'}
	class:yellow={borrowed === 'Trvale'}
>
	{borrowed}
</div>
<div class="part center" class:even class:searched class:selected>{item.book_id}</div>
<div class="part center" class:even class:searched class:selected>{item.is_large ? 'V' : 'm'}</div>
<div class="part" class:even class:searched class:selected title={item.book_name}><span>{item.book_name}</span></div>
<div class="part" class:even class:searched class:selected title={item.book_author}>
	<span>{item.book_author}</span>
</div>
<div class="part center" class:even class:searched class:selected title={item.book_udc?.long_name ?? ''}>
	<span>{item.book_udc?.short_name ?? ''}</span>
</div>
<div class="part center" class:even class:searched class:selected title={item.annotation}><span>{item.annotation ?? ""}</span></div>

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

	.red:not(:is(.searched, .selected)) {
		color: var(--borrowed-color);
	}

	.yellow:not(:is(.searched, .selected)) {
		color: var(--permanent-color);
	}

	.green:not(:is(.searched, .selected)) {
		color: var(--available-color);
	}
</style>
