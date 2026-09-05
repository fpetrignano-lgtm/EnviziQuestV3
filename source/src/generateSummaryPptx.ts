import PptxGenJS from "pptxgenjs";

// ── palette ──────────────────────────────────────────────────────────────
const BG      = "07110e";
const TEAL    = "39efb4";
const WHITE   = "f2fff9";
const MUTED   = "6a9e88";
const CARD_BG = "0c1e18";
const BORDER  = "1e3a2e";
const W = 10; // slide width inches
const H = 5.625; // slide height inches

function headerBar(slide: PptxGenJS.Slide, companyName: string, pageLabel: string) {
  // dark header strip
  slide.addShape("rect", { x: 0, y: 0, w: W, h: 0.55, fill: { color: "061009" } });
  // teal brand mark
  slide.addText("e· Envizi Impact Quest", {
    x: 0.25, y: 0.09, w: 2.8, h: 0.36,
    fontSize: 10, bold: true, color: TEAL, fontFace: "Courier New",
  });
  // page badge centre
  slide.addText(pageLabel, {
    x: 3.05, y: 0.09, w: 4.2, h: 0.36,
    fontSize: 9, bold: true, color: TEAL, fontFace: "Courier New",
    align: "center", charSpacing: 1.5,
  });
  // company name right
  slide.addText(companyName.toUpperCase(), {
    x: 7.25, y: 0.09, w: 2.5, h: 0.36,
    fontSize: 9, bold: true, color: WHITE, fontFace: "Courier New",
    align: "right",
  });
}

function sectionLabel(slide: PptxGenJS.Slide, text: string, y: number) {
  slide.addText(text.toUpperCase(), {
    x: 0.35, y, w: 9.3, h: 0.22,
    fontSize: 9, bold: true, color: TEAL, fontFace: "Courier New", charSpacing: 2,
  });
}

// ── SLIDE 1: Company profile ──────────────────────────────────────────────
function addSlide1(
  prs: PptxGenJS,
  companyName: string,
  sectorLabel: string,
  marketLabel: string,
  revenue: number,
  dimUnit: string,
  employees: number,
  plants: number,
  offices: number,
  maturityTitle: string,
  maturityDesc: string,
  csrdLabel: string,
  csrdSub: string,
  csrdNote: string,
  isIt: boolean,
) {
  const slide = prs.addSlide();
  slide.background = { color: BG };
  headerBar(slide, companyName, isIt ? "01 · PROFILO AZIENDA" : "01 · COMPANY PROFILE");

  // company name hero — single line, shrinks if too long
  slide.addText(companyName, {
    x: 0.35, y: 0.65, w: 9.3, h: 1,
    fontSize: 44, bold: true, color: WHITE, fontFace: "Arial",
    charSpacing: -1, shrinkText: true, wrap: false,
  });

  // pill tags row
  const tags = [
    sectorLabel,
    marketLabel,
    `${revenue} ${dimUnit}`,
    `${employees.toLocaleString()} ${isIt ? "dipendenti" : "employees"}`,
    ...(plants > 0 ? [`${plants} ${isIt ? "stabilimenti" : "plants"}`] : []),
    ...(offices > 0 ? [`${offices} ${isIt ? "uffici" : "offices"}`] : []),
  ];
  let tx = 0.35;
  const ty = 1.68;
  tags.forEach(tag => {
    const tw = Math.max(0.9, tag.length * 0.085 + 0.28);
    slide.addShape("roundRect", { x: tx, y: ty, w: tw, h: 0.28, fill: { color: "0d2218" }, line: { color: "2a5040", width: 0.75 }, rectRadius: 0.14 });
    slide.addText(tag, { x: tx, y: ty, w: tw, h: 0.28, fontSize: 8.5, bold: true, color: TEAL, fontFace: "Courier New", align: "center" });
    tx += tw + 0.12;
  });

  // maturity block
  slide.addShape("roundRect", { x: 0.35, y: 2.08, w: 9.3, h: 1.38, fill: { color: "0a1c14" }, line: { color: "2a5040", width: 0.75 }, rectRadius: 0.1 });
  sectionLabel(slide, isIt ? "Maturità ESG" : "ESG Maturity", 2.14);
  slide.addText(maturityTitle, {
    x: 0.5, y: 2.36, w: 9.0, h: 0.32,
    fontSize: 14, bold: true, color: WHITE, fontFace: "Arial",
  });
  slide.addText(maturityDesc, {
    x: 0.5, y: 2.7, w: 9.0, h: 0.68,
    fontSize: 11, color: WHITE, fontFace: "Arial", lineSpacingMultiple: 1.25,
  });

  // CSRD badge
  const csrdColor = csrdLabel.startsWith("Soggett") || csrdLabel.startsWith("Subject") ? TEAL : MUTED;
  slide.addShape("roundRect", { x: 0.35, y: 3.57, w: 9.3, h: 0.58, fill: { color: "091510" }, line: { color: csrdColor, width: 0.75 }, rectRadius: 0.1 });
  slide.addText(csrdLabel, { x: 0.55, y: 3.63, w: 6, h: 0.22, fontSize: 11.5, bold: true, color: WHITE, fontFace: "Arial" });
  slide.addText(csrdSub,   { x: 0.55, y: 3.84, w: 8.8, h: 0.22, fontSize: 10,   color: WHITE, fontFace: "Arial" });

  // pre-screening disclaimer (always shown)
  const preScreeningText = isIt
    ? "⚠  Pre-screening indicativo — la valutazione definitiva dipende da struttura di gruppo, localizzazione delle entità e recepimento nazionale della direttiva."
    : "⚠  Indicative pre-screening — the final assessment depends on group structure, entity location and national transposition of the directive.";
  slide.addText(preScreeningText, {
    x: 0.35, y: 4.22, w: 9.3, h: 0.28,
    fontSize: 9, color: MUTED, fontFace: "Arial", italic: true,
  });

  // CSRD note if present
  if (csrdNote) {
    slide.addText(`✎  ${csrdNote}`, {
      x: 0.35, y: 4.56, w: 9.3, h: 0.38,
      fontSize: 10, color: WHITE, fontFace: "Arial", italic: true,
      line: { color: BORDER, width: 0.5 },
    });
  }

}

