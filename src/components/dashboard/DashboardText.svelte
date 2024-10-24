<script lang="ts">
	import Icon from '$components/icon/Icon.svelte';
	import type { Nullable } from '$shared/common_types';

	export let is_student: Nullable<boolean> = null;
</script>

<div class="dashboard-text">
	{#if is_student}
		<div class="student-icon">
			<Icon type="student" size={128} />
		</div>
	{/if}
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

	.student-icon {
		margin-bottom: 32px;
		color: var(--text-color);
	}
</style>
