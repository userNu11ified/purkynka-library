<script lang="ts">
	import { goto } from '$app/navigation';
	import Editor from '$client/components/editor/Editor.svelte';
	import EditorAction from '$client/components/editor/EditorAction.svelte';
	import { EditorFieldStringState } from '$client/components/editor/inputs/state/editor_field_string_state.svelte';
	import EditorSingleColumnLayout from '$client/components/editor/layout/EditorSingleColumnLayout.svelte';
	import EditorStringInputLine from '$client/components/editor/premade_lines/EditorStringInputLine.svelte';

	import { makeRequest } from '$shared/types/database/api';
	import type { LoginBody } from '$shared/types/login';

	let loggingIn = $state(false);
	let unsuccessful = $state(false);

	const editorState = $state({
		email: new EditorFieldStringState('Email', { required: true }),
		password: new EditorFieldStringState('Password', {
			inputOptions: { inputType: 'password' },
			required: true
		})
	});
	const hasErrors = $derived(
		Object.values(editorState).some((v) => v.parsed.parseErrors.length !== 0)
	);

	const onLoginClick = async () => {
		unsuccessful = false;
		loggingIn = true;

		const loginOk = await makeRequest('POST', 'login', {
			email: editorState.email.getParsedValue()!,
			password: editorState.password.getParsedValue()!
		} satisfies LoginBody).then((r) => r.ok);

		if (loginOk) return await goto('/librarian');

		loggingIn = false;
		unsuccessful = true;
	};
</script>

<div class="login fill-container center-grid">
	<Editor showLoading={loggingIn}>
		{#snippet title()}
			Login
		{/snippet}

		{#snippet fields()}
			<EditorSingleColumnLayout>
				<EditorStringInputLine state={editorState.email}></EditorStringInputLine>
				<EditorStringInputLine state={editorState.password}></EditorStringInputLine>
			</EditorSingleColumnLayout>
		{/snippet}

		{#snippet actions()}
			<EditorAction actionColor="success" disabled={hasErrors} onClick={onLoginClick}
				>Login</EditorAction
			>
		{/snippet}
	</Editor>

	{#if unsuccessful}
		<div class="login-unsuccessful">Failed to login! Try again.</div>
	{/if}
</div>

<style>
	.login-unsuccessful {
		position: absolute;
		bottom: 8px;
		left: 50%;
		transform: translateX(-50%);

		padding: 16px 32px;
		border: var(--border);
		border-color: var(--error-color);
		border-radius: 4px;

		color: var(--error-color);
		font-weight: bold;
	}
</style>
