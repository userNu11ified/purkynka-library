<script lang="ts">
	import { LIST_SORT_BY_UDC, STUDENT_DATABASE, UDC_LIST_OPENED } from '$client/student/student';
	import Editor from '$components/editor/Editor.svelte';
	import EditorAction from '$components/editor/EditorAction.svelte';
	import { string_compare } from '$shared/common_util';

	const on_click_udc = (short_name: string) => {
		$LIST_SORT_BY_UDC = short_name;
		$UDC_LIST_OPENED = false;
	};
</script>

<Editor>
	<svelte:fragment slot="title">Seznam MDT</svelte:fragment>
	<div slot="content">
		<div class="info">
			Ve vyhledávání můžete použít jak číslo, tak název, popřípadě <b>stačí i kliknout na vybraný řádek ve zdejším seznamu</b> a MDT se vyhledá.
		</div>
		<div class="list">
			{#each structuredClone($STUDENT_DATABASE.udc).sort((a, b) => string_compare(a.short_name, b.short_name)) as udc}
				<button class="udc button" on:click={() => on_click_udc(udc.short_name)}>
					<div>{udc.short_name}</div>
					<div>{udc.long_name}</div>
				</button>
			{/each}
		</div>
	</div>
	<svelte:fragment slot="action-bar">
		<EditorAction button_color="var(--success-600)" on_click={() => ($UDC_LIST_OPENED = false)}>Ok</EditorAction>
	</svelte:fragment>
</Editor>

<style>
	.list {
		height: 512px;

		border: var(--border);
		border-radius: var(--border-radius-regular) 0px 0px var(--border-radius-regular);

		overflow: hidden scroll;
	}

	.info {
		margin-bottom: 8px;
	}

	.udc {
		display: grid;
		grid-template-columns: 1fr 1fr;
		gap: var(--border-width);

		width: 100%;
		height: 32px;

		background-color: var(--border-color);

		color: var(--text-color);

		& > div {
			height: 100%;

			display: grid;
			place-items: center;

			background-color: var(--base-surface);
			text-align: center;
		}

		&:is(:hover, :focus-visible) > div {
			background-color: var(--highlighted-surface);
		}

		&:active > div {
			background-color: var(--active-surface);
		}

		&:not(:last-child) {
			border-bottom: var(--border);
		}
	}
</style>
