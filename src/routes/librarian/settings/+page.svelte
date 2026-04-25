<script lang="ts">
	import { invalidate } from '$app/navigation';
	import { page } from '$app/state';
	import { clientLogger } from '$client/client_loggers';
	import ButtonWithPopup from '$client/components/ButtonWithPopup.svelte';
	import Icon from '$client/components/icon/Icon.svelte';
	import InfiniteList from '$client/components/infinite_list/InfiniteList.svelte';
	import Loading from '$client/components/loading/Loading.svelte';
	import type { AvailableTheme } from '$client/theme.svelte';
	import { type BackupBody, type BackupError, type BackupInformation } from '$shared/types/backup';
	import { makeAPIJsonRequest, makeAPIRequest } from '$shared/types/database/api';
	import { Result } from '$shared/types/result';
	import { onMount } from 'svelte';
	import type { ChangeEventHandler } from 'svelte/elements';

	let databaseImportInput: HTMLInputElement | undefined = $state();
	let oldDatabaseImportInput: HTMLInputElement | undefined = $state();

	let activeTheme: AvailableTheme | undefined = $state();
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

	const onClickTheme = async (theme: AvailableTheme) => {
		loading = true;

		activeTheme = theme;
		const response = await fetch(window.location.href, {
			method: 'POST',
			body: JSON.stringify({ theme: activeTheme })
		});
		if (!response.ok) window.location.reload();

		(document.querySelector(':root')! as HTMLElement).dataset.theme = activeTheme;

		loading = false;
	};

	onMount(async () => {
		loading = true;

		activeTheme =
			((document.querySelector(':root')! as HTMLElement).dataset.theme as
				| AvailableTheme
				| undefined) ?? 'system';

		await invalidate('app:backups');
		backups = page.data.backups as BackupInformation[];

		loading = false;
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

<div class="settings-container fill-container center-grid">
	<div class="settings">
		<div class="category backups flex-column center-flex">
			<h1>Zálohy</h1>
			<div class="backup-list">
				<InfiniteList items={sortedBackups} itemHeight={48}>
					{#snippet listRow(v)}
						<div class="backup fill-container">
							<div class="backup-name">{v.backupName}</div>
							<div class="backup-date">{v.backupDate}</div>
							<div class="backup-buttons center-flex">
								<ButtonWithPopup
									class="backup-button download center-grid"
									popupPosition="left"
									popupAlignment="end"
									onclick={() => onDownloadBackupClick(v.backupName)}
								>
									{#snippet popup()}
										Stáhnout
									{/snippet}

									<Icon iconType="download" width={20}></Icon>
								</ButtonWithPopup>

								<ButtonWithPopup
									class="backup-button apply center-grid"
									popupPosition="left"
									popupAlignment="end"
									onclick={() => onApplyBackupClick(v.backupName)}
								>
									{#snippet popup()}
										Aplikovat
									{/snippet}

									<Icon iconType="upload" width={20}></Icon>
								</ButtonWithPopup>

								<ButtonWithPopup
									class="backup-button delete center-grid"
									popupPosition="left"
									popupAlignment="end"
									onclick={() => onDeleteBackupClick(v.backupName)}
								>
									{#snippet popup()}
										Vymazat
									{/snippet}

									<Icon iconType="trash-can" width={20}></Icon>
								</ButtonWithPopup>
							</div>
						</div>
					{/snippet}
				</InfiniteList>
			</div>

			<button class="backup-action create" onclick={onCreateBackupClick}>Vytvořit zálohu</button>
			<button class="backup-action import" onclick={onImportBackupClick}>Importovat zálohu</button>
			<button class="backup-action import-old" onclick={onImportOldBackupClick}
				>Importovat ze staré knihovny</button
			>
		</div>

		<div class="category theming flex-column center-flex">
			<div class="theme">
				<div class="theme-title center-grid">Barevné schéma</div>
				<div class="theme-buttons center-flex">
					<ButtonWithPopup
						class={`theme-button center-grid ${activeTheme === 'system' ? 'active' : ''}`}
						onclick={() => onClickTheme('system')}
					>
						{#snippet popup()}
							Systémové
						{/snippet}

						<Icon iconType="monitor" width={20}></Icon>
					</ButtonWithPopup>

					<ButtonWithPopup
						class={`theme-button center-grid ${activeTheme === 'light' ? 'active' : ''}`}
						onclick={() => onClickTheme('light')}
					>
						{#snippet popup()}
							Světlé
						{/snippet}

						<Icon iconType="light-theme" width={20}></Icon>
					</ButtonWithPopup>

					<ButtonWithPopup
						class={`theme-button center-grid ${activeTheme === 'dark' ? 'active' : ''}`}
						onclick={() => onClickTheme('dark')}
					>
						{#snippet popup()}
							Tmavé
						{/snippet}

						<Icon iconType="dark-theme" width={20}></Icon>
					</ButtonWithPopup>
				</div>
			</div>
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

	.theme {
		display: grid;
		grid-template-columns: 192px 128px;
		gap: 16px;

		margin-top: 64px;
	}

	.theme-title {
		font-size: 20px;
		font-weight: bold;
	}

	.theme-buttons {
		gap: 8px;
	}

	:global .theme-button {
		height: 48px;
		aspect-ratio: 1;

		border: var(--border);
		border-radius: 4px;
	}

	:global .theme-button.active {
		border-color: var(--success-color);
		color: var(--success-color);
	}
</style>
