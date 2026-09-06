import { useState, useEffect } from "react";
import type { Screen } from "../types";
import type { CommonProps } from "./types";

// Dati fissi per ogni missione (indice 0–5)
const MISSION_DATA: { labelIt: string; labelEn: string; subIt: string; subEn: string; screen: Screen }[] = [
  { labelIt: "Fabbrica dati ESG",      labelEn: "ESG data factory",       subIt: "Baseline ESG e qualità dei dati",            subEn: "ESG baseline and data quality",              screen: "challengeSeparator1" },
  { labelIt: "Energia",                labelEn: "Energy",                 subIt: "Consumi, anomalie e costi operativi",        subEn: "Consumption, anomalies and operating cost",  screen: "challengeSeparator2" },
  { labelIt: "Supply Chain",           labelEn: "Supply Chain",           subIt: "Fornitori, acquisti e catena del valore",    subEn: "Suppliers, procurement and value chain",     screen: "challengeSeparator3" },
  { labelIt: "Reporting e Scope 1-2-3",labelEn: "Reporting & Scope 1-2-3",subIt: "GHG reporting, workflow e dashboard",       subEn: "GHG reporting, workflows and dashboards",    screen: "challengeSeparator4" },
  { labelIt: "Pianificazione Net Zero", labelEn: "Net Zero Planning",      subIt: "Scenari, investimenti e decarbonizzazione",  subEn: "Scenarios, investment and decarbonisation",  screen: "challengeSeparator5" },
  { labelIt: "Framework ESG",          labelEn: "ESG Frameworks",         subIt: "CSRD, ESRS, GRI, SASB, CDP",                subEn: "CSRD, ESRS, GRI, SASB, CDP",                 screen: "challengeSeparator6" },
];

// Sezioni fisse (intro + outro)
const FIXED_TOP: { num: string; labelIt: string; labelEn: string; subIt: string; subEn: string; screen: Screen }[] = [
  { num: "①", labelIt: "Introduzione",               labelEn: "Introduction",              subIt: "Come funziona il Quest",                    subEn: "How the Quest works",                      screen: "sectionIntro1" },
  { num: "②", labelIt: "Obiettivi della tua azienda", labelEn: "Your company's objectives", subIt: "Profilo azienda e priorità ESG",             subEn: "Company profile and ESG priorities",       screen: "sectionIntro2" },
  { num: "③", labelIt: "Sfide di dati",               labelEn: "Data challenges",           subIt: "Esigenze, criticità e matrice di priorità",  subEn: "Needs, criticalities and priority matrix", screen: "sectionIntro3" },
];

const FIXED_BOTTOM: { num: string; labelIt: string; labelEn: string; subIt: string; subEn: string; screen: Screen }[] = [
  { num: "✓", labelIt: "Prossimi passi", labelEn: "Next steps", subIt: "Demo, PoC e Business Value Assessment", subEn: "Demo, PoC and Business Value Assessment", screen: "sectionOutro" },
];

interface Props extends CommonProps {
  name: string;
  missionOrder: number[];
  missionOutcomes: Record<number, string>;
  trustScore: number;
  companyDone?: boolean;
  dataDone?: boolean;
}

