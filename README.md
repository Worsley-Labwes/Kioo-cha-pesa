# Kioo cha Pesa — M-Pesa Statement Decoder

A client-side React + Vite app that decodes M-Pesa SMS messages or statement CSVs into
spending insights: category breakdown, fees paid, top places & people, a daily spending
heatmap, balance over time, and a "money personality".

**Privacy:** everything is parsed in the browser. The app makes no network calls with your data.

## Run it (VS Code / PowerShell)

```powershell
npm install
npm run dev
```

Open http://localhost:5173 and hit **Try sample data** to see it work.

Other commands: `npm run build` (production build into `dist/`), `npm run preview` (serve the build).

## Project layout

```
src/
  App.jsx               page layout, input handling, state
  main.jsx              entry point
  styles.css            all styling (theme tokens, light/dark)
  lib/
    parse.js            parseSMS + parseCSV + catOf (keyword categoriser)
    analyse.js          totals, categories, top places, weekday/day maps
    constants.js        K() formatter, category colours/emoji, personalities
    sample.js           fictional SMS generator for the demo
  components/           Stat, Persona, Fees, Donut, Board, Heat, Spark, Table
  hooks/useCount.js     count-up animation
```

## Easy things to tweak

- **Categories:** edit `catOf` in `src/lib/parse.js` (keyword regexes).
- **Personalities:** edit `P` in `src/lib/constants.js`; the night-owl rule lives in `components/Persona.jsx`.
- **Colours/theme:** CSS variables at the top of `src/styles.css`.

## Known limits / next ideas

- The SMS and CSV parsers are best-effort; real messages vary. If a format isn't picked up,
  tweak the regexes in `parse.js` (paste an example, anonymised, and extend them).
- PDF statements aren't read yet (idea: pdf.js, parsed locally).
- Ideas: month-by-month comparison, budgets/alerts, AI-assisted merchant categorisation
  through a small backend, export to CSV.
