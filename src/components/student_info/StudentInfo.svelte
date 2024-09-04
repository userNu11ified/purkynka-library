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
		<div class="title">Informace</div>
		<div>
			Jeho výhodou je, že je <b>pro vás přístupný</b>, takže si můžete kdykoliv zjistit, zda máme vámi žádanou knihu v
			knihovně, případně si zjistit, jaké knihy v knihovně jsou celkově. Podle přírůstkového čísla knihy, kterou jste si
			půjčili ze školní knihovny, si můžete kdykoliv zjistit, kdy nejpozději (do 1 měsíce od půjčení) ji máte vrátit.
		</div>
		<div class="title">Jak se v programu orientovat</div>
		<div>Vyhledávat jde třemi způsoby:</div>
		<ol>
			<li>
				Podle názvu (pokud zadáte jen několik písmen z názvu, ukážou se vám všechny knihy, které mají tuto skupinu
				písmen v názvu - příklad: matemat = Matematika…., Matema-tické…, Základy matematiky… s matematikou ….atd)
			</li>
			<li>Podle autora - opět stačí zadat několik písmen a nabídnou se možnosti</li>
			<li>
				Podle MDT = mezinárodního desetinného třídění - knihy jsou zařazeny do určitých skupin podle zaměření, např.
				počítače, ekonomika, hudba, právo, angličtina atd. (seznam okruhů s příslušným číslem najdete opět v nabídce
				programu dole pod zkratkou MDT) U některých knih je i anotace, kde je stručná informace o knize
			</li>
		</ol>
		<div>
			<b>Pokud si nějakou knihu vyberete</b>, úplně vlevo uvidíte, zda je kniha volná, půjčená (pak je tam datum, kdy se
			má nejpozději vrátit do knihovny) nebo půjčená trvale (pak ji má některý vyučující ve své příruční knihovně v
			kabinetě). U požadované <b>volné</b> knihy si napište její přírůstkové číslo i s písmenkem za ním a dojděte si pro
			knihu do knihovny.
		</div>
		<div>
			Pokud zadáte přírůstkové číslo knihy, kterou máte půjčenou, najdete úplně vlevo datum, do kdy ji máte nejpozději
			vrátit.
		</div>
		<div class="title">Pro 🤓</div>
		<div>
			Celý zdrojový kód lze najít na <a href="https://github.com/userNu11ified/purkynka-library">GitHubu</a>. <br />
			Made with <span title="...and lots of screaming at TypeScript...">❤️</span> by
			<a href="https://github.com/userNu11ified">null</a>.
		</div>
	</div>
	<svelte:fragment slot="action-bar">
		<EditorAction button_color="var(--success-600)" on_click={() => ($INFO_OPENED = false)}>Ok</EditorAction>
	</svelte:fragment>
</Editor>

<style>
	.greeting {
		font-size: var(--font-size-huge);
	}

	.info {
		font-size: var(--font-size-regular);
		& > :is(div, ol):not(:last-child) {
			width: 100%;
			margin-bottom: 12px;
			line-height: 1.5;
		}
	}

	.title {
		font-size: var(--font-size-large);
		font-weight: bold;
	}
</style>
