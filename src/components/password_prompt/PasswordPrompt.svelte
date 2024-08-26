<script lang="ts">
	import {
		create_editor_context,
		create_editor_error_context,
		type EditorContext,
		type EditorErrorContext
	} from '$client/editor/editor';
	import { PASSWORD_CHECKER, REQUIRED_CHECKER } from '$client/editor/error_checkers';
	import { PASSWORD } from '$client/password/password';
	import { post_request } from '$client/request/request';
	import { pixels } from '$client/style/css';
	import DashboardText from '$components/dashboard/DashboardText.svelte';
	import EditorTextField from '$components/editor/fields/EditorTextField.svelte';
	import Icon from '$components/icon/Icon.svelte';

	let password_visible = false;
	const on_click_password_viewer = () => (password_visible = !password_visible);

	const editor_context = create_editor_context<EditorContext>({});
	const editor_error_context = create_editor_error_context<EditorErrorContext>({});
	$: has_errors = Object.values($editor_error_context).findIndex((v) => v.size !== 0) !== -1;

	let error_text = '';

	const on_click_login = async () => {
		if (has_errors) return;

		const password = $editor_context['password'];

		const res = await post_request(`${window.origin}/api/v1/password`, password);

		if (res.status === 401) {
			error_text = 'Špatné heslo!';
		} else {
			const key = await res.text();
			$PASSWORD = key;
		}
	};
</script>

<div class="password-prompt">
	<DashboardText></DashboardText>
	<div class="separator"></div>
	<div class="password">
		<EditorTextField
			context_field="password"
			value={null}
			width={pixels(256)}
			error_checkers={[REQUIRED_CHECKER, PASSWORD_CHECKER]}
			placeholder="Heslo..."
			input_type={password_visible ? 'text' : 'password'}
		></EditorTextField>
		{#if $editor_context['password'] !== null}
			<button class="password-viewer" on:click={on_click_password_viewer}>
				{#if password_visible}
					<Icon type="password-hider" size={24}></Icon>
				{:else}
					<Icon type="password-viewer" size={24}></Icon>
				{/if}
			</button>
		{/if}
	</div>
	<div class="error-text">{error_text}</div>
	<button class="button login" disabled={has_errors} on:click={on_click_login}>Přihlásit se</button>
</div>

<style>
	.password-prompt {
		--field-height: 40px;

		display: flex;
		flex-direction: column;
		align-items: center;
		justify-content: center;

		position: absolute;
		left: 50%;
		top: 50%;

		transform: translate(-50%, -50%);

		height: max-content;
		width: max-content;

		padding: 32px;
		border: var(--border);
		border-radius: var(--border-radius-regular);
	}

	.password {
		position: relative;
	}

	.password-viewer {
		display: grid;
		place-items: center;

		height: 32px;
		width: 32px;

		position: absolute;
		top: 50%;
		right: 8px;
		transform: translateY(-50%);

		color: var(--text-color);
	}

	.separator {
		width: 25%;
		height: 3px;

		margin-block: 32px;
		border-radius: var(--border-radius-regular);

		background-color: var(--border-color);
	}

	.error-text {
		height: 1em;
		margin-top: 8px;
		color: var(--error-600);
	}

	.login {
		margin-top: 32px;
		padding: 8px 16px;
		border: var(--border);
		border-radius: var(--border-radius-regular);

		color: var(--text-color);

		&:disabled {
			color: var(--subtext-color);
			cursor: not-allowed;
		}
	}
</style>
