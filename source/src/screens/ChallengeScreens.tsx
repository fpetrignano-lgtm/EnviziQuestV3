import { useState, useEffect } from "react";
import type { Screen } from "../types";
import type { CommonProps } from "./types";

// ── Titoli missioni per i separatori (indicizzati 0-5 come missionOrder) ────

const MISSION_LABELS: Record<number, { it: string; en: string; sub: string; subEn: string }> = {
  0: { it: "La fabbrica dei dati ESG",       en: "The ESG data factory",         sub: "Baseline ESG e qualità dei dati",                  subEn: "ESG baseline and data quality" },
  1: { it: "Energia e decarbonizzazione",     en: "Energy and decarbonization",   sub: "Consumi, anomalie e costi operativi",              subEn: "Consumption, anomalies and operating cost" },
  2: { it: "Supply chain engagement",         en: "Supply chain engagement",      sub: "Fornitori, acquisti e catena del valore",          subEn: "Suppliers, procurement and value chain" },
  3: { it: "Reporting e performance",         en: "Reporting and performance",    sub: "GHG reporting, workflow e dashboard",              subEn: "GHG reporting, workflows and dashboards" },
  4: { it: "La rotta verso Net Zero",         en: "The route to Net Zero",        sub: "Scenari, investimenti e decarbonizzazione",        subEn: "Scenarios, investment and decarbonisation" },
  5: { it: "Framework ESG e disclosure",      en: "ESG frameworks and disclosure",sub: "CSRD, ESRS, GRI, SASB, CDP e requisiti",          subEn: "CSRD, ESRS, GRI, SASB, CDP and requirements" },
};

// ── Shared fullscreen slide style ─────────────────────────────────────────────

const slideStyle: React.CSSProperties = {
  height: "1080px",
  display: "flex",
  flexDirection: "column",
  alignItems: "center",
  justifyContent: "center",
  background: "#07110e",
  position: "relative",
  gap: 0,
  overflow: "hidden",
};

const blueBarTop: React.CSSProperties = {position:"absolute",top:0,left:0,right:0,height:"4px",background:"#3b82f4",zIndex:100,width:"100%"};
const blueBarBot: React.CSSProperties = {position:"absolute",bottom:0,left:0,right:0,height:"4px",background:"#3b82f4",zIndex:100,width:"100%"};

const headerStyle: React.CSSProperties = {
  position: "fixed",
  top: 0,
  left: 0,
  right: 0,
};

// ── ChallengeSeparator ────────────────────────────────────────────────────────

interface SeparatorProps extends CommonProps {
  num: number;       // posizione nella sequenza (1-6), mostrata nel cerchio
  missionIndex: number; // indice reale della missione (0-5), per il titolo
  nextScreen: Screen;
}

function ChallengeSeparator({ language, setLanguage, setScreen, reset, goBack, renderTrustBar, num, missionIndex, nextScreen }: SeparatorProps) {
  const isIt = language === "it";
  const m = MISSION_LABELS[missionIndex];
  return (
    <main style={slideStyle} className="sectionIntroSlide">
      <div style={blueBarTop}/>
      <header className="missionNav" style={headerStyle}>
        <button className="brand brandButton" onClick={reset}><span className="brandMark">e·</span><span>Envizi<br/>Impact Quest</span></button>
        <div className="missionProgress"><span className="activeDot"/> {isIt ? `SFIDA ${num}` : `CHALLENGE ${num}`}</div>
        <button className="langMini" onClick={() => setLanguage(language === "it" ? "en" : "it")}>{language === "it" ? "EN" : "IT"}</button>
      </header>

      {/* cerchio numerato */}
      <div style={{ width: "clamp(140px,20vw,220px)", height: "clamp(140px,20vw,220px)", borderRadius: "50%", border: "4px solid #39efb4", display: "flex", alignItems: "center", justifyContent: "center", marginBottom: "40px", flexShrink: 0 }}>
        <span style={{ fontSize: "clamp(52px,8vw,96px)", fontWeight: 800, color: "#39efb4", lineHeight: 1 }}>{num}</span>
      </div>

      {/* label sezione */}
      <p style={{ margin: "0 0 10px", fontSize: "clamp(11px,1.2vw,14px)", fontWeight: 700, letterSpacing: ".18em", color: "#39efb4", textTransform: "uppercase" }}>
        {isIt ? "SFIDA" : "CHALLENGE"} {num} · {isIt ? "MISSIONE" : "MISSION"} 0{num}
      </p>

      {/* titolo */}
      <h1 style={{ fontSize: "clamp(28px,4vw,64px)", fontWeight: 800, color: "#f2fff9", margin: "0 0 12px", textAlign: "center", letterSpacing: "-.02em", lineHeight: 1.15, padding: "0 24px" }}>
        {isIt ? m.it : m.en}
      </h1>

      {/* sottotitolo */}
      <p style={{ margin: "0 0 40px", fontSize: "clamp(14px,1.6vw,20px)", color: "#7dcfad", textAlign: "center", padding: "0 32px" }}>
        {isIt ? m.sub : m.subEn}
      </p>

      <div style={{ width: "min(320px,80vw)", marginBottom: "32px" }}>{renderTrustBar()}</div>

      <div style={{ display: "flex", gap: "12px" }}>
        <button className="secondaryAction" onClick={() => goBack()}>← {isIt ? "Indietro" : "Back"}</button>
        <button className="secondaryAction" onClick={() => setScreen("chapterMap")}>⌂ {isIt ? "Indice" : "Index"}</button>
        <button className="actionButton" style={{ marginTop: 0 }} onClick={() => setScreen(nextScreen)}>{isIt ? "Avanti →" : "Next →"}</button>
      </div>
      <div style={blueBarBot}/>
    </main>
  );
}

