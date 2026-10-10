# QA — FRE-7, 10 oktober 2026

## Verifierat resultat
Tre Lighthouse 13.5.0 mobilkörningar med Google Chrome på Mac: prestanda **98/98/98**, tillgänglighet **100/100/100**. LCP **2,257 / 2,263 / 2,255 sekunder**. Inga körfel. Målet minst 90 är uppfyllt. Normal simulerad mobilstrypning används; detta är lokala labbvärden, inte fältdata eller en mätning av framtida drift.

## Faktisk flaskhals
Tidigare rapporter: 81/81/81, LCP cirka 5,1 s, cirka 797 386 överförda byte. Stängda projektdialoger laddade garden.jpg (451 814 byte) och objects.jpg (124 159 byte) direkt. De konkurrerade med LCP-bilden trots att de inte syntes. Rapporterna visar låg faktisk renderingskostnad: cirka 39 ms rendering, 268 ms layout och 0 ms TBT. Observerad lokal LCP var cirka 181 ms; 5,1 s var Lighthouse-modellens mobilvärde.

Projektbilder använder nu befintliga WebP-varianter. Dialogbilder laddas först när de behövs (loading=lazy). Första vyn, bildval, hovring, markörrotation och scrollrörelser behålls. Initial överföring är nu cirka 221 133 byte, cirka 72 % lägre. Mobil-LCP sjunker cirka 56 %. MIME-typen för WebP har också rättats i mätservern.

## Funktionskontroll
Node 24.21.0: bygge och portabel HTML. Chrome-kontroll på 320, 390, 768 och 1440 px. Kontroller omfattar horisontell scroll, ankarlänkar, JavaScript-fel, bildladdning, båda projektdialogerna, projektfilter, Enter/Escape, återställt fokus, tjänsteaccordion, rörelsepaus och reducerad rörelse. Resultat finns i qa-results.json. Nya skärmbilder; ingen ny film.

## Leverans och begränsningar
Källkod, låsfil, bilder, licenser och körskript ingår. Rårapporter finns i separat QA-paket. Portabel HTML kan granskas utan webbserver. Lighthouse mäter byggd HTTP-version; den inbäddade HTML-demon har annan överföringsprofil. Tillgänglighetspoäng ersätter inte manuell skärmläsargranskning. Kontakt är en demo och skickar inget.

Befintlig remote och branch kontrollerade före push. GitHub Pages-workflow startar bara vid push till main eller manuell körning. Endast experiments/freijventure levereras på fre-5/norre-development. Ingen merge, produktionspublicering eller ändring av rotens sida. Adams visuella granskning och ortval ligger kvar på FRE-6.
