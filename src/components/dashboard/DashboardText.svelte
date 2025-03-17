<script lang="ts">
	import Icon from '$components/icon/Icon.svelte';
	import type { Nullable } from '$shared/common_types';

	export let is_student: Nullable<boolean> = null;
	export let is_local: Nullable<boolean> = null;
</script>

<div class="dashboard-text">
	<div class="icons">
		{#if is_student}
			<div class="student-icon">
				<Icon type="student" size={128} />
			</div>
		{/if}
		{#if is_local}
			<div class="local-icon">
				<Icon type="local" size={128} />
			</div>
		{/if}
	</div>
	<Icon type="purkynka" size={256} />
	<div class="title">Školní knihovna</div>
	<div class="subtitle">Střední průmyslová škola Brno,</div>
	<div class="address">Purkyňova, příspěvková organizace</div>
</div>

<style>
	.dashboard-text {
		display: flex;
		flex-direction: column;
		align-items: center;

		width: max-content;
		height: max-content;
	}

	.title {
		margin-top: 32px;
		font-size: var(--font-size-massive);
		font-weight: bold;

		color: var(--text-color);
	}

	.subtitle {
		font-size: var(--font-size-huge);
	}

	.subtitle,
	.address {
		color: var(--subtext-color);
	}

	.icons {
		display: flex;
		gap: 32px;

		margin-bottom: 32px;
		color: var(--subtext-color);
	}

	.icons > div {
		display: flex;
		flex-direction: column;
		align-items: center;
		justify-content: center;
	}
</style>
