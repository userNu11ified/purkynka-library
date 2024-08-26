<script lang="ts">
	import type { ListItem } from '$client/list/list';
	import type { DiscardedBookListMappedItem } from '$client/lists/discarded_book_list';
	import { format_date } from '$shared/book_util';

	export let list_item: ListItem<DiscardedBookListMappedItem>;
	$: item = list_item[1];

	export let even: boolean;
	export let searched: boolean;
	export let selected: boolean;
</script>

<div class="part center" class:even class:searched class:selected>{item.string_id}</div>
<div class="part center" class:even class:searched class:selected>{item.is_large ? 'V' : 'm'}</div>
<div class="part" class:even class:searched class:selected title={item.book_name}><span>{item.book_name}</span></div>
<div class="part" class:even class:searched class:selected title={item.book_author}>
	<span>{item.book_author}</span>
</div>
<div class="part center" class:even class:searched class:selected>{format_date(item.discard_date)}</div>
<div class="part center" class:even class:searched class:selected>{item.price ?? ''}</div>
<div class="part center" class:even class:searched class:selected title={item.literature_type?.long_name ?? ''}>
	<span>{item.literature_type?.short_name ?? ''}</span>
</div>
<div class="part center" class:even class:searched class:selected>{item.discard_reason ?? ''}</div>
<div class="part center" class:even class:searched class:selected>{item.discard_document ?? ''}</div>

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
