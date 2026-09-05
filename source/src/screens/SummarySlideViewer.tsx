import React, { useState, useRef } from "react";
import type { SummaryPptxData } from "../generateSummaryPptx";

interface Props {
  data: SummaryPptxData;
  language: "it" | "en";
  onClose?: () => void;
  onSave?: (name: string) => void;
  defaultSaveName?: string;
}

function prioRank(prioItems: SummaryPptxData["prioItems"], name: string, isIt: boolean): string {
  const idx = prioItems.findIndex(it => it.name.toLowerCase() === name.toLowerCase());
  if (idx === -1) return "–";
  return isIt ? `N°${idx + 1}` : `#${idx + 1}`;
}
function prioNote(prioItems: SummaryPptxData["prioItems"], name: string): string {
  return prioItems.find(it => it.name.toLowerCase() === name.toLowerCase())?.note || "";
}

// Container base font = 1.45vw. All sizes in em scale with it.
export function SummarySlideViewer({ data, language, onClose, onSave, defaultSaveName }: Props) {
  const [idx, setIdx] = useState(0);
  const isIt = language === "it";
  const total = 4;
  const slides = [
    <Slide1 data={data} isIt={isIt} />,
    <Slide2 data={data} isIt={isIt} />,
    <Slide3 data={data} isIt={isIt} onSave={onSave} defaultSaveName={defaultSaveName} />,
    <Slide4 data={data} isIt={isIt} />,
  ];

  return (
    <main style={{ background: "#000", display: "grid", gridTemplateRows: "auto 1fr auto", height: "100%", overflow: "hidden" }}>
      <header style={{ display: "flex", alignItems: "center", justifyContent: "space-between", padding: "10px 20px", background: "rgba(0,0,0,.85)", zIndex: 10, flexShrink: 0 }}>
        <span style={{ color: "#39efb4", fontSize: "13px", fontWeight: 700, fontFamily: "monospace" }}>e· Envizi Impact Quest</span>
        <span style={{ color: "#c9e8dc", fontSize: "13px", fontWeight: 700 }}>{idx + 1} / {total}</span>
        <div style={{ display: "flex", gap: "10px", alignItems: "center" }}>
          <button style={{ background: "rgba(57,239,180,.12)", border: "1px solid rgba(57,239,180,.5)", color: "#39efb4", borderRadius: "6px", padding: "12px 32px", fontWeight: 700, cursor: "pointer", fontSize: "22px" }} onClick={async () => {
            const { generateSummaryPptx } = await import("../generateSummaryPptx");
            generateSummaryPptx(data);
          }}>
            ↓ {isIt ? "Scarica sintesi" : "Download summary"}
          </button>
          <button style={{ background: "rgba(57,239,180,.25)", border: "2px solid #39efb4", color: "#39efb4", borderRadius: "6px", padding: "12px 32px", fontWeight: 700, cursor: "pointer", fontSize: "22px" }} onClick={async () => {
            const { generateTemplatePptx } = await import("../generateTemplatePptx");
            generateTemplatePptx(data);
          }}>
            ↓ {isIt ? "Scarica Report" : "Download Report"}
          </button>
          {onClose && (
            <button style={{ background: "transparent", border: "1px solid #39efb4", color: "#39efb4", borderRadius: "4px", padding: "4px 10px", cursor: "pointer", fontSize: "13px" }} onClick={onClose}>
              ✕ {isIt ? "Chiudi" : "Close"}
            </button>
          )}
        </div>
      </header>
      <section style={{ display: "flex", alignItems: "center", justifyContent: "center", overflow: "hidden", background: "#111", padding: "16px" }}>
        <div style={{ width: "100%", maxWidth: "1650px", aspectRatio: "16/9", borderRadius: "4px", overflow: "hidden", boxShadow: "0 4px 40px rgba(0,0,0,.7)", position: "relative", fontSize: "1.45vw" }}>
          {slides[idx]}
        </div>
      </section>
      <footer style={{ display: "flex", alignItems: "center", justifyContent: "center", gap: "24px", padding: "12px 20px", background: "rgba(0,0,0,.85)", flexShrink: 0 }}>
        <button onClick={() => setIdx(i => Math.max(0, i - 1))} disabled={idx === 0}
          style={{ background: "transparent", border: "none", cursor: idx === 0 ? "not-allowed" : "pointer", opacity: idx === 0 ? 0.2 : 1 }}>
          <svg width="36" height="54" viewBox="0 0 36 54"><polygon points="34,2 2,27 34,52" fill="white" /></svg>
        </button>
        <div style={{ display: "flex", gap: "6px" }}>
          {Array.from({ length: total }).map((_, i) => (
            <span key={i} onClick={() => setIdx(i)} style={{ width: "8px", height: "8px", borderRadius: "50%", background: i === idx ? "#39efb4" : "#3a6a58", border: i === idx ? "none" : "1px solid #39efb4", cursor: "pointer", display: "inline-block" }} />
          ))}
        </div>
        <button onClick={() => setIdx(i => Math.min(total - 1, i + 1))} disabled={idx === total - 1}
          style={{ background: "transparent", border: "none", cursor: idx === total - 1 ? "not-allowed" : "pointer", opacity: idx === total - 1 ? 0.2 : 1 }}>
          <svg width="36" height="54" viewBox="0 0 36 54"><polygon points="2,2 34,27 2,52" fill="white" /></svg>
        </button>
      </footer>
    </main>
  );
}