// ── SLIDE 2: Priority objectives ─────────────────────────────────────────
function addSlide2(
  prs: PptxGenJS,
  companyName: string,
  introText: string,
  items: { rank: number; name: string; detail: string; note?: string }[],
  isIt: boolean,
) {
  const slide = prs.addSlide();
  slide.background = { color: BG };
  headerBar(slide, companyName, isIt ? "02 · OBIETTIVI PRIORITARI" : "02 · PRIORITY OBJECTIVES");

  // intro paragraph — strip html tags
  const plain = introText.replace(/<[^>]+>/g, "");
  slide.addText(plain, {
    x: 0.35, y: 0.65, w: 9.3, h: 0.65,
    fontSize: 10.5, color: "FFFFFF", fontFace: "Arial", lineSpacingMultiple: 1.25,
  });

  // calcola altezza card dinamicamente per riempire lo spazio disponibile
  const startY = 1.36;
  const bottomPad = 0.18;
  const availH = H - startY - bottomPad;           // spazio totale disponibile
  const n = items.length;
  const hasAnyNote = items.some(it => !!it.note);
  const GAP = 0.06;
  const rowH = Math.min(0.78, (availH - GAP * (n - 1)) / n);  // altezza card uniforme

  items.forEach((item, i) => {
    const ry = startY + i * (rowH + GAP);
    const innerPad = rowH * 0.12;
    const nameH = rowH * 0.38;
    const detailH = rowH * 0.30;
    const nameY = ry + innerPad;
    const detailY = nameY + nameH + 0.02;

    slide.addShape("roundRect", { x: 0.35, y: ry, w: 9.3, h: rowH, fill: { color: CARD_BG }, line: { color: BORDER, width: 0.5 }, rectRadius: 0.08 });

    // rank
    slide.addText(String(item.rank).padStart(2, "0"), {
      x: 0.42, y: ry, w: 0.72, h: rowH,
      fontSize: Math.round(rowH * 22), bold: true, color: "FFFFFF", fontFace: "Courier New",
      valign: "middle", align: "left", wrap: false,
    });
    // name
    slide.addText(item.name, {
      x: 1.18, y: nameY, w: 8.22, h: nameH,
      fontSize: 12, bold: true, color: "FFFFFF", fontFace: "Arial", valign: "top",
    });
    // detail
    slide.addText(item.detail, {
      x: 1.18, y: detailY, w: 8.22, h: detailH,
      fontSize: 9.5, color: "FFFFFF", fontFace: "Arial", valign: "top",
    });
    // note — se presente, sotto il detail
    if (item.note && hasAnyNote) {
      slide.addText(`✎  ${item.note}`, {
        x: 1.18, y: detailY + detailH + 0.01, w: 8.1, h: rowH - innerPad - nameH - detailH - 0.03,
        fontSize: 8.5, color: "AACCBB", fontFace: "Arial", italic: true, valign: "top",
      });
    }
  });

}

