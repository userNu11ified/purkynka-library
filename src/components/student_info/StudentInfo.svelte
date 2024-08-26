<script lang="ts">
	import { INFO_OPENED, STUDENT_DATABASE } from '$client/student/student';
	import { percent } from '$client/style/css';
	import Editor from '$components/editor/Editor.svelte';
	import EditorAction from '$components/editor/EditorAction.svelte';

	console.log($STUDENT_DATABASE);
</script>

<Editor editor_width={percent(50)}>
	<svelte:fragment slot="title"><div class="greeting">Zdravím! 👋</div></svelte:fragment>
	<div class="info" slot="content">
		<div>Pokud tohle čtete, tak jste navštívili naší školní knihovnu, ale i tak jste skončili před počítačem.</div>
		<div class="title">Informace</div>
		<div>
			Tato stránka je určena pro žáky. Můžete si tady zkontrolovat, jestli v knihovně nějakou knížku máme a zároveň její
			stav půjčení.<br />
			U některých knih je i anotace, která obsahuje stručné informace o dané knize.<br />
			Pokud hledáte nějaký typ knížky, ale ne žádnou specifickou, vedle tlačítka pro informace je tlačítko pro seznam MDT.<br
			/>
			Seznam MDT zároveň obsahuje jen ty, od kterých máme v knihovně nějakou knihu.
		</div>
		<div class="title">Půjčení</div>
		<div>
			Pokud si tady nějakou knížku najdete, a zároveň je volná, lze ji jednoduše v knihovně najít podle přírustkového
			čísla.<br />
			Poté stačí zajít s knihou za paní učitelkou Houškovou, která si Vás zapíše zároveň s výpůjčkou.
		</div>
		<div>Knihy se půjčují na měsíc, ale doba půjčení jde prodloužit vždy o měsíc, pokud by to bylo potřeba.</div>
		<div class="title">Zdrojový kód</div>
		<div>
			Celý zdrojový kód lze najít na <a href="https://github.com/userNu11ified/purkynka-library">GitHubu</a>. <br />
			Práci jsem dělal sám, až na pár použitých knihoven. <br />
			Obsahuje i samostatnou stránku pro editaci knih, která tady nejde vidět. <br />
			Jestli očekáváte extrémně čistý kód, tak asi budete muset jinam. <br />
			Celá stránka je psaná pomocí <a href="https://kit.svelte.dev/">SvelteKit</a> a
			<a href="https://www.typescriptlang.org/">TypeScriptu</a>, pro nekonečný scrolling používám
			<a href="https://github.com/jonasgeiler/svelte-tiny-virtual-list">svelte-tiny-virtual-list</a>, na server-side
			validaci dat <a href="https://github.com/gcanti/io-ts">io-ts</a> a ikonky jsou z
			<a href="https://icon-sets.iconify.design/mdi">Iconify</a>. <br />
			Layout stránky byl navržen paní učitelkou Houškovou, barvičky jsem dělal sám.
		</div>
		<div>
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
		& > div:not(:last-child) {
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
