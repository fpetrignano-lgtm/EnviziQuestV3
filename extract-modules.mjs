/**
 * Estrae i valori della colonna J (MODULI ENVIZI, COME E BENEFICI) da
 * pscenari-moduli-referenze.xlsx e produce la costante SCENARIO_MODULES
 * da incollare in constants.ts.
 *
 * Eseguire con:  node extract-modules.mjs
 */
import { readFile } from "node:fs/promises";
import { join, dirname } from "node:path";
import { fileURLToPath } from "node:url";

const __dir = dirname(fileURLToPath(import.meta.url));

// Legge xlsx tramite il modulo già installato nel progetto
const xlsxPath = join(__dir, "source/node_modules/xlsx");
const XLSX = await import(xlsxPath + "/xlsx.mjs").catch(() => import(xlsxPath));

const filePath = join(__dir, "source/public/pscenari-moduli-referenze.xlsx");
const buf = await readFile(filePath);
const wb = XLSX.read(buf, { type: "buffer" });
const ws = wb.Sheets["Voci Esaminate"];
const rows = XLSX.utils.sheet_to_json(ws, { header: 1, defval: "" });

// Colonna B = indice 1 (Voce Esaminata / needId base)
// Colonna I = indice 8 (SCENARIO NARRATIVO — per verifica)
// Colonna J = indice 9 (MODULI ENVIZI, COME E BENEFICI)
// Le righe dati partono da indice 1 (riga 2 Excel)

// Mappa dal testo needId atteso ai dati raggruppati
// Ogni needId ha 5 scenari consecutivi; la voce Esaminata è la stessa per il gruppo
// Costruiamo la mappa: voceName -> array di 5 valori col J (nell'ordine delle righe)

const groups = new Map(); // voceName -> [colJ, ...]

for (let i = 1; i < rows.length; i++) {
  const row = rows[i];
  const voce = String(row[1] ?? "").trim();
  const colJ = String(row[9] ?? "").trim();
  if (!voce) continue;
  if (!groups.has(voce)) groups.set(voce, []);
  groups.get(voce).push(colJ);
}

// Legge USE_CASE_SCENARIOS da constants.ts per mappare voce→needId
const constantsPath = join(__dir, "source/src/constants.ts");
const { readFileSync } = await import("node:fs");
const constantsText = readFileSync(constantsPath, "utf8");

// Estrae le chiavi di USE_CASE_SCENARIOS
const keysMatch = constantsText.match(/USE_CASE_SCENARIOS\s*:\s*Record<[^>]+>\s*=\s*\{([\s\S]*?)^\}/m);

// Approccio semplice: legge la stessa colonna B per costruire il mapping needId
// Poiché USE_CASE_SCENARIOS usa chiavi come "credit-1", dobbiamo estrarre le chiavi direttamente
// Estraiamo tutte le chiavi di USE_CASE_SCENARIOS
const keyRegex = /"([a-z]+-\d+)"\s*:/g;
const needIds = [];
let m;
while ((m = keyRegex.exec(constantsText)) !== null) {
  // Evita duplicati
  if (!needIds.includes(m[1])) needIds.push(m[1]);
}

// Costruisce SCENARIO_MODULES: per ogni needId prende i 5 valori colJ dal gruppo corrispondente
// L'ordine delle voci deve corrispondere all'ordine in USE_CASE_SCENARIOS
// Leggiamo l'ordine delle voci dall'Excel (ogni 5 righe = un needId)
const voceOrder = [];
const seen = new Set();
for (let i = 1; i < rows.length; i++) {
  const voce = String(rows[i][1] ?? "").trim();
  if (voce && !seen.has(voce)) { seen.add(voce); voceOrder.push(voce); }
}

console.log("// SCENARIO_MODULES generato da pscenari-moduli-referenze.xlsx — colonna J");
console.log("export const SCENARIO_MODULES:Record<string,string[]>={");

voceOrder.forEach((voce, idx) => {
  const needId = needIds[idx];
  if (!needId) { console.error(`MANCANTE needId per voce[${idx}]: ${voce}`); return; }
  const vals = groups.get(voce) ?? [];
  const escaped = vals.map(v => JSON.stringify(v));
  console.log(`  ${JSON.stringify(needId)}:[${escaped.join(",")}],`);
});

console.log("};");
