<script lang="ts">
	import { STUDENT_DATABASE, UDC_LIST_OPENED } from '$client/student/student';
	import Editor from '$components/editor/Editor.svelte';
	import EditorAction from '$components/editor/EditorAction.svelte';
	import { string_compare } from '$shared/common_util';
</script>

<Editor>
	<svelte:fragment slot="title">Seznam MDT</svelte:fragment>
	<div slot="content">
		<div class="info">Ve vyhledávání jde použít zkratka i celý název!</div>
		<div class="list">
			{#each $STUDENT_DATABASE.udc.sort((a, b) => string_compare(a.long_name, b.long_name)) as udc}
				<div class="udc">
					<div>{udc.short_name}</div>
					<div>{udc.long_name}</div>
				</div>
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
		font-weight: bold;
	}

	.udc {
		display: grid;
		grid-template-columns: 1fr 1fr;
		gap: var(--border-width);

		height: 32px;

		background-color: var(--border-color);

		& > div {
			display: grid;
			place-items: center;

			background-color: var(--base-surface);
			text-align: center;
		}

		&:not(:last-child) {
			border-bottom: var(--border);
		}
	}
</style>
