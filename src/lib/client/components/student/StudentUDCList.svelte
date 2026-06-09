<script lang="ts">
	import { fade } from 'svelte/transition';
	import { StudentState } from './student_state.svelte';
	import { sineInOut } from 'svelte/easing';
	import { StudentData } from '$shared/types/loaded_data/student_data';
	import InfiniteList from '../infinite_list/InfiniteList.svelte';
	import { stringSorter } from '../table_view/logic/table_view_sorters';

	const studentState = StudentState.context.get();
	const studentData = StudentData.context.get();

	const udcList = studentData.udc.getArray();
	udcList.sort((l, r) => stringSorter(l.shortName, r.shortName));

	const hideUDCList = () => {
		studentState.isUDCListVisible = false;
	};

	const searchByUDC = (udcShortName: string) => {
		studentState.udcSearchedBy = udcShortName;
		studentState.isUDCListVisible = false;
	};
</script>

<div class="student-udc-list center-flex" transition:fade={{ duration: 250, easing: sineInOut }}>
	<button
		class="udc-list-background"
		onclick={hideUDCList}
		aria-label="Schovat seznam"
		tabindex="-1"
	></button>

	<div class="udc-list-container center-flex">
		<div class="info-box udc-list-info center-flex flex-column">
			<div class="info-box-title">Seznam MDT</div>
			<p class="no-indent">
				Vpravo se nachází seznam všech <b>MDT</b>, které <b>má</b> některá z knih v knihovně.
			</p>
			<p>
				V seznamu je možné <b>kliknout</b> na jakýkoliv <b>řádek</b>, aby se v seznamu
				<b>vyhledaly</b> všechny knihy s daným <b>MDT</b>.
			</p>
			<button class="hide-udc-list" onclick={hideUDCList}>Zavřít</button>
		</div>
		<div class="info-box udc-list">
			<InfiniteList items={udcList} itemHeight={32}>
				{#snippet listRow(visibleRowItem)}
					<button class="row" onclick={() => searchByUDC(visibleRowItem.shortName)}>
						<div class="numeric center-flex">{visibleRowItem.shortName}</div>
						<div class="text">
							<div class="text-container">{visibleRowItem.longName}</div>
						</div>
					</button>
				{/snippet}
			</InfiniteList>
		</div>
	</div>
</div>

<style>
	.student-udc-list {
		position: absolute;
		top: 0;
		left: 0;

		width: 100%;
		height: 100%;

		background-color: transparent;

		z-index: 100;
	}

	.udc-list-background {
		position: absolute;
		top: 0;
		left: 0;

		width: 100%;
		height: 100%;

		background-color: var(--drop-shadow-color);
	}

	.udc-list-container {
		gap: 128px;

		background-color: transparent;
		pointer-events: none;

		z-index: 100;
	}

	.info-box {
		width: 420px;
		aspect-ratio: 1;
		gap: 8px;

		padding: 16px 24px;
		border-radius: 4px;
		border: var(--border);

		font-size: 16px;
		text-align: justify;

		filter: drop-shadow(0px 0px 8px var(--drop-shadow-color));
		pointer-events: all;

		z-index: 100;
	}

	.info-box-title {
		font-size: 48px;
		font-weight: bold;
	}

	.info-box > p {
		line-height: 1.75;
	}

	.info-box > p:not(.no-indent) {
		text-indent: 32px;
	}

	.hide-udc-list {
		margin-top: 32px;
		padding: 16px 20px;
		border: var(--border);
		border-color: var(--error-color);
		border-width: 2px;
		border-radius: 4px;

		font-size: 20px;
		font-weight: bold;
	}

	.udc-list {
		width: 600px;
		height: 420px;
		aspect-ratio: unset;

		padding: 0;
	}

	.row {
		display: grid;
		grid-template-columns: 1fr 1fr;

		width: 100%;
		height: 100%;

		border-bottom: var(--border);

		font-size: 16px;
	}

	.row div {
		background-color: transparent;
		pointer-events: none;
	}

	.text {
		display: flex;
		align-items: center;
		overflow: hidden;
	}

	.text-container {
		overflow: hidden;
		text-overflow: ellipsis;
		text-wrap: nowrap;
	}
</style>
