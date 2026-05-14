# CUTOptimizer – Frontend

⚠️ **Projekt je ve vývoji.** Základní průchod aplikací funguje, řada funkcí ale ještě chybí nebo je rozpracovaná.

React webové rozhraní pro aplikaci **CUTOptimizer** – nástroj pro optimalizaci nářezových plánů z plošných materiálů.
Backend (ASP.NET Core Web API) je v samostatném repozitáři.

## K čemu to slouží

V truhlářské a nábytkářské výrobě se z velkých desek (typicky 2800 × 2070 mm) řežou menší dílce. Aplikace pomáhá rozložit dílce na desky tak, aby vzniklo co nejméně odpadu, a vykreslí výsledný nářezový plán.

Uživatel zadá materiál, hrany a seznam panelů (rozměry, kusy). Aplikace pošle data na backend, ten spočítá optimalizaci a frontend vykreslí výsledek.

## Stack

- React 19
- Vite
- Tailwind CSS 4
- Fetch API (vlastní tenký klient v `src/services/apiClient.js`)

## Struktura

```
src/
  pages/
    OptimizePage.jsx        // hlavní stránka
  components/
    materials/              // výběr desky
    edges/                  // výběr hran
    panels/                 // tabulka panelů
    results/                // vykreslení nářezového plánu
  services/                 // volání backend API
  utils/                    // pomocné funkce
```

## Spuštění lokálně

Předpoklady: Node.js 20+, běžící backend na `http://localhost:5xxx`.

```bash
npm install
npm run dev
```

Aplikace běží na `http://localhost:5173`.
URL backendu se konfiguruje v `src/services/apiClient.js`.

## Co je hotové

- Výběr materiálu a hran ze seznamu
- Zadávání panelů (rozměry, kusy, popis, hrany)
- Volání optimalizačního endpointu
- Vykreslení nářezového plánu – jednotlivé desky s rozmístěnými dílci

## Co je v plánu

- Import panelů z CSV (a postupně z výstupů různých CAD softwarů – SketchUp, IMOS apod.)
- Export nářezového plánu pro různé pily a dodavatele (PDF, formátované CSV)
- Uložení a načítání projektů
- Autentizace a uživatelské účty
- Lepší UX pro tabulku panelů (drag & drop, hromadné úpravy)

## Poznámka

Aplikace vzniká jako osobní projekt – propojení mé předchozí praxe v nábytkářské konstrukci s tím, co se učím ve vývoji webových aplikací. Některá místa v kódu vědomě čekají na refactor.