export function ChapterMap({ language, profile, setLanguage, setScreen, reset, renderTrustBar, name, missionOrder, missionOutcomes, trustScore, companyDone, dataDone }: Props) {
  const isIt = language === "it";
  const [zoomWarnOpen,setZoomWarnOpen]=useState(false);
  useEffect(()=>{
    const handler=(e:KeyboardEvent)=>{
      const mod=e.metaKey||e.ctrlKey;
      if(!mod)return;
      if(e.key==="+"||e.key==="="||e.key==="-"||e.key==="0"){e.preventDefault();setZoomWarnOpen(true);}
    };
    window.addEventListener("keydown",handler);
    return ()=>window.removeEventListener("keydown",handler);
  },[]);

  // Stato per Sezione ② (Obiettivi della tua azienda)
  const isCompanyCompleted = !!companyDone;
  const isCompanyInProgress = !isCompanyCompleted; // Se non ancora completata, è il primo step attivo della roadmap
  const companyStatusType: "completed" | "inProgress" | "notStarted" = isCompanyCompleted ? "completed" : "inProgress";
  const companyStatusLabel = isCompanyCompleted ? (isIt ? "Completata" : "Completed") : (isIt ? "In corso" : "In progress");

  // Stato per Sezione ③ (Sfide di dati)
  const isDataCompleted = !!dataDone;
  const isDataInProgress = !isDataCompleted && isCompanyCompleted;
  const dataStatusType: "completed" | "inProgress" | "notStarted" = isDataCompleted ? "completed" : isDataInProgress ? "inProgress" : "notStarted";
  const dataStatusLabel = isDataCompleted ? (isIt ? "Completata" : "Completed") : isDataInProgress ? (isIt ? "In corso" : "In progress") : (isIt ? "Non iniziata" : "Not started");

  const fixedTopSections = [
    { num: "①", labelIt: "Introduzione",               labelEn: "Introduction",              subIt: "Come funziona il Quest",                    subEn: "How the Quest works",                      screen: "sectionIntro1" as Screen },
    { num: "②", labelIt: "Obiettivi della tua azienda", labelEn: "Your company's objectives", subIt: "Profilo azienda e priorità ESG",             subEn: "Company profile and ESG priorities",       screen: "sectionIntro2" as Screen, statusType: companyStatusType, statusLabel: companyStatusLabel },
    { num: "③", labelIt: "Sfide di dati",               labelEn: "Data challenges",           subIt: "Esigenze, criticità e matrice di priorità",  subEn: "Needs, criticalities and priority matrix", screen: "sectionIntro3" as Screen, statusType: dataStatusType, statusLabel: dataStatusLabel },
  ];

  // Sfide nell'ordine corretto: il routing segue la posizione mostrata nell'indice.
  const firstUncompletedIndex = missionOrder.findIndex(idx => missionOutcomes[idx] == null);
  const hasAnyCompleted = Object.keys(missionOutcomes).length > 0;

  const missionSections = missionOrder.map((mi, pos) => {
    const isCompleted = missionOutcomes[mi] != null;
    // Se la sezione dati è completata, la prima missione non completata è "In corso", altrimenti "Non iniziata" (o in corso se si è già partiti con le missioni)
    const isInProgress = !isCompleted && ((hasAnyCompleted || isDataCompleted) ? pos === firstUncompletedIndex : false);

    let statusType: "completed" | "inProgress" | "notStarted" = "notStarted";
    let statusLabel = isIt ? "Non iniziata" : "Not started";

    if (isCompleted) {
      statusType = "completed";
      statusLabel = isIt ? "Completata" : "Completed";
    } else if (isInProgress) {
      statusType = "inProgress";
      statusLabel = isIt ? "In corso" : "In progress";
    }

    return {
      num: `M${pos + 1}`,
      labelIt: MISSION_DATA[mi].labelIt,
      labelEn: MISSION_DATA[mi].labelEn,
      subIt: MISSION_DATA[mi].subIt,
      subEn: MISSION_DATA[mi].subEn,
      screen: `challengeSeparator${pos + 1}` as Screen,
      statusType,
      statusLabel,
    };
  });

  const allSections = [...fixedTopSections, ...missionSections, ...FIXED_BOTTOM];

  return (
    <main style={{ display: "flex", flexDirection: "column", height: "100dvh", background: "var(--bg)", overflow: "hidden", position: "relative" }}>
      {zoomWarnOpen&&<div style={{position:"fixed",inset:0,zIndex:99999,background:"rgba(7,18,15,.82)",display:"flex",alignItems:"center",justifyContent:"center"}} onClick={()=>setZoomWarnOpen(false)}>
        <div style={{background:"#0d1f19",border:"1px solid rgba(57,239,180,.3)",borderRadius:"14px",padding:"28px 32px",maxWidth:"380px",width:"90vw",textAlign:"center",boxShadow:"0 8px 40px rgba(0,0,0,.6)"}} onClick={e=>e.stopPropagation()}>
          <p style={{margin:"0 0 8px",fontSize:"13px",fontFamily:"var(--font-geist-mono,monospace)",letterSpacing:".14em",textTransform:"uppercase",color:"#39efb4"}}>{isIt?"Attenzione":"Warning"}</p>
          <p style={{margin:"0 0 20px",fontSize:"15px",color:"#e8f5ef",lineHeight:1.5}}>{isIt?"Il rapporto di visualizzazione è ottimizzato per questa schermata. Sei sicuro di voler cambiare lo zoom?":"The display ratio is optimised for this screen. Are you sure you want to change the zoom?"}</p>
          <div style={{display:"flex",gap:"10px",justifyContent:"center"}}>
            <button style={{padding:"8px 22px",borderRadius:"8px",border:"1px solid rgba(57,239,180,.35)",background:"transparent",color:"#39efb4",fontSize:"14px",cursor:"pointer",fontFamily:"inherit"}} onClick={()=>setZoomWarnOpen(false)}>{isIt?"Annulla":"Cancel"}</button>
            <button style={{padding:"8px 22px",borderRadius:"8px",border:"1px solid #c84040",background:"rgba(200,64,64,.12)",color:"#ff8080",fontSize:"14px",cursor:"pointer",fontFamily:"inherit"}} onClick={()=>setZoomWarnOpen(false)}>{isIt?"Continua comunque":"Continue anyway"}</button>
          </div>
        </div>
      </div>}
      <div style={{ position: "fixed", top: 0, left: 0, right: 0, height: "4px", background: "#3b82f4", zIndex: 9999, pointerEvents: "none" }}/>
      <div style={{ position: "fixed", bottom: 0, left: 0, right: 0, height: "4px", background: "#39efb4", zIndex: 9999, pointerEvents: "none" }}/>
      <header className={Object.keys(missionOutcomes).length > 0 ? "missionNav missionNavTrust" : "missionNav"}>
        <button className="brand brandButton" onClick={reset}><span className="brandMark">e·</span><span>Envizi<br/>Impact Quest</span></button>
        <div className="missionProgress"><span className="activeDot"/> {isIt ? "LA TUA ESPERIENZA" : "YOUR EXPERIENCE"}</div>
        {Object.keys(missionOutcomes).length > 0 && renderTrustBar()}
        <button className="langMini" onClick={() => setLanguage(language === "it" ? "en" : "it")}>{language === "it" ? "EN" : "IT"}</button>
      </header>

      <section style={{ flex: 1, display: "flex", flexDirection: "row", alignItems: "stretch", padding: "12px 24px 12px", gap: "24px", overflow: "hidden", boxSizing: "border-box", minHeight: 0 }}>

        {/* colonna sinistra: profilo */}
        <div style={{ flexShrink: 0, width: "180px", display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", gap: "10px" }}>
          <img src={`./characters/${profile}-neutral.png`} alt={name} style={{ width: "160px", height: "160px", objectFit: "contain", borderRadius: "50%", display: "block" }}/>
          <span style={{ fontWeight: 700, fontSize: "16px", textAlign: "center", lineHeight: 1.3 }}>{name}<br/><small style={{ fontWeight: 400, fontSize: "13px", color: "var(--muted)" }}>ESG Manager</small></span>
          {Object.keys(missionOutcomes).length > 0 && (
            <div style={{ display: "flex", flexDirection: "column", gap: "6px", width: "100%", marginTop: "6px" }}>
              <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", padding: "6px 10px", borderRadius: "8px", background: "rgba(57,239,180,.08)", border: "1px solid rgba(57,239,180,.25)" }}>
                <span style={{ fontSize: "11px", color: "#39efb4", opacity: .75, fontFamily: "var(--font-geist-mono,monospace)", textTransform: "uppercase", letterSpacing: ".06em" }}>{isIt ? "Missioni" : "Missions"}</span>
                <span style={{ fontSize: "15px", fontWeight: 700, color: "#39efb4", fontVariantNumeric: "tabular-nums" }}>{Object.keys(missionOutcomes).length}<span style={{ fontWeight: 400, color: "#39efb4", opacity: .6 }}>/6</span></span>
              </div>
              <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", padding: "6px 10px", borderRadius: "8px", background: "rgba(59,130,244,.08)", border: "1px solid rgba(59,130,244,.25)" }}>
                <span style={{ fontSize: "11px", color: "#7dd3fc", opacity: .75, fontFamily: "var(--font-geist-mono,monospace)", textTransform: "uppercase", letterSpacing: ".06em" }}>{isIt ? "Fiducia" : "Trust"}</span>
                <span style={{ fontSize: "15px", fontWeight: 700, color: "#7dd3fc", fontVariantNumeric: "tabular-nums" }}>{trustScore}<span style={{ fontWeight: 400, color: "#7dd3fc", opacity: .6 }}>/100</span></span>
              </div>
            </div>
          )}
        </div>

        {/* colonna destra: titolo + griglia sezioni */}
        <div style={{ flex: 1, display: "flex", flexDirection: "column", gap: "8px", minWidth: 0, overflow: "hidden", minHeight: 0 }}>
          <div style={{ flexShrink: 0 }}>
            <h1 style={{ fontSize: "clamp(28px,3vw,44px)", fontWeight: 520, margin: "0 0 2px", lineHeight: 1, letterSpacing: "-0.05em", color: "#b5c9c1" }}>
              {isIt ? "La tua esperienza Envizi Quest" : "Your Envizi Quest experience"}
            </h1>
            <p style={{ color: "#b5c9c1", fontSize: "clamp(16px,1.45vw,21px)", lineHeight: 1.55, margin: 0 }}>
              {isIt ? "Accedi direttamente alla sezione che ti interessa." : "Access directly the section you want."}
            </p>
          </div>

          {/* griglia sezioni — 5 righe × 2 colonne, occupa tutto lo spazio */}
          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gridTemplateRows: "repeat(5, 1fr)", gap: "5px", flex: 1, minHeight: 0 }}>
            {allSections.map((s) => {
              const item = s as {
                num: string;
                labelIt: string;
                labelEn: string;
                subIt: string;
                subEn: string;
                screen: Screen;
                statusType?: "completed" | "inProgress" | "notStarted";
                statusLabel?: string;
              };

              let badgeBg = "rgba(255,255,255,.06)";
              let badgeBorder = "rgba(255,255,255,.12)";
              let badgeColor = "#7a9b91";
              let badgeDot = "#7a9b91";

              if (item.statusType === "completed") {
                badgeBg = "rgba(57,239,180,.12)";
                badgeBorder = "rgba(57,239,180,.35)";
                badgeColor = "#39efb4";
                badgeDot = "#39efb4";
              } else if (item.statusType === "inProgress") {
                badgeBg = "rgba(125,211,252,.12)";
                badgeBorder = "rgba(125,211,252,.35)";
                badgeColor = "#7dd3fc";
                badgeDot = "#7dd3fc";
              }

              return (
                <button
                  key={item.screen}
                  onClick={() => setScreen(item.screen)}
                  style={{ display: "flex", alignItems: "center", gap: "10px", background: "var(--surface,#1a1a2e)", border: "1px solid rgba(255,255,255,.1)", borderRadius: "10px", padding: "6px 12px", cursor: "pointer", textAlign: "left", transition: "border-color .15s", color: "inherit", overflow: "hidden", minWidth: 0, position: "relative" }}
                  onMouseEnter={e => (e.currentTarget.style.borderColor = "#39efb4")}
                  onMouseLeave={e => (e.currentTarget.style.borderColor = "rgba(255,255,255,.1)")}
                >
                  <span style={{ minWidth: "36px", height: "36px", borderRadius: "50%", border: `2px solid ${item.statusType === "completed" ? "#39efb4" : item.statusType === "inProgress" ? "#7dd3fc" : "rgba(57,239,180,.6)"}`, background: "transparent", color: item.statusType === "inProgress" ? "#7dd3fc" : "#39efb4", fontWeight: 800, fontSize: "clamp(12px,1.2vw,18px)", display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0 }}>
                    {item.num}
                  </span>
                  <div style={{ display: "flex", flexDirection: "column", gap: "1px", minWidth: 0, flex: 1 }}>
                    <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", gap: "8px" }}>
                      <span style={{ fontWeight: 700, fontSize: "clamp(20px,1.8vw,26px)", lineHeight: 1.3, color: "#b5c9c1", whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis" }}>{isIt ? item.labelIt : item.labelEn}</span>
                      {item.statusLabel && (
                        <span style={{ display: "inline-flex", alignItems: "center", gap: "5px", padding: "2px 7px", borderRadius: "999px", background: badgeBg, border: `1px solid ${badgeBorder}`, color: badgeColor, fontSize: "11px", fontWeight: 600, fontFamily: "var(--font-geist-mono,monospace)", textTransform: "uppercase", letterSpacing: ".04em", flexShrink: 0 }}>
                          <span style={{ width: "6px", height: "6px", borderRadius: "50%", background: badgeDot }} />
                          {item.statusLabel}
                        </span>
                      )}
                    </div>
                    <span style={{ fontSize: "clamp(13px,1.15vw,16px)", color: "#7a9b91", lineHeight: 1.35, whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis" }}>{isIt ? item.subIt : item.subEn}</span>
                  </div>
                </button>
              );
            })}
          </div>

          <div style={{ display: "flex", justifyContent: "center", gap: "10px", paddingBottom: "4px", flexShrink: 0 }}>
            <button className="actionButton approachIntroCta" onClick={() => setScreen("blank1")}>{isIt ? "Avanti" : "Next"} <b>→</b></button>
          </div>
        </div>
      </section>
    </main>
  );
}
