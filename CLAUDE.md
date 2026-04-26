# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Commands

```bash
npm start          # dev server (http://localhost:3000)
npm run build      # production build
npm test           # run tests (CRA Jest)
```

Requires a `.env` file (or environment variable) with:
```
REACT_APP_ANTHROPIC_API_KEY=sk-ant-...
```

Deployed to Vercel (project: `sungbin-pharmd`).

## Architecture

This is a single-page React app (Create React App) for 성빈약국 (Sungbin Pharmacy) — a Korean pharmacy medication guidance service. The entire application lives in **`src/App.jsx`** (~530 lines). There is no routing library; tab switching is handled by a single `tab` index in `App` state.

**No npm-installed CSS framework.** Tailwind CSS is loaded via CDN in `public/index.html`.

### Tab structure

`App` renders one of four tab components based on `tab` state:
- `HomeTab` — welcome screen with quick links and recent prescriptions
- `PrescriptionTab` — core feature: camera/file upload + 3-step Claude analysis pipeline
- `MyDrugsTab` — view saved prescription history (in-memory, not persisted)
- `ConsultTab` — pharmacy contact info (KakaoTalk channel + phone), with live open/closed status based on KST time

### Prescription analysis pipeline (`PrescriptionTab`)

The main feature calls the Claude API directly from the browser (using the `anthropic-dangerous-direct-browser-access: true` header). Three sequential Claude calls:

1. **Step 1 — Hospital name extraction**: Sends the prescription image, gets `{"hospitalName":"..."}`. Then fuzzy-matches against `HOSPITAL_ALIASES` to find the registered hospital key. Aborts if the hospital is not registered.
2. **Step 2 — Drug matching**: Sends the image + `HOSPITAL_DRUG_TEXT[hospital]` (a pre-formatted text list of that hospital's known drugs with codes), gets matched drug items with dose/frequency/days.
3. **Step 3 — Guidance generation**: Sends the step 2 JSON, gets final `{"drugs":[...],"guidance":"..."}` with patient-friendly medication instructions.

The Claude model is pinned in `CLAUDE_MODEL` at line 3.

### Hospital/drug data structures

All data is hardcoded in `App.jsx`:

- **`HOSPITAL_DB`** — per-hospital array of drug objects: `{code, name, ingredient, spec, amount, category}`
- **`HOSPITAL_ALIASES`** — maps canonical hospital key → array of name fragments used for matching (e.g., `"최숙경안과": ["최숙경", "안과"]`)
- **`HOSPITAL_DRUG_TEXT`** — pre-formatted text version of `HOSPITAL_DB` used in Claude prompts (format: `"코드 약품명 [약효군]\n..."`)

Currently registered hospitals: 김기환이비인후과, 최숙경안과, 구미신경외과, 즐거운치과.

### Adding a new hospital

1. Add an entry to `HOSPITAL_DB` with the drug array.
2. Add an entry to `HOSPITAL_ALIASES` with name fragments.
3. Add an entry to `HOSPITAL_DRUG_TEXT` with the pre-formatted drug list string (must stay in sync with `HOSPITAL_DB`).

### State

All state (`records`, `tab`) is in-memory only — there is no localStorage or backend persistence. Refreshing the page clears all saved prescriptions.
