<script lang="ts" generics="T">
	import ButtonWithPopup from '$client/components/ButtonWithPopup.svelte';
	import Icon from '$client/components/icon/Icon.svelte';
	import InfiniteList from '$client/components/infinite_list/InfiniteList.svelte';
	import type { FocusEventHandler } from 'svelte/elements';
	import EditorInput from './EditorInput.svelte';
	import {
		getEditorSearchableFieldCaseSensitive,
		setEditorSearchableFieldCaseSensitive,
		type EditorFieldSearchableState,
		type EditorFieldSearchableStateListItem
	} from './state/editor_field_searchable_state.svelte';
	import { CSSVariables } from '$client/css_utilities';

	let { state: inputState }: { state: EditorFieldSearchableState<T> } = $props();
	let editorSearchableInputContainer: HTMLDivElement | undefined = $state();

	const onContainerFocusOut: FocusEventHandler<HTMLDivElement> = (e) => {
		if (
			e.relatedTarget !== null &&
			editorSearchableInputContainer?.contains(e.relatedTarget as Node)
		)
			return;

		if (inputState.matchedItem === null) return;

		inputState.value = `${inputState.matchedItem.text}`;
		inputState.settings?.inputOptions?.onFocusOut?.();
	};

	const listSettings = $derived(inputState.settings!.list);
	const itemHeight = $derived(listSettings.itemHeight ?? 48);

	const onCaseSensitiveClick = () =>
		setEditorSearchableFieldCaseSensitive(!getEditorSearchableFieldCaseSensitive());

	const onItemClick = (e: MouseEvent, v: EditorFieldSearchableStateListItem<T>) => {
		(e.currentTarget as HTMLElement).blur();
		inputState.value = `${v.text}`;
	};

	const onSpecialAdderClick = (e: MouseEvent) => {
		(e.currentTarget as HTMLElement).blur();
		inputState.settings!.list.onSpecialAdderClick!();
	};
</script>

<div
	class="editor-searchable-input-container"
	onfocusout={onContainerFocusOut}
	bind:this={editorSearchableInputContainer}
>
	<EditorInput state={inputState} />
	<ButtonWithPopup
		class={`editor-searchable-input-case-sensitive center-grid ${getEditorSearchableFieldCaseSensitive() ? 'active' : ''}`}
		onclick={onCaseSensitiveClick}
	>
		{#snippet popup()}
			Rozlišovt vel. a mal. písmena
		{/snippet}
		<Icon iconType="case-sensitive" width={20} />
	</ButtonWithPopup>
	{#if inputState.settings!.list.onSpecialAdderClick !== undefined}
		<ButtonWithPopup
			class="editor-searchable-field-special-adder center-grid"
			onclick={onSpecialAdderClick}
		>
			{#snippet popup()}
				Přidat
			{/snippet}

			<Icon iconType="add" width={24} />
		</ButtonWithPopup>
	{/if}
	{#if inputState.filteredListItems.length !== 0}
		<div
			class="editor-searchable-input-list"
			style:--height={`${Math.min(inputState.filteredListItems.length * itemHeight, itemHeight * 3) + CSSVariables.BORDER_WIDTH * 2}px`}
		>
			<InfiniteList items={inputState.filteredListItems} {itemHeight}>
				{#snippet listRow(v)}
					<button
						class="editor-searchable-input-list-item flex-column fill-container"
						class:matched={v.index === inputState.matchedItem?.index}
						title={`${v.text}`}
						onclick={(e) => onItemClick(e, v)}
					>
						<div class="editor-searchable-input-item-number">{v.identifier}</div>
						<div class="editor-searchable-input-item-text-container">
							<div class="editor-searchable-input-item-text">
								{v.text}
							</div>
						</div>
					</button>
				{/snippet}
			</InfiniteList>
		</div>
	{/if}
</div>

<style>
	.editor-searchable-input-container {
		position: relative;
	}

	:global .editor-searchable-input-container:focus-within input {
		outline: var(--focus-outline);
	}

	.editor-searchable-input-container:focus-within .editor-searchable-input-list {
		display: block;
	}

	:global .editor-searchable-input-case-sensitive {
		position: absolute;
		top: 50%;
		right: 8px;
		transform: translateY(-50%);

		height: 32px;
		aspect-ratio: 1;

		border-radius: 4px;
	}

	:global .editor-searchable-input-case-sensitive.active {
		color: var(--information-color);
	}

	:global .editor-searchable-field-special-adder {
		position: absolute;
		top: 50%;
		right: calc(100% + 8px);
		transform: translateY(-50%);

		height: 32px;
		aspect-ratio: 1;

		border: var(--border);
		border-radius: 4px;
	}

	.editor-searchable-input-list {
		display: none;

		position: absolute;
		top: calc(100% + 8px);
		left: 0;

		width: 100%;
		height: var(--height);

		border: var(--border);
		border-radius: 4px;

		overflow: hidden;

		z-index: 10;

		filter: drop-shadow(0px 0px 8px var(--drop-shadow-color));
	}

	.editor-searchable-input-list-item {
		align-items: start;
		justify-content: center;

		padding-inline: 8px;

		font-size: 16px;
		text-align: left;

		overflow: hidden;
	}

	.editor-searchable-input-list-item.matched .editor-searchable-input-item-text {
		color: var(--information-color);
	}

	.editor-searchable-input-item-number,
	.editor-searchable-input-item-text-container,
	.editor-searchable-input-item-text {
		background-color: transparent;
		pointer-events: none;
	}

	.editor-searchable-input-item-number {
		color: var(--text-disabled);
		font-size: 12px;
	}

	.editor-searchable-input-item-text-container {
		width: 100%;
		overflow: hidden;
	}

	.editor-searchable-input-item-text {
		width: 100%;

		overflow: hidden;
		text-overflow: ellipsis;
		white-space: nowrap;
	}
</style>
