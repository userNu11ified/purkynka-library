<script lang="ts">
	import type { ListItem } from '$client/list/list';
	import type { BookListMappedItem } from '$client/lists/book_list';
	import { format_date } from '$shared/book_util';

	export let list_item: ListItem<BookListMappedItem>;
	$: item = list_item[1];

	export let even: boolean;
	export let searched: boolean;
	export let selected: boolean;

	const parse_annotation = (annotation: string) => {
		return annotation.replaceAll(
			/(http(s)?:\/\/)[-a-zA-Z0-9@:%_\+.~#?&//=]{2,256}\.[a-z]{2,4}\b(\/[-a-zA-Z0-9@:%_\+.~#?&//=]*)?/gi,
			`<a href="$&" target="_blank">$&</a>`
		);
	};

	$: annotation = item.annotation ? parse_annotation(item.annotation) : '';
</script>

<div class="part center" class:even class:searched class:selected>{item.string_id}</div>
<div class="part center" class:even class:searched class:selected>{item.is_large ? 'V' : 'm'}</div>
<div class="part" class:even class:searched class:selected title={item.name ?? ''}><span>{item.name ?? ''}</span></div>
<div class="part" class:even class:searched class:selected title={item.author}><span>{item.author}</span></div>
<div class="part" class:even class:searched class:selected title={item.annotation ?? ''}>
	<span>{@html annotation}</span>
</div>
<div class="part center" class:even class:searched class:selected title={item.udc?.long_name ?? ''}>
	<span>{item.udc?.short_name ?? ''}</span>
</div>
<div class="part" class:even class:searched class:selected title={item.note ?? ''}>
	<span>{item.note ?? ''}</span>
</div>
<div class="part center" class:even class:searched class:selected title={item.borrowed_to_name ?? ''}>
	<span>{item.borrowed_to_class ?? ''}</span>
</div>
<div class="part center" class:even class:searched class:selected>
	{item.discard_date ? format_date(item.discard_date) : ''}
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
