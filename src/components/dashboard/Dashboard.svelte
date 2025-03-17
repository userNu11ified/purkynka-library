<script>
	import { SETTINGS_OPENED } from '$client/dashboard/dashboard';
	import { DARK_THEME } from '$client/style/theme';
	import Icon from '$components/icon/Icon.svelte';
	import Settings from '$components/settings/Settings.svelte';
	import Credits from './Credits.svelte';
	import DashboardText from './DashboardText.svelte';

	const on_click_settings = () => ($SETTINGS_OPENED = true);
</script>

<div class="dashboard">
	{#if $SETTINGS_OPENED}
		<Settings></Settings>
	{/if}

	<button class="theme-switcher action-button button" on:click={() => ($DARK_THEME = !$DARK_THEME)}>
		{#if $DARK_THEME}
			<Icon type="dark-theme" size={32}></Icon>
		{:else}
			<Icon type="light-theme" size={32}></Icon>
		{/if}
	</button>
	<button class="settings action-button button" on:click={on_click_settings}>
		<Icon type="settings"></Icon>
	</button>
	<DashboardText is_local={window.origin.includes('localhost')} />
	<Credits></Credits>
</div>

<style>
	.dashboard {
		display: grid;
		place-items: center;

		width: 100%;
		height: 100%;
	}

	.action-button {
		display: grid;
		place-items: center;

		width: 48px;
		height: 48px;

		border: var(--border);
		border-radius: var(--border-radius-regular);

		color: var(--text-color);
	}

	.theme-switcher {
		position: absolute;
		right: 16px;
		top: 16px;
	}

	.settings {
		position: absolute;
		left: 16px;
		bottom: 16px;
	}
</style>