// ── SLIDE 1 ───────────────────────────────────────────────────────────────────
function Slide1({ data, isIt }: { data: SummaryPptxData; isIt: boolean }) {
  const year = new Date().getFullYear();
  const wDate = (data as any).workshopDate as string | undefined;
  const dateStr = wDate
    ? new Date(wDate).toLocaleDateString(isIt ? "it-IT" : "en-GB", { day: "2-digit", month: "long", year: "numeric" })
    : isIt ? "data da definire" : "date TBD";
  const consultant = ((data as any).consultantName as string | undefined) || "IBM Envizi Team";
  const logo = (data as any).companyLogo as string | undefined;

  return (
    <div style={{ width: "100%", height: "100%", position: "relative", overflow: "hidden", fontFamily: "Calibri, Arial, sans-serif", background: "#fff" }}>
      <img src="./p11-bg-slide1.png" alt="" style={{ position: "absolute", inset: 0, width: "100%", height: "100%", objectFit: "cover" }} />
      <div style={{ position: "absolute", inset: 0, background: "linear-gradient(to right, #fff 42%, rgba(255,255,255,0) 65%)" }} />
      <div style={{ position: "absolute", top: 0, left: 0, width: "50%", height: "100%", display: "flex", flexDirection: "column", justifyContent: "center", padding: "0 5%" }}>
        {/* IBM Envizi badge */}
        <div style={{ background: "#0d3a2a", display: "inline-block", padding: "0.18em 0.6em", marginBottom: "0.9em", alignSelf: "flex-start" }}>
          <span style={{ color: "#fff", fontSize: "0.82em", fontWeight: 700, letterSpacing: "0.02em" }}>IBM Envizi</span>
        </div>
        {/* Title */}
        <div style={{ color: "#0d3a2a", fontSize: "2.4em", fontWeight: 400, lineHeight: 1.15, marginBottom: "0.8em" }}>
          {isIt ? "Il percorso ESG" : "The ESG journey"}<br />
          {isIt ? "di" : "of"}<br />
          <strong style={{ fontWeight: 700 }}>{data.companyName}</strong>
        </div>
        {/* Workshop info */}
        <div style={{ color: "#1a3a2a", fontSize: "0.82em", lineHeight: 1.75 }}>
          <div>{isIt ? "Sintesi workshop Envizi Quest" : "Envizi Quest workshop summary"}</div>
          <div>{dateStr} · Workshop</div>
          <div>{consultant} · IBM Envizi</div>
        </div>
        {/* Year */}
        <div style={{ position: "absolute", bottom: "5%", left: "5%", color: "#3a6a50", fontSize: "0.55em" }}>
          {isIt ? "Incontro di lavoro" : "Working session"} · {year}
        </div>
        {/* Company logo */}
        {logo && (
          <img src={logo} alt="logo" style={{ position: "absolute", bottom: "5%", right: "2%", maxHeight: "7%", maxWidth: "18%", objectFit: "contain", opacity: 0.9 }} />
        )}
      </div>
      <Brand />
    </div>
  );
}

