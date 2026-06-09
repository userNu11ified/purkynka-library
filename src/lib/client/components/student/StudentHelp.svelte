<script lang="ts">
	import { fade } from 'svelte/transition';
	import { StudentState } from './student_state.svelte';
	import { sineInOut } from 'svelte/easing';
	import type { Nullable } from '$shared/types/util';

	const studentState = StudentState.context.get();

	type HoverableButton = 'sorters' | 'search-bars' | 'list' | 'status-bar';

	let currentlyHovered: Nullable<HoverableButton> = $state(null);
	const onButtonHover = (hoverableButton: Nullable<HoverableButton>) => {
		currentlyHovered = hoverableButton;
	};

	const onButtonClick = () => {
		studentState.isStudentHelpVisible = false;
	};
</script>

<div
	class="student-help"
	onmouseleave={() => onButtonHover(null)}
	transition:fade={{ duration: 250, easing: sineInOut }}
	role="dialog"
	tabindex="-1"
>
	<div class="info center-flex">
		<button
			class="info-box center-flex flex-column"
			onclick={onButtonClick}
			onmouseenter={() => onButtonHover(null)}
		>
			<div class="info-box-title">Zdravím! 👋</div>
			<p>
				Vítejte u nás v <b>knihovně</b>! Nacházíte se u seznamu knih, které je možné v knihovně
				najít.
			</p>
			<p>
				Pro <b>vysvětlení</b> jednotlivých funkcí tohoto náhledu je možné kurzorem <b>přejet</b> na
				<b>číslem označená pole.</b>
			</p>
			<p></p>
			<p>
				Pokud si najdete knihu, která je zrovna <b>volná</b>, zapamatujte si její
				<b>přírustkové číslo</b>. Podle něj lze v knihovně knihu <b>rychle najít</b>. Nachází se na
				<b>štítku</b>, který je na <b>hřbetu</b> knihy.
			</p>
		</button>
		<button
			class="info-box center-flex flex-column"
			onclick={onButtonClick}
			onmouseenter={() => onButtonHover(null)}
		>
			{#if currentlyHovered === null}
				<div class="info-box-title">Nic nevybráno</div>
			{:else if currentlyHovered === 'sorters'}
				<div class="info-box-title">Seřazení</div>
				<p>
					Jednotlivé sloupce obsahují <b>tlačítka</b>, pomocí kterých je možné seznam
					<b>seřadit.</b>
				</p>
				<p>Pokud na některé kliknete <b>znovu</b>, otočí se <b>pořadí</b> seřazení.</p>
				<p>Pomocí <b>hrany</b> mezi sloupci je možné měnit <b>velikost jednotlivých sloupců.</b></p>
			{:else if currentlyHovered === 'search-bars'}
				<div class="info-box-title">Vyhledávání</div>
				<p>Pod tlačítky seřazení se nachází <b>vyhledávací pole</b> jednotlivých sloupců.</p>
				<p>
					Nejčastěji se vyhledává podle <b>názvu knihy</b>, ale je možné využít například
					vyhledávání podle <b>autora</b> nebo <b>mezinárodního desetinného třídění</b>. Seznam MDT
					se nachází ve stavové liště.
				</p>
				<p>
					Ve sloupci <b>Anotace</b> je také možné vyhledat maturitní četbu pomocí zadání zkratky
					<b>MČ</b>.
				</p>
			{:else if currentlyHovered === 'list'}
				<div class="info-box-title">Seznam</div>
				<p>Samotný seznam obsahující řádky <b>jednotlivých knih.</b></p>
				<p>
					Na text v buňkách lze <b>přejet</b> kurzorem, aby se ukázal <b>celý</b> nebo
					<b>jinak zapsaný</b>.
				</p>
				<p>
					V prvním sloupci lze vidět <b>stav knihy</b>. Pokud je <b>půjčená</b>, je zde zobrazen
					<b>datum</b>, do kdy by se <b>měla</b> kniha <b>vrátit</b> do knihovny. <b>Trvale</b> půjčené
					knihy jsou půjčené některým z učitelů.
				</p>
			{:else if currentlyHovered === 'status-bar'}
				<div class="info-box-title">Stavová lišta</div>
				<p>Lišta obsahující informace o právě <b>zobrazeném seznamu</b>.</p>
				<p>
					Obsahuje tlačítka pro <b>resetování velikosti sloupců</b>, <b>zobrazení této nápovědy</b>
					a <b>seznamu MDT</b>.
				</p>
				<p>Lze v ní také zapnout <b>rozlišování velkých a malých písmen</b> ve vyhledávání.</p>
			{/if}
			<div class="click-to-hide">( Klikněte kdekoliv pro skrytí nápovědy. )</div>
		</button>
	</div>
	<button
		class="sorters"
		aria-label="Seřazení"
		onclick={onButtonClick}
		onmouseenter={() => onButtonHover('sorters')}
	>
		<div class="button-number center-grid">1</div>
	</button>
	<button
		class="search-bars"
		aria-label="Vyhledávání"
		onclick={onButtonClick}
		onmouseenter={() => onButtonHover('search-bars')}
	>
		<div class="button-number center-grid">2</div>
	</button>
	<button
		class="list"
		aria-label="Seznam"
		onclick={onButtonClick}
		onmouseenter={() => onButtonHover('list')}
	>
		<div class="button-number center-grid">3</div>
	</button>
	<button
		class="status-bar"
		aria-label="Stavová lišta"
		onclick={onButtonClick}
		onmouseenter={() => onButtonHover('status-bar')}
	>
		<div class="button-number center-grid">4</div>
	</button>
</div>

<style>
	.student-help {
		display: grid;
		grid-template-rows:
			calc(48px + var(--border-width))
			calc(32px + var(--border-width))
			auto
			calc(32px + var(--border-width));

		position: absolute;
		top: 0;
		left: 0;

		width: 100%;
		height: 100%;

		z-index: 100;

		background-color: transparent;
	}

	.student-help > button {
		position: relative;

		background-color: var(--drop-shadow-color);

		transition: background-color 250ms cubic-bezier(0.37, 0, 0.63, 1);
	}

	.student-help > button:hover {
		background-color: transparent;
	}

	.info {
		position: absolute;
		top: 0;
		left: 0;
		gap: 128px;

		width: 100%;
		height: 100%;

		background-color: transparent;
		pointer-events: none;
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

	.info-box:hover {
		background-color: var(--bg-primary);
	}

	.info-box > div {
		background-color: transparent;
	}

	.info-box > p {
		line-height: 1.25lh;
		text-indent: 32px;
	}

	.info-box-title {
		font-size: 48px;
		font-weight: bold;
	}

	.click-to-hide {
		margin-top: 16px;
		color: gray;
	}

	.button-number {
		position: absolute;
		top: 50%;
		right: 64px;
		transform: translateY(-50%);

		width: 32px;
		aspect-ratio: 1;

		border: var(--border);
		border-radius: 100%;

		font-size: 20px;
		font-weight: bold;

		filter: drop-shadow(0px 0px 8px var(--drop-shadow-color));
	}
</style>
