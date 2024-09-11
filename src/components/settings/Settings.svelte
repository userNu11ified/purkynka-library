<script lang="ts">
	import { SETTINGS_OPENED } from '$client/dashboard/dashboard';
	import { delete_request, get_request, post_request } from '$client/request/request';
	import { pixels } from '$client/style/css';
	import Editor from '$components/editor/Editor.svelte';
	import EditorAction from '$components/editor/EditorAction.svelte';
	import EditorFieldGroup from '$components/editor/fields/EditorFieldGroup.svelte';
	import Horizontal from '$components/editor/layouts/Horizontal.svelte';
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

	let import_input: HTMLInputElement;
	const on_change_import = async () => {
		if (import_input.files) {
			const file = import_input.files[0];
			const res = await post_request(`${window.origin}/api/v1/database-file`, file, false);

			if (res.ok) {
				location.reload();
			} else {
				console.log(await res.text());
			}
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
		<EditorFieldGroup>
			<svelte:fragment slot="name">Manipulace databáze</svelte:fragment>
			<Horizontal slot="fields">
				<label class="button import-button" for="import">
					<input
						class="import-input"
						id="import"
						type="file"
						accept=".json"
						bind:this={import_input}
						on:change={on_change_import}
					/>
					Import
				</label>
				<a class="button export-button" href={`${window.origin}/api/v1/database-file`} target="_blank">Exportovat</a>
			</Horizontal>
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

	.import-button,
	.export-button {
		height: 100%;
		width: 128px;

		border: var(--border);
		border-radius: var(--border-radius-regular);

		color: var(--text-color);
	}

	.import-button {
		display: grid;
		place-items: center;

		border-color: var(--success-600);
		cursor: pointer;

		&:not(:disabled):is(:hover, :focus-visible) {
			background-color: var(--highlighted-surface);
		}

		&:not(:disabled):active {
			background-color: var(--active-surface);
		}
	}

	.import-input {
		display: none;

		pointer-events: none;
	}

	.export-button {
		display: grid;
		place-items: center;

		border-color: var(--tertiary-600);

		text-decoration: none;
	}
</style>
