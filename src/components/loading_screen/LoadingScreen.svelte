<script lang="ts">
	import { get_quote } from '$client/loading_screen/quotes';
	import { percent } from '$client/style/css';
	import DashboardText from '$components/dashboard/DashboardText.svelte';
	import Icon from '$components/icon/Icon.svelte';
	import type { Nullable } from '$shared/common_types';
	import { fade } from 'svelte/transition';

	const quote = get_quote();

	export let current_step: number;
	export let total_steps: number;

	export let is_student: Nullable<boolean> = null;

	export let book_count: Nullable<number> = null;
	export let borrow_count: Nullable<number> = null;
</script>

<div class="loading-screen" transition:fade>
	<div class="dashboard-text-container">
		<DashboardText {is_student} is_local={window.origin.includes('localhost')} />
		<div class="side-container">
			<div class="quote-container">
				<Icon type="quote" size={128}></Icon>
				<q class="quote-text">{quote[0]}</q>
				<div class="quote-author">{quote[1]}</div>
			</div>
			{#if book_count && borrow_count}
				<div class="statistic-container">
					<div class="statistic">
						<div class="statistic-title">Počet knížek</div>
						<div class="statistic-number">{book_count}</div>
					</div>
					<div class="statistic">
						<div class="statistic-title">Právě půjčeno</div>
						<div class="statistic-number">{borrow_count}</div>
					</div>
				</div>
			{/if}
		</div>

		<div class="loading-bar-container">
			<div class="loading-bar">
				<div class="loading-bar-inner" style:--width={percent((current_step / total_steps) * 100)}></div>
			</div>
			<div class="loading-progress">{current_step}/{total_steps}</div>
		</div>

		{#if is_student}
			<div class="student-icon"></div>
		{/if}
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

	.side-container {
		display: flex;
		flex-direction: column;
		gap: 16px;

		position: absolute;
		top: 50%;
		left: -512px;

		transform: translateY(-50%);
	}

	.quote-container {
		display: flex;
		flex-direction: column;
		align-items: center;

		width: 40ch;

		padding: 16px;
		border: var(--border);
		border-radius: var(--border-radius-regular);

		color: var(--subtext-color);
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

	.statistic-container {
		display: flex;
		gap: 16px;
	}

	.statistic {
		flex: 1 1 auto;

		display: flex;
		flex-direction: column;
		align-items: center;

		padding: 16px;
		border: var(--border);
		border-radius: var(--border-radius-regular);

		color: var(--subtext-color);
	}

	.statistic-title {
		color: var(--text-color);
		font-weight: bold;
		font-size: 20px;
	}

	.statistic-number {
		font-size: 24px;
	}
</style>
