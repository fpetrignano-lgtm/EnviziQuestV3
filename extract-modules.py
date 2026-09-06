#!/usr/bin/env python3
"""
Estrae la colonna J (MODULI ENVIZI, COME E BENEFICI) da
pscenari-moduli-referenze.xlsx e produce SCENARIO_MODULES per constants.ts.

Uso: python3 envizi-quest-v3/extract-modules.py
"""
import json
import re
import openpyxl

XLSX = "envizi-quest-v3/source/public/pscenari-moduli-referenze.xlsx"
CONSTANTS = "envizi-quest-v3/source/src/constants.ts"

wb = openpyxl.load_workbook(XLSX, data_only=True)
ws = wb["Voci Esaminate"]

# Legge tutte le righe dati (riga 2..211), colonna J (indice 10, 1-based)
col_j_values = []
for row in ws.iter_rows(min_row=2, max_row=211, min_col=10, max_col=10, values_only=True):
    val = row[0]
    # Normalizza newline: sostituisce \n con \\n per compatibilità TypeScript
    raw = str(val).strip() if val is not None else ""
    col_j_values.append(raw.replace("\n", "\\n"))

print(f"# Righe lette: {len(col_j_values)}", flush=True)

# Raggruppa ogni 5 righe consecutive = un needId (42 gruppi totali)
GROUP_SIZE = 5
groups = []
for i in range(0, len(col_j_values), GROUP_SIZE):
    groups.append(col_j_values[i:i+GROUP_SIZE])

print(f"# Gruppi: {len(groups)}", flush=True)

# Legge i needId in ordine da constants.ts
with open(CONSTANTS, "r", encoding="utf-8") as f:
    constants_text = f.read()

needle_ids = re.findall(r'"([a-z]+-\d+)"\s*:', constants_text)
# Deduplica mantenendo l'ordine
seen = set()
need_ids = []
for nid in needle_ids:
    if nid not in seen:
        seen.add(nid)
        need_ids.append(nid)

print(f"# needIds: {len(need_ids)}", flush=True)

if len(need_ids) != len(groups):
    print(f"# ATTENZIONE: {len(need_ids)} needIds vs {len(groups)} gruppi")

# Genera la costante
lines = ["export const SCENARIO_MODULES:Record<string,string[]>={"]
for i, group in enumerate(groups):
    nid = need_ids[i] if i < len(need_ids) else f"unknown-{i}"
    vals = json.dumps(group, ensure_ascii=False)
    # Toglie le parentesi quadre esterne per inserirle nel template
    lines.append(f"  {json.dumps(nid)}:{vals},")
lines.append("};")

print("\n".join(lines))