// ── ChallengeComplete ─────────────────────────────────────────────────────────

interface CompleteProps extends CommonProps {
  num: number;
  nextScreen: Screen;
}

function ChallengeComplete({ language, setLanguage, setScreen, reset, goBack, renderTrustBar, num, nextScreen }: CompleteProps) {
  const isIt = language === "it";
  const isLast = num === 6;
  const nextLabel = isLast ? (isIt ? "Vai al riepilogo →" : "Go to summary →") : (isIt ? `Inizia la Sfida ${num + 1} →` : `Start Challenge ${num + 1} →`);
  const titleText = isLast
    ? (isIt ? "Hai completato\ntutte le sfide!" : "You completed\nall challenges!")
    : (isIt ? `Hai completato\nla Sfida ${num}` : `You completed\nChallenge ${num}`);
  return (
    <main style={slideStyle} className="sectionIntroSlide">
      <div style={blueBarTop}/>
      <header className="missionNav" style={headerStyle}>
        <button className="brand brandButton" onClick={reset}><span className="brandMark">e·</span><span>Envizi<br/>Impact Quest</span></button>
        <div className="missionProgress"><span className="activeDot"/> SFIDE</div>
        <button className="langMini" onClick={() => setLanguage(language === "it" ? "en" : "it")}>{language === "it" ? "EN" : "IT"}</button>
      </header>
      <div style={{ textAlign: "center", display: "flex", flexDirection: "column", alignItems: "center", gap: "24px" }}>
        <p style={{ margin: 0, font: `700 14px var(--font-geist-mono)`, letterSpacing: ".2em", color: "#39efb4", textTransform: "uppercase" }}>{isIt ? `Sfida ${num} completata` : `Challenge ${num} completed`}</p>
        <h1 style={{ fontSize: "clamp(60px,10vw,140px)", fontWeight: 800, letterSpacing: "-.04em", color: "#f2fff9", margin: 0, lineHeight: 1, whiteSpace: "pre-line" }}>{titleText}</h1>
        <div style={{ width: "min(340px,80vw)", margin: "8px auto 0" }}>{renderTrustBar()}</div>
        <div style={{ display: "flex", gap: "12px", marginTop: "8px" }}>
          <button className="secondaryAction" onClick={() => goBack()}>← {isIt ? "Indietro" : "Back"}</button>
          <button className="actionButton" style={{ marginTop: 0 }} onClick={() => setScreen(nextScreen)}>{nextLabel}</button>
        </div>
      </div>
      <div style={blueBarBot}/>
    </main>
  );
}

// ── SectionIntro — slide di transizione con cerchio numerato ──────────────────

interface SectionIntroProps extends CommonProps {
  num: number;
  labelIt: string;
  labelEn: string;
  titleIt: string;
  titleEn: string;
  subIt: string;
  subEn: string;
  nextScreen: Screen;
  frozen?: boolean;
}