// ── SLIDE 3: Top 7 critical areas ────────────────────────────────────────
function addSlide3(
  prs: PptxGenJS,
  companyName: string,
  items: { rank: number; label: string; priority: string; rel: number; crit: number; tier: string }[],
  isIt: boolean,
) {
  const slide = prs.addSlide();
  slide.background = { color: BG };
  headerBar(slide, companyName, isIt ? "03 · AREE CRITICHE PRINCIPALI" : "03 · TOP CRITICAL AREAS");

  slide.addText(isIt ? "Ordinate per Rilevanza + Criticità" : "Sorted by Relevance + Criticality", {
    x: 0.35, y: 0.63, w: 9.3, h: 0.28,
    fontSize: 13, color: WHITE, fontFace: "Arial",
  });

  const startY = 1.0;
  const rowH   = 0.62;
  const BAR_X  = 5.6;
  const BAR_MAX_W = 4.0; // max width per bar (10/10)
  const BAR_H  = 0.13;
  const YELLOW = "f5c542";

  items.forEach((item, i) => {
    const ry = startY + i * (rowH + 0.05);
    const relW  = (item.rel  / 10) * BAR_MAX_W;
    const critW = (item.crit / 10) * BAR_MAX_W;

    // card bg
    slide.addShape("roundRect", { x: 0.35, y: ry, w: 9.3, h: rowH, fill: { color: CARD_BG }, line: { color: BORDER, width: 0.5 }, rectRadius: 0.08 });

    // rank
    slide.addText(String(item.rank).padStart(2, "0"), {
      x: 0.44, y: ry + 0.08, w: 0.5, h: rowH - 0.12,
      fontSize: 18, bold: true, color: WHITE, fontFace: "Courier New", valign: "top",
    });

    // label
    slide.addText(item.label, {
      x: 1.0, y: ry + 0.06, w: 4.45, h: 0.26,
      fontSize: 12, bold: true, color: WHITE, fontFace: "Arial",
    });

    // priority tag
    slide.addText(item.priority, {
      x: 1.0, y: ry + 0.34, w: 4.45, h: 0.18,
      fontSize: 8.5, color: MUTED, fontFace: "Courier New",
    });

    // ── Rilevanza bar + label sotto ──
    slide.addShape("rect", { x: BAR_X, y: ry + 0.06, w: BAR_MAX_W, h: BAR_H, fill: { color: "0d2018" }, line: { color: BORDER, width: 0.3 } });
    if (relW > 0) slide.addShape("rect", { x: BAR_X, y: ry + 0.06, w: relW, h: BAR_H, fill: { color: TEAL } });

    // ── Criticità bar + label sotto ──
    slide.addShape("rect", { x: BAR_X, y: ry + 0.24, w: BAR_MAX_W, h: BAR_H, fill: { color: "0d2018" }, line: { color: BORDER, width: 0.3 } });
    if (critW > 0) slide.addShape("rect", { x: BAR_X, y: ry + 0.24, w: critW, h: BAR_H, fill: { color: YELLOW } });

    // ── legenda sotto le due barre ──
    const relLabel  = isIt ? "● RILEVANZA" : "● RELEVANCE";
    const critLabelText = isIt ? "● CRITICITÀ" : "● CRITICALITY";
    slide.addText(`${relLabel} ${item.rel}`, {
      x: BAR_X, y: ry + 0.40, w: BAR_MAX_W / 2, h: 0.14,
      fontSize: 7, bold: true, color: TEAL, fontFace: "Courier New", charSpacing: 0.5,
    });
    slide.addText(`${critLabelText} ${item.crit}`, {
      x: BAR_X + BAR_MAX_W / 2, y: ry + 0.40, w: BAR_MAX_W / 2, h: 0.14,
      fontSize: 7, bold: true, color: YELLOW, fontFace: "Courier New", charSpacing: 0.5,
    });
  });

}

// ── PUBLIC API ────────────────────────────────────────────────────────────
export interface SummaryPptxData {
  companyName: string;
  sectorLabel: string;
  marketLabel: string;
  revenue: number;
  dimUnit: string;
  employees: number;
  plants: number;
  offices: number;
  dataCenters?: number;
  maturityTitle: string;
  maturityDesc: string;
  csrdLabel: string;
  csrdSub: string;
  csrdNote: string;
  prioIntroText: string;
  prioItems: { rank: number; name: string; detail: string; note?: string }[];
  critItems: { rank: number; label: string; priority: string; rel: number; crit: number; tier: string; needId?: string }[];
  isIt: boolean;
  // extra fields used by template PPTX
  geoDistrib?: Record<string, number>;
  siteTable?: Record<string, Record<string, number>>;
  workshopDate?: string;
  consultantName?: string;
  companyLogo?: string;
  participantRole?: string;
  participantCompany?: string;
  businessUnit?: string;
  reportingPath?: 0|1|2|3|4|5;
  needCapabilities?: Record<string, { it: string; en: string }>;
  frameworkChecks?: Record<string, { inUso: boolean; diInteresse: boolean }>;
  revenueYear?: number;
  sustainabilityReportSince?: number | "mai";
}

export function generateSummaryPptx(data: SummaryPptxData) {
  const prs = new PptxGenJS();
  prs.layout = "LAYOUT_WIDE";
  prs.title = `Envizi Impact Quest — ${data.companyName}`;
  prs.author = "IBM Envizi Impact Quest";

  addSlide1(prs, data.companyName, data.sectorLabel, data.marketLabel, data.revenue, data.dimUnit, data.employees, data.plants, data.offices, data.maturityTitle, data.maturityDesc, data.csrdLabel, data.csrdSub, data.csrdNote, data.isIt);
  addSlide2(prs, data.companyName, data.prioIntroText, data.prioItems, data.isIt);
  addSlide3(prs, data.companyName, data.critItems, data.isIt);

  const filename = `Envizi-Summary-${data.companyName.replace(/[^a-zA-Z0-9]/g, "_") || "Export"}.pptx`;
  prs.writeFile({ fileName: filename });
}
