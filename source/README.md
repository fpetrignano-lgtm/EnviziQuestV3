# Envizi ESG Quest — V2.0

## Struttura

```
envizi-esg-quest/
└── source/               ← UNICA FONTE DI VERITÀ — modifica solo qui
    ├── src/
    │   ├── App.tsx       ← tutto il codice dell'app
    │   └── styles.css    ← tutto il CSS
    ├── public/
    │   ├── *.png         ← immagini degli scenari
    │   └── characters/   ← ritratti Marco e Luisa
    ├── dist/             ← generato da `npm run build`, NON modificare manualmente
    └── package.json
```

## Versioni

| Versione | Repository | URL |
|----------|-----------|-----|
| V1.0 | [envizi-quest](https://github.com/fpetrignano-lgtm/envizi-quest) | https://fpetrignano-lgtm.github.io/envizi-quest/ |
| V2.0 | [envizi-esg-quest](https://github.com/fpetrignano-lgtm/envizi-esg-quest) | https://fpetrignano-lgtm.github.io/envizi-esg-quest/ |

## Comandi

```bash
cd envizi-esg-quest/source

# Sviluppo locale con hot-reload
npm run dev

# Anteprima del build locale
npm run build && npx vite preview --port 4174
# → apri http://localhost:4174/envizi-esg-quest/

# Build standalone
npm run build
```

## Flusso di deploy (GitHub Pages)

1. Modifica `source/src/App.tsx` o `source/src/styles.css`
2. `git add . && git commit -m "descrizione" && git push`
3. GitHub Actions builda automaticamente da `source/` con `npm ci && npm run build`
4. GitHub Pages pubblica il contenuto di `source/dist`

**Configurazione GitHub Pages**:
- Source: `GitHub Actions`
- Workflow: `.github/workflows/deploy-pages.yml`
- Base path Vite: `/envizi-esg-quest/`
## Convenzioni font tipografici

### FDT — Font titolo di riferimento
Usare per tutti i titoli `h1` delle slide.
- `font-size: clamp(28px, 3vw, 44px)`
- `font-weight: 520`
- `letter-spacing: -0.05em`
- `line-height: 1`
- `color: #b5c9c1`

### FD — Font corpo di riferimento (testo descrittivo)
Usare per testi descrittivi/intro. Classe `.intro` dell'onboarding.
- `font-size: clamp(16px, 1.45vw, 21px)`
- `color: #b5c9c1`
- `line-height: 1.55`

### FD1 — Font voci indice (label principale)
Usare per le label principali delle voci nell'indice (ChapterMap).
- `font-size: clamp(24px, 2.175vw, 31.5px)`
- `font-weight: 700`
- `color: #b5c9c1`
- `line-height: 1.55`

### FD2 — Font sottotitoli voci indice
Usare per i sottotitoli delle voci nell'indice (ChapterMap).
- `font-size: clamp(17.3px, 1.566vw, 22.7px)`
- `color: #b5c9c1`
- `line-height: 1.55`

---

## Convenzione IDEAL

Quando l'utente scrive **IDEAL `<slide>`**, esegui in sequenza automatica senza chiedere conferma:

1. **SCONG** — scongela la slide
2. **CS1** — aggiungi barre blu 4px in cima e in fondo (`height:1080px`, `position:absolute` inline)
3. **FDT** — applica font titolo `h1`: `clamp(28px,3vw,44px)` · `weight:520` · `ls:-.05em` · `lh:1` · `color:#b5c9c1`
4. **FD1** — applica font voci principali: `clamp(24px,2.175vw,31.5px)` · `weight:700` · `color:#b5c9c1` · `lh:1.55`
5. **FD2** — applica font sottotitoli: `clamp(17.3px,1.566vw,22.7px)` · `color:#b5c9c1` · `lh:1.55`
6. **CONG** — ricongela la slide

---

## Convenzione VidPlus

Quando l'utente scrive **VidPlus**, significa: applicare su `20 · companySetup` il comportamento di blocco zoom attuale — intercettare `cmd+`/`cmd-`/`cmd=`/`cmd+0` (e varianti `ctrl`) via `useEffect` + `keydown`, `e.preventDefault()`, e mostrare un popup modale di conferma con **Annulla** e **Continua comunque**.

Il popup è in `position:fixed`, `zIndex:9999`, sfondo `rgba(7,18,15,.82)`, card con bordo `rgba(57,239,180,.3)`, bilingue `it`/`en`.

---

## Convenzione layout HF

Quando l'utente scrive **HF**, significa: applicare il profilo viewport di **Missione 01 — Fotografia attuale**. La slide deve rimanere interamente visibile nello schermo, senza scroll verticale, scrollbar o overflow; mantenere il font leggibile e ridurre prima spaziature, padding e altezza degli elementi quando necessario.

## Convenzione font FD

Quando l'utente scrive **FD**, significa: applicare alla frase indicata il font della classe `.intro` dell'onboarding screen ("Ogni dato cambia la storia"):
- `font-size: clamp(16px, 1.45vw, 21px)` (base)
- Override presentazione: `clamp(28px, 2.2vw, 34px)`
- `color: #b5c9c1`
- `line-height: 1.55`
- Font di sistema ereditato (nessun font-family esplicito)

## Convenzione CS1

Quando l'utente scrive **CS1**, significa: inserire una riga blu di riferimento in cima e una in fondo alla slide. Le barre sono nel **flusso flex** del `<main>`. Il `<main>` deve avere **altezza fissa in pixel** (non `vh`) pari alla risoluzione target — così quando l'utente zooma il contenuto supera l'altezza fissa e la barra inferiore esce dal basso.

- Zoom corretto → entrambe le barre visibili ai bordi
- Zoom troppo alto → barra inferiore esce fuori dal basso
- Zoom troppo basso → spazio sotto la barra inferiore

CSS (`.welcomeScreen` usa `height:1080px` — Full HD target):
```css
.welcomeScreen{height:1080px;overflow:hidden;...}
.welcomeBlueBar{height:4px;background:#3b82f4;flex-shrink:0;width:100%;position:relative;z-index:10}
```

JSX: primo e ultimo figlio del `<main>`:
```jsx
<div className="welcomeBlueBar"/>
/* ... contenuto ... */
<div className="welcomeBlueBar"/>
```

## Convenzione CONG

Quando l'utente scrive **CONG** seguito dal nome di una slide, quella slide è **congelata**: non verrà modificata in nessun caso senza un'esplicita richiesta di scongelare da parte dell'utente.
Quando l'utente scrive **SCONG** seguito dal nome della slide, la slide torna modificabile.

### Procedura CONG (da eseguire in sequenza automatica)

1. Segnare la slide come 🔒 nell'elenco "Slide attualmente congelate" in questo README
2. **Barra blu in fondo → verde**: sull'ultima `<div className="welcomeBlueBar"/>` del JSX della slide, aggiungere `style={{background:"#39efb4"}}` per indicare visivamente lo stato congelato
   ```jsx
   <div className="welcomeBlueBar" style={{background:"#39efb4"}}/>
   ```

### Procedura SCONG (da eseguire in sequenza automatica)

1. Rimuovere 🔒 dall'elenco e aggiornare lo stato in README
2. **Ripristinare la barra blu**: rimuovere `style={{background:"#39efb4"}}` dalla barra inferiore

### Slide attualmente congelate
- `App.tsx` → `01 · cover` — "Cover" 🔒
- `ChapterMap.tsx` — `05 · chapterMap` — "La tua esperienza Envizi Quest" 🔒
- `App.tsx` → `03 · onboarding` — "Ogni dato cambia la tua storia" — **NON TOCCARE JSX NÉ CSS** (`.onboarding`, `.onboarding h1`, `.introPanel`, `.choicePanel`) senza SCONG esplicito 🔒
- `App.tsx` → `02 · welcome` — "Benvenuto alla Envizi Quest" — **NON TOCCARE JSX NÉ CSS** (`.welcomeScreen`, `.welcomeTitle`, `.welcomePanel`, `.welcomeSubtitle`, `.welcomeBlueBar`) senza SCONG esplicito 🔒
- `Blank1.tsx` — `08 · blank1` — "La presentazione Envizi" 🔒 *(VidPlus + barra verde)*
- `App.tsx` → `04 · approach` — "People & Data" 🔒
- `ChallengeScreens.tsx` → `06 · sectionIntro1` — "Il percorso Envizi Quest" 🔒
- `ChallengeScreens.tsx` → `sectionIntro2` — "Obiettivi e dati" 🔒 *(VidPlus integrato nel componente, prop frozen)*
- `QuestIntro.tsx` → `07 · questIntro` — "Introduzione al Quest" 🔒

- `ApproachScreens.tsx` → `10 · approachIntro` — "Il percorso" 🔒 *(VidPlus applicato)*
- `ApproachScreens.tsx` → `11 · approachReport` — "Porta con te il risultato" 🔒 *(VidPlus applicato)*
- `App.tsx` → `17 · intro` — "Guadagna la fiducia" 🔒 *(VidPlus applicato)*
- `App.tsx` → `18 · separatorNext` — "Partiamo dagli obiettivi" 🔒
- `App.tsx` → `19 · approachStepsCopy` — "Il percorso" (step 1 obiettivi) 🔒
- `CompanyScreens.tsx` → `20 · companySetup` — "La tua azienda" 🔒
- `CompanyScreens.tsx` → `21 · company` — "Company Profile" 🔒
- `PriorityScreens.tsx` → `22 · priorities` — "Business Priorities" 🔒
- `PriorityScreens.tsx` → `23 · approachDataCopy` — "I dati al centro" 🔒
- `PriorityScreens.tsx` → `24 · priorityData` — "Data Needs" 🔒 *(ricongelata)*
- `PriorityScreens.tsx` → `25 · priorityMatrix` — "Priority Matrix" 🔒
- `App.tsx` → `26 · chapterOneSummary` — "Il tuo report iniziale" 🔒 *(schema Blank1: SummarySlide in flex:1, nav+download fuori)*
- `App.tsx` → `28 · esgStrategist` — "ESG Strategist" 🔒

---

## ⚠️ SCALING FISSO — NON TOCCARE MAI

Il file `src/main.tsx` contiene uno scaling fisso basato su `screen.height`. **Non modificare mai questa logica.**

```ts
function applyScale() {
  const scale = screen.height / 1080;
  const root = document.getElementById("root") as HTMLElement;
  root.style.transform = `scale(${scale})`;
  root.style.transformOrigin = "top left";
  root.style.width = `${(1 / scale) * 100}vw`;
  root.style.height = "1080px";
  root.style.overflow = "hidden";
}
applyScale();
```

**Perché funziona:**
- `screen.height` = altezza fisica del monitor — **non cambia mai** con Cmd+/- del browser
- Su Full HD (1080px) → `scale = 1`, nessuna trasformazione
- Su schermi più piccoli → scala proporzionalmente
- Cmd+/- del browser non tocca `screen.height` → layout sempre stabile

**Non sostituire mai** `screen.height` con `window.innerHeight`, `visualViewport`, o altri valori che cambiano con lo zoom del browser. Quella strada è già stata percorsa e non funziona.

## Risoluzione target

**1080px Full HD** — tutte le slide usano questa come riferimento. Lo scaling in `main.tsx` adatta automaticamente schermi di dimensioni diverse.
