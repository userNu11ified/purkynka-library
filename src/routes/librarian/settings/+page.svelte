<script lang="ts">
	import { invalidate } from '$app/navigation';
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
	import type { ChangeEventHandler } from 'svelte/elements';

	let databaseImportInput: HTMLInputElement | undefined = $state();
	let oldDatabaseImportInput: HTMLInputElement | undefined = $state();

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

	const onImportBackupClick = () => {
		databaseImportInput?.click();
	};

	const onImportChange: ChangeEventHandler<HTMLInputElement> = async (e) => {
		const file = e.currentTarget.files?.[0];
		if (file === undefined) return;

		loading = true;

		const formData = new FormData();
		formData.append('file', file);

		await makeAPIRequest('POST', 'backup/import', formData);

		window.location.reload();
	};

	const onImportOldBackupClick = () => {
		oldDatabaseImportInput?.click();
	};

	const onImportOldChange: ChangeEventHandler<HTMLInputElement> = async (e) => {
		const file = e.currentTarget.files?.[0];
		if (file === undefined) return;

		loading = true;

		const formData = new FormData();
		formData.append('file', file);

		await makeAPIRequest('POST', 'backup/import-old', formData);

		window.location.reload();

		loading = false;
	};

	onMount(() => {
		backups = page.data.backups as BackupInformation[];

		invalidate('app:backups');
	});
</script>

<input
	type="file"
	accept="application/gzip, application/x-gzip"
	bind:this={databaseImportInput}
	hidden
	onchange={onImportChange}
/>

<input
	type="file"
	accept="application/json"
	bind:this={oldDatabaseImportInput}
	hidden
	onchange={onImportOldChange}
/>

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

			<button class="backup-action create" onclick={onCreateBackupClick}>Create Backup</button>
			<button class="backup-action import" onclick={onImportBackupClick}>Import Backup</button>
			<button class="backup-action import-old" onclick={onImportOldBackupClick}
				>Import V1 Backup</button
			>
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
		height: 320px;

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

	.backup-action {
		width: 90%;
		height: 48px;

		border: var(--border);
		border-radius: 4px;

		font-size: 20px;
		font-weight: 500;
	}

	.backup-action.create {
		border-color: var(--success-color);
		color: var(--success-color);
	}

	.backup-action.import {
		border-color: var(--information-color);
		color: var(--information-color);
	}

	.backup-action.import-old {
		border-color: var(--error-color);
		color: var(--error-color);

		margin-top: 32px;
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
