<script lang="ts">
	import { INFO_OPENED, STUDENT_DATABASE } from '$client/student/student';
	import { percent } from '$client/style/css';
	import Editor from '$components/editor/Editor.svelte';
	import EditorAction from '$components/editor/EditorAction.svelte';
</script>

<Editor editor_width={percent(50)}>
	<svelte:fragment slot="title"><div class="greeting">Zdravím! 👋</div></svelte:fragment>
	<div class="info" slot="content">
		<div>
			Pokud tohle čtete, tak jste navštívili naší školní knihovnu, ale i tak jste skončili před počítačem a otevřeli
			jste si <b>Program evidence knih a výpůjček</b>.
		</div>
		<div class="indent">
			Jeho výhodou je, že je <b>pro vás přístupný</b>, takže si můžete kdykoliv zjistit, zda máme vámi žádanou knihu v
			knihovně, případně si zjistit, jaké knihy v knihovně jsou celkově. Knihy půjčujeme na měsíc, s možností
			prodloužení pokud by to bylo potřeba, například pokud je knížka větší.
		</div>
		<div class="title">Jak se v programu orientovat</div>
		<div>Vyhledávat můžete následujícími způsoby:</div>
		<ol>
			<li>
				Podle názvu (pokud zadáte jen několik písmen z názvu, ukážou se vám všechny knihy, které mají tuto skupinu
				písmen v názvu - příklad: matemat = Matematika…., Matematické…, Základy matematiky… s matematikou ….atd)
			</li>
			<li>Podle autora - opět stačí zadat několik písmen a nabídnou se možnosti.</li>
			<li>
				Podle MDT = mezinárodního desetinného třídění - knihy jsou zařazeny do určitých skupin podle zaměření, např.
				počítače, ekonomika, hudba, právo, angličtina atd. (seznam okruhů s příslušným číslem najdete opět v nabídce
				programu dole pod zkratkou MDT).
			</li>
			<li>
				Podle anotace - Obsahuje stručné informace o knize, napíšete-li sem MČ, ukážou se všechny knihy maturitní četby,
				které máme v knihovně.
			</li>
		</ol>
		<div>
			<b>Pokud si nějakou knihu vyberete</b>, úplně vlevo uvidíte, zda je kniha volná, půjčená (pak je tam datum, kdy se
			má nejpozději vrátit do knihovny) nebo půjčená trvale (pak ji má některý vyučující ve své příruční knihovně v
			kabinetě). U požadované <b>volné</b> knihy si napište její přírůstkové číslo i s písmenkem za ním a dojděte si pro
			knihu do knihovny.
		</div>
		<div class="indent">
			Pokud již máte knihu půjčenou a napíšete do kolonky <b>Přír. č...</b> její přírustkové číslo (jde o spodní číslo
			na štítku, nalepeném dole na hřbetu knihy), najdete zde úplně nalevo datum,
			<b>do kdy máte knihu nejpozději vrátit.</b>
		</div>
	</div>
	<svelte:fragment slot="action-bar">
		<EditorAction button_color="var(--success-600)" on_click={() => ($INFO_OPENED = false)}>Ok</EditorAction>
	</svelte:fragment>
</Editor>

<style>
	.greeting {
		font-size: var(--font-size-huge);
		font-weight: 900;
	}

	b {
		font-weight: 900;
	}

	.info {
		font-size: var(--font-size-regular);
		& > :is(div, ol):not(:last-child) {
			width: 100%;
			margin-bottom: 12px;
			line-height: 1.5;
			text-wrap: pretty;
		}
	}

	.title {
		font-size: var(--font-size-large);
		font-weight: bold;
	}

	.indent {
		text-indent: 4ch;
	}
</style>