// ── SLIDE 2 ───────────────────────────────────────────────────────────────────
function Slide2({ data, isIt }: { data: SummaryPptxData; isIt: boolean }) {
  const geo = (data as any).geoDistrib as Record<string, number> | undefined;
  const geoRows = [
    { label: "Italia",     val: geo?.italia      ?? 0 },
    { label: "Europa",     val: geo?.europa      ?? 0 },
    { label: "N. America", val: geo?.nordamerica ?? 0 },
    { label: "Asia",       val: geo?.asia        ?? 0 },
    { label: "Africa",     val: geo?.africa      ?? 0 },
  ].filter(g => g.val > 0);

  const dc = (data as any).dataCenters as number | undefined ?? 0;
  const totalSedi = data.plants + data.offices + dc;
  const isCsrd    = data.csrdLabel.startsWith("Soggett") || data.csrdLabel.startsWith("Subject");
  const year      = new Date().getFullYear();
  const csrdStatus = isCsrd ? (isIt ? "DENTRO il" : "WITHIN the") : (isIt ? "FUORI dal" : "OUTSIDE the");

  return (
    <div style={{ width: "100%", height: "100%", background: "#fff", fontFamily: "Calibri, Arial, sans-serif", display: "flex", flexDirection: "column" }}>
      {/* Title bar — full width dark green */}
      <div style={{ background: "#0d3a2a", padding: "0.42em 1em", flexShrink: 0 }}>
        <span style={{ color: "#fff", fontSize: "1.4em", fontWeight: 400 }}>
          {data.companyName} · {data.maturityTitle}
        </span>
      </div>

      {/* Body 2-col */}
      <div style={{ flex: 1, display: "grid", gridTemplateColumns: "1fr 1fr", columnGap: "1.2em", rowGap: 0, padding: "0.9em 1em", overflow: "hidden", minHeight: 0 }}>

        {/* LEFT col */}
        <div style={{ display: "flex", flexDirection: "column", gap: "0.6em", overflow: "hidden" }}>
          {/* Description */}
          <div style={{ fontSize: "0.78em", color: "#0d3a2a", lineHeight: 1.5 }}>
            <strong>{data.companyName}</strong>
            {isIt
              ? ` è un ${data.sectorLabel} presente principalmente in ${data.marketLabel}.`
              : ` is a ${data.sectorLabel} operating mainly in ${data.marketLabel}.`}
            {" "}
            {isIt
              ? `Nell'anno ${year} ha registrato ${data.revenue} ${data.dimUnit} · ${data.employees.toLocaleString()} dipendenti.`
              : `In ${year} it recorded ${data.revenue} ${data.dimUnit} · ${data.employees.toLocaleString()} employees.`}
          </div>

          {/* CSRD card */}
          <div style={{ border: "1px solid #b0c8b8", borderRadius: "5px", padding: "0.5em 0.7em", background: "#fff" }}>
            <div style={{ fontSize: "0.78em", color: "#0d3a2a", lineHeight: 1.4 }}>
              {isIt ? "Indicativamente " : "Indicatively "}
              <strong>{csrdStatus}</strong>
              {isIt ? " perimetro CSRD" : " CSRD scope"}
            </div>
            <div style={{ fontSize: "0.65em", color: "#3a6a50", marginTop: "0.25em", lineHeight: 1.4 }}>
              {isIt
                ? "Valutazione da verificare considerando perimetro societario, consolidamento e fatturato netto."
                : "Assessment to be verified considering corporate scope, consolidation and net revenue."}
            </div>
            {data.csrdNote && (
              <div style={{ fontSize: "0.62em", color: "#3a6a50", fontStyle: "italic", marginTop: "0.2em" }}>✎ {data.csrdNote}</div>
            )}
          </div>

          {/* Org data card */}
          <div style={{ border: "1px solid #b0c8b8", borderRadius: "5px", padding: "0.5em 0.7em", background: "#fff" }}>
            <div style={{ fontSize: "0.65em", fontWeight: 700, color: "#0d3a2a", textTransform: "uppercase", letterSpacing: "0.07em", marginBottom: "0.35em" }}>
              {isIt ? "Dati organizzativi" : "Organisational data"}
            </div>
            {([
              [isIt ? "Sedi totali" : "Total sites", String(totalSedi)],
              [isIt ? "Stabilimenti" : "Plants",     String(data.plants)],
              [isIt ? "Uffici" : "Offices",          String(data.offices)],
              ...(dc > 0 ? [[isIt ? "Data center" : "Data centres", String(dc)]] : []),
            ] as [string, string][]).map(([l, v]) => (
              <div key={l} style={{ display: "flex", justifyContent: "space-between", fontSize: "0.68em", borderBottom: "1px solid #d8ede4", padding: "0.18em 0" }}>
                <span style={{ color: "#3a5a44" }}>{l}</span>
                <strong style={{ color: "#0d3a2a" }}>{v}</strong>
              </div>
            ))}
          </div>
        </div>

        {/* RIGHT col */}
        <div style={{ display: "flex", flexDirection: "column", gap: "0.6em", overflow: "hidden" }}>
          {/* Maturity card */}
          <div style={{ border: "1px solid #b0c8b8", borderRadius: "5px", padding: "0.5em 0.7em", background: "#fff" }}>
            <div style={{ fontSize: "0.65em", fontWeight: 700, color: "#0d3a2a", textTransform: "uppercase", letterSpacing: "0.07em", marginBottom: "0.2em" }}>
              {isIt ? "Maturità ESG" : "ESG Maturity"}
            </div>
            <div style={{ fontSize: "1.05em", fontWeight: 700, color: "#0d3a2a", lineHeight: 1.2, marginBottom: "0.25em" }}>{data.maturityTitle}</div>
            <div style={{ fontSize: "0.68em", color: "#2a5a44", lineHeight: 1.45 }}>{data.maturityDesc}</div>
          </div>

          {/* Geo bars card */}
          {geoRows.length > 0 && (
            <div style={{ border: "1px solid #b0c8b8", borderRadius: "5px", padding: "0.5em 0.7em", background: "#fff", flex: 1, overflow: "hidden" }}>
              <div style={{ fontSize: "0.65em", fontWeight: 700, color: "#0d3a2a", textTransform: "uppercase", letterSpacing: "0.07em", marginBottom: "0.4em" }}>
                {isIt ? "Distribuzione geografica" : "Geographic distribution"}
              </div>
              {geoRows.map(g => (
                <div key={g.label} style={{ display: "flex", alignItems: "center", gap: "0.4em", marginBottom: "0.3em" }}>
                  <span style={{ fontSize: "0.65em", color: "#3a5a44", width: "5em", flexShrink: 0 }}>{g.label}</span>
                  <div style={{ flex: 1, height: "0.5em", background: "#d0e8dc", borderRadius: "2px", overflow: "hidden" }}>
                    <div style={{ width: `${g.val}%`, height: "100%", background: "#0d3a2a", borderRadius: "2px" }} />
                  </div>
                  <span style={{ fontSize: "0.62em", color: "#0d3a2a", fontWeight: 700, width: "2.5em", textAlign: "right" }}>{g.val}%</span>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
      <Brand />
    </div>
  );
}

// ── SLIDE 3 ───────────────────────────────────────────────────────────────────
function Slide3({ data, isIt, onSave, defaultSaveName }: { data: SummaryPptxData; isIt: boolean; onSave?: (name: string) => void; defaultSaveName?: string }) {
  const [saveName, setSaveName] = useState(defaultSaveName || "");
  const [saved, setSaved] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);
  // All 6 known priority keys in fallback order (used only for excluded items)
  const ALL_KEYS = isIt
    ? ["Clienti e gare", "Compliance e reporting", "Accesso al credito", "Efficienza, energia e costi", "Resilienza della supply chain", "Reputazione e attrazione dei talenti"]
    : ["Customers and tenders", "Compliance and reporting", "Access to finance", "Efficiency, energy and cost", "Supply-chain resilience", "Reputation and talent attraction"];

  // Boxes in user priority order: keep the original array order (rank 1→N as passed),
  // no re-sort needed — includedPrios in App.tsx is already in user priority order.
  const includedBoxes = data.prioItems
    .map(it => ({ name: it.name, rank: it.rank, note: it.note || "", included: true }));
  const includedNames = new Set(includedBoxes.map(b => b.name));
  const excludedBoxes = ALL_KEYS
    .filter(k => !includedNames.has(k))
    .map(k => ({ name: k, rank: 0, note: "", included: false }));
  const boxes = [...includedBoxes, ...excludedBoxes].slice(0, 6);

  return (
    <div style={{ width: "100%", height: "100%", position: "relative", overflow: "hidden", fontFamily: "Calibri, Arial, sans-serif" }}>
      {/* background: cropped 27% top+bottom */}
      <img src="./p11-bg-slide3.png" alt=""
        style={{ position: "absolute", left: 0, right: 0, top: "-27%", width: "100%", height: "154%", objectFit: "cover", objectPosition: "center" }} />
      {/* light scrim — keep image visible like in PPTX */}
      <div style={{ position: "absolute", inset: 0, background: "rgba(255,255,255,0.55)" }} />

      <div style={{ position: "relative", zIndex: 1, display: "flex", flexDirection: "column", height: "100%", padding: "0.6em 0.85em" }}>
        {/* Title bar */}
        <div style={{ background: "#0d3a2a", padding: "0.32em 0.7em", marginBottom: "0.28em", flexShrink: 0 }}>
          <span style={{ color: "#fff", fontSize: "0.85em", fontWeight: 400 }}>
            {data.companyName}{" "}
            {isIt
              ? "ha identificato i seguenti obiettivi di business prioritari per ESG reporting"
              : "has identified the following priority business objectives for ESG reporting"}
          </span>
        </div>
        {/* Subtitle */}
        <div style={{ fontSize: "0.62em", color: "#1a4a30", marginBottom: "0.4em", flexShrink: 0 }}>
          {isIt ? "Dati e segnali di scenario per orientare le scelte" : "Data and scenario signals to guide decisions"}
        </div>

        {/* 3×2 grid — box[0]=rank1 top-left … box[5]=rank6 bottom-right */}
        <div style={{ flex: 1, display: "grid", gridTemplateColumns: "1fr 1fr 1fr", gridTemplateRows: "1fr 1fr", minHeight: 0, gap: "0.5em" }}>
          {boxes.map((box) => (
            <div key={box.name} style={{ display: "flex", flexDirection: "column", minHeight: 0, overflow: "hidden" }}>
              {/* header */}
              <div style={{
                background: box.included ? "#0d3a2a" : "#3a6a58",
                padding: "0.28em 0.5em",
                flexShrink: 0,
              }}>
                <span style={{ fontSize: "0.72em", fontWeight: 700, color: "#fff", overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap", display: "block" }}>
                  {box.included ? `${box.rank}/6` : "–"}{"  "}{box.name}
                </span>
              </div>
              {/* body */}
              <div style={{
                flex: 1,
                background: box.included ? "#173F35" : "#2a5040",
                padding: "0.4em 0.5em",
                overflow: "hidden",
              }}>
                <span style={{ fontSize: "0.65em", color: "#c9e8dc", lineHeight: 1.45, fontStyle: "italic" }}>
                  {box.note}
                </span>
              </div>
            </div>
          ))}
        </div>

        {/* Source */}
        {/* Footer row: fonte + save button */}
        <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginTop: "0.3em", flexShrink: 0 }}>
          <div style={{ fontSize: "0.5em", color: "#1a4a30" }}>
            Fonti: Commissione europea, EBA, IEA, CDP, PwC · dati 2025–26
          </div>
          {onSave && (
            <div style={{ display: "flex", alignItems: "center", gap: "0.35em" }}>
              <input
                ref={inputRef}
                value={saveName}
                onChange={e => { setSaveName(e.target.value); setSaved(false); }}
                placeholder={isIt ? "Nome quest…" : "Quest name…"}
                style={{ fontSize: "0.58em", padding: "0.3em 0.55em", borderRadius: "4px", border: "1px solid #3a6a50", background: "#fff", color: "#0d3a2a", outline: "none", width: "11em" }}
              />
              <button
                disabled={!saveName.trim()}
                onClick={() => { if (saveName.trim()) { onSave(saveName.trim()); setSaved(true); } }}
                style={{ fontSize: "0.58em", padding: "0.3em 0.7em", borderRadius: "4px", border: "none", background: saved ? "#3a9a60" : "#0d3a2a", color: "#fff", cursor: saveName.trim() ? "pointer" : "not-allowed", opacity: saveName.trim() ? 1 : 0.5, fontWeight: 700, whiteSpace: "nowrap" }}
              >
                {saved ? (isIt ? "✓ Salvata" : "✓ Saved") : (isIt ? "💾 Salva quest" : "💾 Save quest")}
              </button>
            </div>
          )}
        </div>
      </div>
      <Brand />
    </div>
  );
}

// ── SLIDE 4 ───────────────────────────────────────────────────────────────────
function Slide4({ data, isIt }: { data: SummaryPptxData; isIt: boolean }) {
  const items = [...data.critItems].sort((a, b) => (b.rel + b.crit) - (a.rel + a.crit));

  return (
    <div style={{ width: "100%", height: "100%", background: "#fff", fontFamily: "Calibri, Arial, sans-serif", display: "flex", flexDirection: "column" }}>
      {/* Title bar */}
      <div style={{ background: "#0d3a2a", padding: "0.42em 1em", flexShrink: 0 }}>
        <span style={{ color: "#fff", fontSize: "1.0em", fontWeight: 400 }}>
          {data.companyName}{" "}
          {isIt
            ? "ha condiviso le principali esigenze a supporto degli obiettivi di business su cui intervenire"
            : "shared the main data needs supporting the business objectives to address"}
        </span>
      </div>

      {/* Body: list left + matrix right */}
      <div style={{ flex: 1, display: "grid", gridTemplateColumns: "1fr 2fr", gap: "0.8em", padding: "0.7em 1em", minHeight: 0, overflow: "hidden" }}>

        {/* List */}
        <div style={{ display: "flex", flexDirection: "column", overflow: "hidden" }}>
          <div style={{ fontSize: "0.72em", fontWeight: 700, color: "#0d3a2a", marginBottom: "0.4em" }}>
            {isIt ? "Elementi valutati per rilevanza e criticità:" : "Elements assessed by relevance and criticality:"}
          </div>
          <div style={{ display: "flex", flexDirection: "column", gap: "0.2em", overflow: "hidden" }}>
            {items.map(item => (
              <div key={item.rank} style={{ display: "flex", alignItems: "baseline", gap: "0.35em", border: "1px solid #c0d8c8", borderRadius: "3px", padding: "0.18em 0.45em", background: "#fff" }}>
                <span style={{ fontWeight: 700, fontSize: "0.7em", color: "#0d3a2a", flexShrink: 0, minWidth: "1.3em" }}>{item.rank}.</span>
                <span style={{ fontSize: "0.65em", color: "#1a3a2a", overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap", flex: 1 }}>{item.label}</span>
                <span style={{ fontSize: "0.58em", color: "#3a7050", flexShrink: 0 }}>R:{item.rel} C:{item.crit}</span>
              </div>
            ))}
          </div>
        </div>

        {/* Matrix */}
        <MatrixSVG items={items} isIt={isIt} />
      </div>
      <Brand />
    </div>
  );
}

// ── Matrix SVG ────────────────────────────────────────────────────────────────
function MatrixSVG({ items, isIt }: { items: SummaryPptxData["critItems"]; isIt: boolean }) {
  const L = 9, B = 8, T = 2, R = 1;
  const pw = 100 - L - R, ph = 100 - T - B;
  const mx = L + pw / 2, my = T + ph / 2;
  const xOf = (v: number) => L + ((v - 1) / 9) * pw;
  const yOf = (v: number) => T + ph - ((v - 1) / 9) * ph;

  // quadrants matching PPTX screenshot: top-left=Mantenere, top-right=Trasformare, bottom-left=Monitorare, bottom-right=Migliorare
  const quads = [
    { x: L,  y: T,  w: mx-L,    h: my-T,    fill: "#dceee5", label: isIt ? "Mantenere"   : "Maintain",  lx: L+(mx-L)*0.5,     ly: T+(my-T)*0.18 },
    { x: mx, y: T,  w: L+pw-mx, h: my-T,    fill: "#c5e0d2", label: isIt ? "Trasformare" : "Transform", lx: mx+(L+pw-mx)*0.5, ly: T+(my-T)*0.18 },
    { x: L,  y: my, w: mx-L,    h: T+ph-my, fill: "#e8f5ee", label: isIt ? "Monitorare"  : "Monitor",   lx: L+(mx-L)*0.5,     ly: my+(T+ph-my)*0.82 },
    { x: mx, y: my, w: L+pw-mx, h: T+ph-my, fill: "#d5eadf", label: isIt ? "Migliorare"  : "Improve",   lx: mx+(L+pw-mx)*0.5, ly: my+(T+ph-my)*0.82 },
  ];

  return (
    <svg viewBox="0 0 100 100" style={{ width: "100%", height: "100%", display: "block" }} preserveAspectRatio="xMidYMid meet">
      {/* quadrant fills */}
      {quads.map((q, i) => (
        <g key={i}>
          <rect x={q.x} y={q.y} width={q.w} height={q.h} fill={q.fill} />
          <text x={q.lx} y={q.ly} fontSize="3.8" fill="#3a6a50" textAnchor="middle" fontFamily="Calibri,Arial,sans-serif">{q.label}</text>
        </g>
      ))}
      {/* border around full plot area */}
      <rect x={L} y={T} width={pw} height={ph} fill="none" stroke="#8ab5a0" strokeWidth="0.3" />
      {/* mid dividers */}
      <line x1={L}  y1={my} x2={L+pw} y2={my} stroke="#8ab5a0" strokeWidth="0.5" strokeDasharray="2,1.5" />
      <line x1={mx} y1={T}  x2={mx}   y2={T+ph} stroke="#8ab5a0" strokeWidth="0.5" strokeDasharray="2,1.5" />
      {/* axes */}
      <line x1={L} y1={T}    x2={L}    y2={T+ph+1} stroke="#0d3a2a" strokeWidth="0.5" />
      <line x1={L} y1={T+ph} x2={L+pw} y2={T+ph}   stroke="#0d3a2a" strokeWidth="0.5" />
      {/* axis labels */}
      <text x={L+pw/2} y={99.5} fontSize="3.4" fill="#0d3a2a" textAnchor="middle" fontWeight="bold" fontFamily="Calibri,Arial,sans-serif">
        R – {isIt ? "Rilevanza" : "Relevance"}
      </text>
      <text x={2.5} y={T+ph/2} fontSize="3.4" fill="#0d3a2a" textAnchor="middle" fontWeight="bold" fontFamily="Calibri,Arial,sans-serif"
        transform={`rotate(-90,2.5,${T+ph/2})`}>
        C – {isIt ? "Criticità" : "Criticality"}
      </text>
      {/* scale: 1, 5, 10 */}
      {[1, 5, 10].map(v => (
        <g key={v}>
          <text x={xOf(v)}  y={T+ph+3.0} fontSize="2.8" fill="#3a6a50" textAnchor="middle" fontFamily="Calibri,Arial,sans-serif">{v}</text>
          <text x={L-0.8} y={yOf(v)+1.0} fontSize="2.8" fill="#3a6a50" textAnchor="end"    fontFamily="Calibri,Arial,sans-serif">{v}</text>
        </g>
      ))}
      {/* data points */}
      {items.map(item => (
        <g key={item.rank}>
          <circle cx={xOf(item.rel)} cy={yOf(item.crit)} r="4.2" fill="#0d3a2a" />
          <text x={xOf(item.rel)} y={yOf(item.crit)+1.4} fontSize="2.9" fill="#fff" textAnchor="middle" fontWeight="bold" fontFamily="Calibri,Arial,sans-serif">
            {item.rank}
          </text>
        </g>
      ))}
    </svg>
  );
}

function Brand() {
  return (
    <div style={{ position: "absolute", bottom: "1.2%", right: "1.5%", color: "#3a6a50", fontSize: "0.5em", fontFamily: "Calibri, Arial, sans-serif", opacity: 0.6 }}>
      IBM Envizi Quest
    </div>
  );
}
