# Knihovna na Purkyňce

## Informace

Zdrojový kód pro knihovnický software na Purkyňce.<br>
Neočekávejte nejhezčí kód, ale stránka jede poměrně dobře a pokusil jsem se kód nějak logicky rozložit.

## Rozložení

### Klient

Komponenty pro UI klienta se nachází ve složce `src/components`, logika zase v `src/lib/client`.
Poměrně velké množství komponentů využívá generic typy, aby se dalo pracovat s čímkoliv.

Při spuštění si načte buď celou databázi, pokud se jedná o stránku správce, nebo jen potřebnou část, pokud se jedná o stránku pro studenty. Posílá několik requestů najednou, na každý potřebný endpoint, protože je to rychlejší než jeden velký request.

### Server

Endpointy se nachází v `src/routes`, logika serveru zase v `src/lib/server`. Data se ukládají do složky `data`, kde je `database.json` obsahující samotnou databázi a `password.json` obsahující uložený `scrypt` klíč pro přihlašování.

Při spuštění se databáze vytvoří prázdná, až na nějaké výchozí možnosti (viz. `src/lib/server/database.ts:create_empty_database`). Pokud Vám jede lokální SQL server a máte v něm nahranou starou databázi z knihovny, lze po trošce úpravy (jméno, heslo, apod.) nahrát starou databázi do nové. Kód je v `src/lib/server/database.ts:transfer_old_database`, ale očekává i CSV studentů a učitelů, ve složce `data/original`. Formát CSV souborů je `příjmení;jméno;třída` pro žáky a `příjmení;jméno;zkratka` pro učitele.

### Společné

Některé věci jsou společné napříč oběma stranami, ty jsou v `src/lib/shared`. Většinou jsou to samotné typy pro databázi apod., ale jsou zde i nějaké užitečné funkce, co jsem používal na hodně místech.

## Databáze

SQL mi přišel zbytečně komplikovaný na takto jednoduchou věc, tak jsem zvolil `json`.<br>
Cokoliv, co může být společné přes několik knih jsem uložil v samostatných listech.<br>
Kde je to potřeba je pak jako hodnota použit index do daného listu.

## Autentizace

Pro přihlašování používám `scrypt` klíč uložený v hex formátu na klientovi. Nechtěl se mi řešit sessioning a popravdě pokud se Vám někdo dostane do počítače na úrovni, že si otevře DevTools a podívá do local storage, nebo se Vám dostal do serveru a vzal si klíč z uloženého souboru, tak máte asi problém trochu jiný.

Takto pokud by se někdo ke klíči dostal, tak alespoň nezná samotné heslo, i když pak může knihovnu upravovat.

Při prvním přihlášení se vytvoří heslo podle hesla zadaného na přihlašovací obrazovce. Na klient se pak vrátí hex formát `scrypt` klíče, který se uloží v local storage do `password`. Pokud by se local storage vymazal, nebo se přihlásil nový uživatel, kontroluje se zadané heslo oproti již vytvořenému na serveru.

I když je to možná trochu přehnané, použil jsem `scrypt` s výchozím nastavením z Node.JS `crypto` modulu, heslo je normalizováno do formátu `NFKC` a je z něj udělán `Buffer`. Jako `salt` je použit `Buffer` vytvořený pomocí `randomBytes(32)`, opět z `crypto` modulu.

Salt i samotný klíč je pak uložený v `data/password.json`.

## Endpointy

### localhost:5173

Samotná stránka s editorem knížek apod.<br>Načítá celou databázi, určeno pro učitele nebo správce knihovny.

### localhost:5173/student

Samostatný seznam knih, který načte jen potřebné informace<br>
Určeno studentům, pro zjištění knih v knihovně a jejich stav půjčení.

### localhost:5173/api/v1/...

Obsahuje endpointy pro GET, POST, PUT a DELETE requesty do databáze.
Jakýkoliv endpoint, který něco v databázi mění potřebuje `Authentication` header, obsahující hex formát uloženého `scrypt` klíče.

Endpointy s potřebným heslem hází `401` pokud je heslo špatně, nebo ještě není nastavené.<br>
Obsahují také runtime validaci dat, vyhodí `400` pokud jsou data špatně.<br>
V obou připaděch je chybová zpráva v `body` vrácené `Response`.

PUT requesty se posílají na `localhost:5173/api/v1/.../id`, kde `id` je index v daném listu.

## Použité knihovny

Celá stránka je napsaná pomocí [SvelteKit](https://kit.svelte.dev/).<br>
Listy s nekonečným scrollováním jsou vytvořeny pomocí [svelte-tiny-virtual-list](https://github.com/jonasgeiler/svelte-tiny-virtual-list), server-side validace dat je vytvořena pomocí [io-ts](https://github.com/gcanti/io-ts) a ikonky jsem vzal z [Iconify](https://icon-sets.iconify.design/mdi).<br>
Layout stránky vytvořila paní učitelka Houšková, designování stránky, barev a programování jsem pak dělal sám.

## Licence

Projekt je licencován pod [MIT](https://github.com/userNu11ified/purkynka-library/LICENSE) licencí.
