<script>
	import { CURRENT_STEP, TOTAL_STEPS } from '$client/loading_screen/loading_screen';
	import { get_quote } from '$client/loading_screen/quotes';
	import { percent } from '$client/style/css';
	import DashboardText from '$components/dashboard/DashboardText.svelte';
	import Icon from '$components/icon/Icon.svelte';
	import { fade } from 'svelte/transition';

	const quote = get_quote();
</script>

<div class="loading-screen" transition:fade>
	<div class="dashboard-text-container">
		<DashboardText></DashboardText>
		<div class="quote-container">
			<Icon type="quote" size={128}></Icon>
			<q class="quote-text">{quote[0]}</q>
			<div class="quote-author">{quote[1]}</div>
		</div>

		<div class="loading-bar-container">
			<div class="loading-bar">
				<div class="loading-bar-inner" style:--width={percent(($CURRENT_STEP / TOTAL_STEPS) * 100)}></div>
			</div>
			<div class="loading-progress">{$CURRENT_STEP}/{TOTAL_STEPS}</div>
		</div>
	</div>
</div>

<style>
	.loading-screen {
		display: flex;
		flex-direction: column;
		justify-content: center;
		align-items: center;

		position: absolute;
		inset: 0;

		padding-left: var(--sidebar-opened-width);

		background-color: var(--base-surface);

		z-index: 10000;
	}

	.dashboard-text-container {
		position: relative;
	}

	.quote-container {
		display: flex;
		flex-direction: column;
		align-items: center;

		position: absolute;
		top: 50%;
		left: -512px;

		width: 40ch;

		padding: 16px;
		border: var(--border);
		border-radius: var(--border-radius-regular);

		color: var(--subtext-color);

		transform: translateY(-50%);
	}

	.quote-text {
		color: var(--text-color);
		word-break: break-word;
		text-align: center;
	}

	.loading-bar-container {
		position: absolute;
		left: 0;
		bottom: -48px;

		width: 100%;
	}

	.loading-bar {
		width: 100%;
		height: 3px;

		border-radius: 4px;

		background-color: var(--border-color);

		overflow: hidden;
	}

	.loading-bar-inner {
		height: 100%;
		width: var(--width);

		background-color: var(--inverted-border-color);
	}

	.loading-progress {
		margin-top: 8px;

		color: var(--subtext-color);
		text-align: center;
	}
</style>
