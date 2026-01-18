<script lang="ts">
	import type { ListItem } from '$client/list/list';
	import type { BookInfoListMappedItem } from '$client/lists/book_info_list';

	export let list_item: ListItem<BookInfoListMappedItem>;
	$: item = list_item[1];

	export let even: boolean;
	export let searched: boolean;
	export let selected: boolean;
</script>

<div class="part center" class:even class:searched class:selected>{item.string_id}</div>
<div class="part center" class:even class:searched class:selected>{item.is_large ? 'V' : 'm'}</div>
<div class="part" class:even class:searched class:selected title={item.name ?? ''}><span>{item.name ?? ''}</span></div>
<div class="part center" class:even class:searched class:selected title={item.publisher ?? ''}>
	<span>{item.publisher ?? ''}</span>
</div>
<div class="part center" class:even class:searched class:selected title={item.place_of_publishing ?? ''}>
	<span>{item.place_of_publishing ?? ''}</span>
</div>
<div class="part center" class:even class:searched class:selected title={item.year_of_publishing ?? ''}>
	<span>{item.year_of_publishing ?? ''}</span>
</div>
<div class="part center" class:even class:searched class:selected title={item.edition ?? ''}>
	<span>{item.edition ?? ''}</span>
</div>
<div class="part center" class:even class:searched class:selected title={item.page_count ?? ''}>
	<span>{item.page_count ?? ''}</span>
</div>
<div class="part center" class:even class:searched class:selected title={item.literature_type?.long_name ?? ''}>
	<span>{item.literature_type?.short_name ?? ''}</span>
</div>
<div class="part center" class:even class:searched class:selected title={item.price ?? ''}>
	<span>{item.price ?? ''}</span>
</div>
<div class="part center" class:even class:searched class:selected title={item.giver ?? ''}>
	<span>{item.giver ?? ''}</span>
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
</style>