export function SectionIntroSlide({ language, setLanguage, setScreen, reset, goBack, num, labelIt, labelEn, titleIt, titleEn, subIt, subEn, nextScreen, frozen }: SectionIntroProps) {
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
  return (
    <main style={slideStyle} className="sectionIntroSlide">
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
      <div style={blueBarTop}/>
      <header className="missionNav" style={headerStyle}>
        <button className="brand brandButton" onClick={reset}><span className="brandMark">e·</span><span>Envizi<br/>Impact Quest</span></button>
        <div className="missionProgress"><span className="activeDot"/> {isIt ? labelIt.toUpperCase() : labelEn.toUpperCase()}</div>
        <button className="langMini" onClick={() => setLanguage(language === "it" ? "en" : "it")}>{language === "it" ? "EN" : "IT"}</button>
      </header>

      {/* cerchio numerato */}
      <div style={{ width: "clamp(140px,20vw,220px)", height: "clamp(140px,20vw,220px)", borderRadius: "50%", border: "4px solid #39efb4", display: "flex", alignItems: "center", justifyContent: "center", marginBottom: "40px", flexShrink: 0 }}>
        <span style={{ fontSize: "clamp(52px,8vw,96px)", fontWeight: 800, color: "#39efb4", lineHeight: 1 }}>{num}</span>
      </div>

      <p style={{ margin: "0 0 10px", fontSize: "clamp(22px,2.4vw,28px)", fontWeight: 700, letterSpacing: ".18em", color: "#39efb4", textTransform: "uppercase" }}>
        {isIt ? labelIt : labelEn}
      </p>

      <h1 style={{ fontSize: "clamp(56px,8vw,128px)", fontWeight: 800, color: "#f2fff9", margin: "0 0 12px", textAlign: "center", letterSpacing: "-.02em", lineHeight: 1.15, padding: "0 24px" }}>
        {isIt ? titleIt : titleEn}
      </h1>

      <p style={{ margin: "0 0 48px", fontSize: "clamp(28px,3.2vw,40px)", color: "#7dcfad", textAlign: "center", padding: "0 32px" }}>
        {isIt ? subIt : subEn}
      </p>

      <div style={{ display: "flex", gap: "12px" }}>
        <button className="secondaryAction" onClick={() => goBack()}>← {isIt ? "Indietro" : "Back"}</button>
        <button className="actionButton" style={{ marginTop: 0 }} onClick={() => setScreen(nextScreen)}>{isIt ? "Avanti →" : "Next →"}</button>
      </div>
      <div style={frozen ? {...blueBarBot, background:"#39efb4"} : blueBarBot}/>
    </main>
  );
}

// ── Named exports ─────────────────────────────────────────────────────────────

export function ChallengeSeparator1(p: Omit<SeparatorProps, "num" | "nextScreen">) { return <ChallengeSeparator {...p} num={1} nextScreen="missionCard1"/>; }
export function ChallengeSeparator2(p: Omit<SeparatorProps, "num" | "nextScreen">) { return <ChallengeSeparator {...p} num={2} nextScreen="missionCard2"/>; }
export function ChallengeSeparator3(p: Omit<SeparatorProps, "num" | "nextScreen">) { return <ChallengeSeparator {...p} num={3} nextScreen="missionCard3"/>; }
export function ChallengeSeparator4(p: Omit<SeparatorProps, "num" | "nextScreen">) { return <ChallengeSeparator {...p} num={4} nextScreen="missionCard4"/>; }
export function ChallengeSeparator5(p: Omit<SeparatorProps, "num" | "nextScreen">) { return <ChallengeSeparator {...p} num={5} nextScreen="missionCard5"/>; }
export function ChallengeSeparator6(p: Omit<SeparatorProps, "num" | "nextScreen">) { return <ChallengeSeparator {...p} num={6} nextScreen="missionCard6"/>; }

// Tipi aggiornati per i named exports
export type ChallengeSeparatorProps = Omit<SeparatorProps, "num" | "nextScreen">;

export function ChallengeComplete1(p: Omit<CompleteProps, "num" | "nextScreen">) { return <ChallengeComplete {...p} num={1} nextScreen="challengeSeparator2"/>; }
export function ChallengeComplete2(p: Omit<CompleteProps, "num" | "nextScreen">) { return <ChallengeComplete {...p} num={2} nextScreen="challengeSeparator3"/>; }
export function ChallengeComplete3(p: Omit<CompleteProps, "num" | "nextScreen">) { return <ChallengeComplete {...p} num={3} nextScreen="challengeSeparator4"/>; }
export function ChallengeComplete4(p: Omit<CompleteProps, "num" | "nextScreen">) { return <ChallengeComplete {...p} num={4} nextScreen="challengeSeparator5"/>; }
export function ChallengeComplete5(p: Omit<CompleteProps, "num" | "nextScreen">) { return <ChallengeComplete {...p} num={5} nextScreen="challengeSeparator6"/>; }
export function ChallengeComplete6(p: Omit<CompleteProps, "num" | "nextScreen">) { return <ChallengeComplete {...p} num={6} nextScreen="summary"/>; }
