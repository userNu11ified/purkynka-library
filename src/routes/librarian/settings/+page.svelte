<script lang="ts">
	import { page } from '$app/state';
	import { clientLogger } from '$client/client_loggers';
	import ButtonWithPopup from '$client/components/ButtonWithPopup.svelte';
	import Editor from '$client/components/editor/Editor.svelte';
	import Icon from '$client/components/icon/Icon.svelte';
	import InfiniteList from '$client/components/infinite_list/InfiniteList.svelte';
	import Loading from '$client/components/loading/Loading.svelte';
	import { type BackupBody, type BackupError, type BackupInformation } from '$shared/types/backup';
	import { makeAPIJsonRequest, makeAPIRequest } from '$shared/types/database/api';
	import { Result } from '$shared/types/result';
	import { onMount } from 'svelte';

	let loading = $state(false);
	let backups: BackupInformation[] = $state([]);
	const sortedBackups = $derived(
		backups.toSorted((a, b) => b.backupName.localeCompare(a.backupName))
	);

	const onApplyBackupClick = async (backupName: string) => {
		loading = true;

		await makeAPIRequest('POST', 'backup', {
			type: 'apply',
			backupName
		} satisfies BackupBody);

		window.location.reload();
	};

	const onDeleteBackupClick = async (backupName: string) => {
		loading = true;

		await makeAPIRequest('POST', 'backup', {
			type: 'delete',
			backupName
		} satisfies BackupBody);

		backups.splice(
			backups.findIndex((v) => v.backupName === backupName),
			1
		);

		loading = false;
	};

	const onCreateBackupClick = async () => {
		loading = true;

		const createBackupResult = await makeAPIJsonRequest<Result<BackupInformation, BackupError>>(
			'POST',
			'backup',
			{
				type: 'create'
			} satisfies BackupBody
		);

		if (Result.isFlatError(createBackupResult)) {
			clientLogger.fatal('Failed to create backup!', { ...createBackupResult });
			throw new Error();
		}

		const { backupName, backupDate } = createBackupResult;

		backups.push({ backupName, backupDate });

		loading = false;

		await onDownloadBackupClick(`${backupName}.tar.gz`);
	};

	const onDownloadBackupClick = async (backupName: string) => {
		const response = await makeAPIRequest('POST', 'backup', {
			type: 'download',
			backupName
		} satisfies BackupBody);

		let blob = await response.blob();
		var url = window.URL || window.webkitURL;
		let link = url.createObjectURL(blob);

		let a = document.createElement('a');
		a.setAttribute('download', backupName);
		a.setAttribute('href', link);
		document.body.appendChild(a);

		a.click();
		document.body.removeChild(a);
	};

	onMount(() => {
		backups = page.data.backups as BackupInformation[];
	});
</script>

<div class="settings-container">
	<div class="settings">
		<div class="backups flex-column center-flex">
			<h1>Backups</h1>
			<div class="backup-list">
				<InfiniteList items={sortedBackups} itemHeight={48}>
					{#snippet listRow(v)}
						<div class="backup fill-container">
							<div class="backup-name">{v.backupName}</div>
							<div class="backup-date">{v.backupDate}</div>
							<div class="backup-buttons center-flex">
								<ButtonWithPopup
									class="backup-button download center-grid"
									onclick={() => onDownloadBackupClick(v.backupName)}
								>
									{#snippet popup()}
										Download
									{/snippet}

									<Icon iconType="download" width={20}></Icon>
								</ButtonWithPopup>

								<ButtonWithPopup
									class="backup-button apply center-grid"
									onclick={() => onApplyBackupClick(v.backupName)}
								>
									{#snippet popup()}
										Apply
									{/snippet}

									<Icon iconType="upload" width={20}></Icon>
								</ButtonWithPopup>

								<ButtonWithPopup
									class="backup-button delete center-grid"
									onclick={() => onDeleteBackupClick(v.backupName)}
								>
									{#snippet popup()}
										Delete
									{/snippet}

									<Icon iconType="trash-can" width={20}></Icon>
								</ButtonWithPopup>
							</div>
						</div>
					{/snippet}
				</InfiniteList>
			</div>

			<button class="create-backup" onclick={onCreateBackupClick}>Create Backup</button>
		</div>
	</div>

	{#if loading}
		<Loading></Loading>
	{/if}
</div>

<style>
	.settings {
		width: 800px;

		padding: 16px;
	}

	.backups {
		gap: 16px;
	}

	.backup-list {
		width: 90%;
		height: 256px;

		border: var(--border);
		border-radius: 4px;
	}

	.backup {
		display: grid;
		grid-template-columns: auto max-content 128px;
		gap: 16px;
	}

	.backup-name,
	.backup-date {
		padding: 8px;

		overflow: hidden;
		text-overflow: ellipsis;
		white-space: nowrap;
	}

	.backup-buttons {
		gap: 8px;
	}

	.create-backup {
		width: 90%;
		height: 48px;

		border: var(--border);
		border-color: var(--success-color);
		border-radius: 4px;

		color: var(--success-color);
		font-size: 20px;
		font-weight: 500;
	}

	:global .backup-button {
		height: 32px;
		aspect-ratio: 1;

		border: var(--border);
		border-radius: 4px;
	}

	:global .backup-button.apply {
		color: var(--success-color);
	}

	:global .backup-button.delete {
		color: var(--error-color);
	}

	:global .backup-button.download {
		color: var(--information-color);
	}
</style>
