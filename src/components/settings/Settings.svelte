<script lang="ts">
	import { SETTINGS_OPENED } from '$client/dashboard/dashboard';
	import { delete_request } from '$client/request/request';
	import { pixels } from '$client/style/css';
	import Editor from '$components/editor/Editor.svelte';
	import EditorAction from '$components/editor/EditorAction.svelte';
	import EditorFieldGroup from '$components/editor/fields/EditorFieldGroup.svelte';
	import Vertical from '$components/editor/layouts/Vertical.svelte';

	const on_click_reset_client = () => {
		localStorage.clear();
		location.reload();
	};

	const on_click_reset_password = async () => {
		const res = await delete_request(`${window.origin}/api/v1/password`);

		if (res.ok) {
			localStorage.removeItem('password');
			location.reload();
		}
	};
</script>

<Editor editor_width={pixels(512)}>
	<svelte:fragment slot="title">Nastavení</svelte:fragment>
	<Vertical slot="content">
		<EditorFieldGroup>
			<svelte:fragment slot="name">Resetovat data v klientu</svelte:fragment>
			<button class="reset-button error-button" slot="fields" on:click={on_click_reset_client}>Resetovat</button>
		</EditorFieldGroup>
		<EditorFieldGroup>
			<svelte:fragment slot="name">Resetovat heslo</svelte:fragment>
			<button class="reset-button error-button" slot="fields" on:click={on_click_reset_password}>Resetovat</button>
		</EditorFieldGroup>
	</Vertical>
	<svelte:fragment slot="action-bar">
		<EditorAction button_color="var(--success-600)" on_click={() => ($SETTINGS_OPENED = false)}>Ok</EditorAction>
	</svelte:fragment>
</Editor>

<style>
	.reset-button {
		height: 100%;
		width: 128px;

		margin-left: auto;
		border: var(--border);
		border-color: var(--error-active-surface);
		border-radius: var(--border-radius-regular);
	}
</style>
