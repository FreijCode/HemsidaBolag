# FreijVenture — utvecklingsförslag C

Separat Astro-experiment på `fre-5/norre-development`. Rotens produktionssida ändras inte. GitHub Pages körs bara på main; ingen publicering har startats.

## Kör lokalt

Node 24 användes. `npm ci`, `npm run build`, `npm run portable`, `npx playwright install chromium`, `npm run qa`, `npm run performance`.

Öppna `freijventure-demo.html` direkt eller kör `npm run dev`. Portabel HTML bäddar in foton, typsnitt, CSS och JavaScript. Normal Astro-version självhostar alla tillgångar.

## Vad fungerar

Bilddriven öppning; två klickbara projektvyer; projektfilter; tangentbordsstyrda tjänster och dialoger; Escape och återställt fokus; rörelsepaus; prefers-reduced-motion; ankarnavigation. Kontakt är en demonstrerad väg och skickar inget.

Projektförslagen är fiktiva och inte kundreferenser. Inga kundresultat eller omdömen påstås. Referenser och bildlicenser finns i design.md och asset-register.csv.

## Nästa kvalitetsgrind

Adam bedömer form och bildval. Publicering och inköp kräver separat beslut. Låt inte denna experimentmapp följa med en framtida publicering av main utan granskning.

## Mac-kontroll 10 oktober 2026

Bygg och portabel HTML fungerar med Node 24.21.0. På Mac använder prestandaskriptet installerad Google Chrome. Annan webbläsarsökväg kan anges med CHROME_PATH. Funktionskontroll utan ny film: BROWSER_CHANNEL=chrome SKIP_VIDEO=1 npm run qa.

Bilderna har WebP-varianter för 600 och 1000 px. Källbilder och deras licensuppgifter finns kvar. Den portabla demon bäddar in bilderna och fungerar utan webbserver.

## FRE-7 prestanda

Mobil: 98/98/98, tillgänglighet 100/100/100, LCP cirka 2,26 s. Se qa.md för analys och begränsningar. Stängda dialogers bilder laddas vid behov.
