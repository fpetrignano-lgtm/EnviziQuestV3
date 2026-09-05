import { useState } from "react";
import type { DFRating, Outcome } from "../types";
import type { CommonProps } from "./types";
import {
  DF_REQUIREMENTS, EF_REQUIREMENTS, SC_REQUIREMENTS,
  RF_REQUIREMENTS, PL_REQUIREMENTS, FR_REQUIREMENTS,
} from "../constants";

// ── shared helpers ────────────────────────────────────────────────────────────

type Req = { id: string; it: string; en: string; capIt: string; capEn: string; benIt: string; benEn: string; critIt?: string; critEn?: string; toBeIt?: string; toBeEn?: string; };

function FoundationGrid({ reqs, ratings, setRating, language }: {
  reqs: Req[];
  ratings: Record<string,DFRating>;
  setRating: (id:string,v:DFRating)=>void;
  language: "it"|"en";
}) {
  const isIt = language === "it";
  return <div className="dfGrid">
    {reqs.map((req,i)=>{
      const rating = ratings[req.id];
      const isActive = rating === "medium" || rating === "high";
      const pts = rating === "high" ? 10 : rating === "medium" ? 7.5 : 0;
      return <div key={req.id} className={`dfRow${isActive?" dfRowActive":""}${rating==="low"?" dfRowLow":""}`}>
        <div className="dfRowReq">
          <div className="dfRowReqTop"><span className="dfItemNum">{String(i+1).padStart(2,"0")}</span><p className="dfItemQ">{isIt?req.it:req.en}</p></div>
          <div className="dfRatingGroup">{(["low","medium","high"] as DFRating[]).map(v=><button key={v} className={`dfRatingBtn dfRatingBtn--${v}${rating===v?" dfRatingBtnActive":""}`} onClick={()=>setRating(req.id,v)}>{isIt?(v==="low"?"Basso":v==="medium"?"Medio +7,5":"Alto +10"):(v==="low"?"Low":v==="medium"?"Medium +7.5":"High +10")}</button>)}</div>
          {isActive&&<span className={`dfRowPts dfRowPts--${rating}`}>+{pts} pt</span>}
        </div>
        <div className={`dfRowCap${isActive?"":" dfRowColDim"}`}>{isActive?<><span className="dfRowColLabel">⬡ IBM Envizi</span><p>{isIt?req.capIt:req.capEn}</p></>:<span className="dfRowColEmpty">—</span>}</div>
        <div className={`dfRowBen${isActive?"":" dfRowColDim"}`}>{isActive?<><span className="dfRowColLabel">{isIt?"Beneficio":"Benefit"}</span><p>{isIt?req.benIt:req.benEn}</p></>:<span className="dfRowColEmpty">—</span>}</div>
      </div>;
    })}
  </div>;
}

function ConclusionGauge({ score, max, accentColor, isIt }: { score: number; max: number; accentColor: string; isIt: boolean; }) {
  const pct = Math.min(100, Math.round((score / max) * 100));
  const R = 52, cx = 64, cy = 64;
  const circ = 2 * Math.PI * R;
  const arcLen = circ * 0.75;
  const fillLen = arcLen * (pct / 100);
  return <svg viewBox="0 0 128 128" className="dfcGaugeSvg">
    <circle cx={cx} cy={cy} r={R} fill="none" stroke="rgba(57,239,180,.08)" strokeWidth="10" strokeDasharray={`${arcLen} ${circ}`} strokeDashoffset={circ*0.125} strokeLinecap="round"/>
    <circle cx={cx} cy={cy} r={R} fill="none" stroke={accentColor} strokeWidth="10" strokeDasharray={`${fillLen} ${circ}`} strokeDashoffset={circ*0.125} strokeLinecap="round" style={{filter:`drop-shadow(0 0 8px ${accentColor}88)`,transition:"stroke-dasharray .5s"}}/>
    <text x={cx} y={cy-6} textAnchor="middle" fontSize="28" fontWeight="800" fill={accentColor} fontFamily="inherit">{score}</text>
    <text x={cx} y={cy+14} textAnchor="middle" fontSize="11" fontWeight="700" fill="rgba(200,221,214,.5)" fontFamily="inherit">/{max}</text>
    <text x={cx} y={cy+30} textAnchor="middle" fontSize="9" fontWeight="700" fill="rgba(200,221,214,.35)" letterSpacing="1" fontFamily="inherit">{isIt?"RILEVANZA":"RELEVANCE"}</text>
  </svg>;
}

function ConclusionHighCards({ reqs, ratings, language }: { reqs: Req[]; ratings: Record<string,DFRating>; language: "it"|"en"; }) {
  const isIt = language === "it";
  const highReqs = reqs.filter(r => ratings[r.id] === "high");
  const medReqs = reqs.filter(r => ratings[r.id] === "medium");
  const highlight = highReqs.length > 0 || medReqs.length > 0;
  return <div className="dfcRight">
    {highlight && <p className="dfcIntroTitle">{isIt?"Perché Envizi risponde alle tue priorità:":"Why Envizi addresses your priorities:"}</p>}
    {([{reqs:highReqs,accent:"#39efb4",label:isIt?"FATTORI MOLTO RILEVANTI":"HIGHLY RELEVANT FACTORS"},{reqs:medReqs,accent:"#ffc07c",label:isIt?"FATTORI MEDIAMENTE RILEVANTI":"MODERATELY RELEVANT FACTORS"}] as {reqs:Req[],accent:string,label:string}[]).map(({reqs:rs,accent,label})=>rs.length>0&&<section key={label} className="dfcSection"><p className="dfcSectionLabel" style={{color:accent}}>{label}</p>{rs.map(r=><div key={r.id} className="dfcHRow" style={{"--dfcAccent":accent} as React.CSSProperties}><p className="dfcHRowTitle">{isIt?r.it:r.en}</p><div className="dfcHChips"><div className="dfcHChip dfcHChipCap"><span className="dfcHChipLabel">{isIt?"Capacità Envizi":"Envizi capability"}</span><p className="dfcHChipText">{isIt?r.capIt:r.capEn}</p></div><div className="dfcHChip dfcHChipBen"><span className="dfcHChipLabel">{isIt?"Beneficio":"Benefit"}</span><p className="dfcHChipText">{isIt?r.benIt:r.benEn}</p></div></div></div>)}</section>)}
  </div>;
}

// ── DATA FOUNDATION ──────────────────────────────────────────────────────────

interface DFProps extends CommonProps {
  dfRatings: Record<string,DFRating>;
  setDfRating: (id:string,v:DFRating)=>void;
}

export function DataFoundationScreen({ language, profile, setLanguage, setScreen, reset, renderTrustBar, dfRatings, setDfRating }: DFProps) {
  const isIt = language === "it";
  const [showAll, setShowAll] = useState(false);
  const allRated = DF_REQUIREMENTS.every(r => dfRatings[r.id]);
  const dfScore = Object.values(dfRatings).reduce((s,v)=>s+(v==="medium"?7.5:v==="high"?10:0),0);
  const dfPct = Math.min(100,Math.round(dfScore));
  const dfHighVery = dfScore >= 50;
  const dfHighMaybe = dfScore >= 30;
  const dfHighlight = dfHighMaybe;
  // Sort reqs: high first, then medium, then low/unrated — show top 5 unless showAll
  const sortedReqs = [...DF_REQUIREMENTS].sort((a,b)=>{const order={"high":0,"medium":1,"low":2,undefined:3};return (order[dfRatings[a.id] as keyof typeof order]??3)-(order[dfRatings[b.id] as keyof typeof order]??3);});
  const visibleReqs = showAll ? sortedReqs : sortedReqs.slice(0,5);
  const adherenceLabel = (v:DFRating|undefined):string=>!v||v==="low"?(isIt?"Assente":"Absent"):v==="medium"?(isIt?"Parziale":"Partial"):(isIt?"Rilevante":"Relevant");
  const adherenceColor = (v:DFRating|undefined):string=>!v||v==="low"?"#57606a":v==="medium"?"#ffc07c":"#39efb4";
  return <main className="dfScreen">
    <header className="missionNav missionNavTrust"><button className="brand brandButton" onClick={reset}><span className="brandMark">e·</span><span>Envizi<br/>Impact Quest</span></button><div className="missionProgress"><span className="activeDot"/> DATA FOUNDATION</div>{renderTrustBar()}<button className="langMini" onClick={()=>setLanguage(language==="it"?"en":"it")}>{language==="it"?"EN":"IT"}</button></header>
    <div className="dfStickyBar">
      <div className="dfStickyLeft">
        <p className="eyebrow">{isIt?"REQUISITI DATA FOUNDATION TARGET · MISSIONE 01":"DATA FOUNDATION TARGET REQUIREMENTS · MISSION 01"}</p>
        <h1>{isIt?"Quanto contano per te questi requisiti di data foundation?":"How important are these data foundation requirements for you?"}</h1>
        <p className="dfSubtitle">{isIt?"Basso = non in esame · Medio = in esame per il prossimo passo · Alto = urgente":"Low = not under review · Medium = under review for next step · High = urgent"}</p>
        {dfHighlight&&<div className="dfScoreMsg"><span className="dfScoreMsgIcon">⬡</span><p>{dfHighVery?(isIt?"Alta aderenza — la soluzione copre la maggior parte dei tuoi requisiti prioritari.":"High fit — the solution covers most of your priority requirements."):(isIt?"Aderenza parziale — approfondisci con il tuo team.":"Partial fit — explore further with your team.")}</p></div>}
      </div>
      <div className="dfStickyRight">
        <div className="dfScoreBox"><span className="dfScoreBoxLabel">{isIt?"Punteggio rilevanza":"Relevance score"}</span><strong className={dfHighlight?"dfScoreHigh":""}>{dfScore}<em>/100</em></strong><div className="dfScoreTrack"><span className="dfScoreFill" style={{width:`${dfPct}%`,background:dfHighVery?"#39efb4":"#ffc07c"}}/></div></div>
        <button className="actionButton dfContinueBtn" disabled={!allRated} onClick={()=>setScreen("dfConclusion")}>{isIt?"Continua →":"Continue →"}</button>
        {!allRated&&<p className="dfHint">{isIt?"Valuta tutti i requisiti per continuare.":"Rate all requirements to continue."}</p>}
      </div>
    </div>
    <div className="dfColHeaders"><div className="dfColH dfColHReq">{isIt?"Requisito · Priorità":"Requirement · Priority"}</div><div className="dfColH dfColHCap">{isIt?"Capacità della soluzione":"Solution capability"}</div><div className="dfColH dfColHBen">{isIt?"Beneficio ESG Manager":"ESG Manager benefit"}</div></div>
    <div className="dfGrid">
      {visibleReqs.map((req,i)=>{
        const rating = dfRatings[req.id];
        const isActive = rating === "medium" || rating === "high";
        const pts = rating === "high" ? 10 : rating === "medium" ? 7.5 : 0;
        const aColor = adherenceColor(rating);
        const aLabel = adherenceLabel(rating);
        return <div key={req.id} className={`dfRow${isActive?" dfRowActive":""}${rating==="low"?" dfRowLow":""}`}>
          <div className="dfRowReq">
            <div className="dfRowReqTop"><span className="dfItemNum">{String(i+1).padStart(2,"0")}</span><p className="dfItemQ">{isIt?req.it:req.en}</p><span className="dfAdherenceBadge" style={{borderColor:aColor,color:aColor}}>{aLabel}</span></div>
            <div className="dfRatingGroup">{(["low","medium","high"] as DFRating[]).map(v=><button key={v} className={`dfRatingBtn dfRatingBtn--${v}${rating===v?" dfRatingBtnActive":""}`} onClick={()=>setDfRating(req.id,v)}>{isIt?(v==="low"?"Basso":v==="medium"?"Medio +7,5":"Alto +10"):(v==="low"?"Low":v==="medium"?"Medium +7.5":"High +10")}</button>)}</div>
            {isActive&&<span className={`dfRowPts dfRowPts--${rating}`}>+{pts} pt</span>}
          </div>
          <div className={`dfRowCap${isActive?"":" dfRowColDim"}`}>{isActive?<><span className="dfRowColLabel">⬡ {isIt?"Soluzione":"Solution"}</span><p>{isIt?req.capIt:req.capEn}</p></>:<span className="dfRowColEmpty">—</span>}</div>
          <div className={`dfRowBen${isActive?"":" dfRowColDim"}`}>{isActive?<><span className="dfRowColLabel">{isIt?"Beneficio":"Benefit"}</span><p>{isIt?req.benIt:req.benEn}</p></>:<span className="dfRowColEmpty">—</span>}</div>
        </div>;
      })}
    </div>
    {!showAll&&DF_REQUIREMENTS.length>5&&<div style={{textAlign:"center",padding:"12px 0"}}><button className="secondaryAction" onClick={()=>setShowAll(true)}>{isIt?`Mostra tutti (${DF_REQUIREMENTS.length})`:`Show all (${DF_REQUIREMENTS.length})`}</button></div>}
    <footer className="dfFooter"><p className="dfSources">{isIt?"Capacità basate su: ":"Capabilities based on: "}<a href="https://www.ibm.com/products/envizi/esg-data-management" target="_blank" rel="noreferrer">ESG Data Management ↗</a>{" · "}<a href="https://www.ibm.com/docs/en/envizi-esg-suite?topic=managing-normalizing-data" target="_blank" rel="noreferrer">{isIt?"Normalizzazione dati":"Data normalisation"} ↗</a>{" · "}<a href="https://www.ibm.com/products/envizi/scope-1-2-ghg-accounting-reporting" target="_blank" rel="noreferrer">Scope 1–2 GHG ↗</a></p></footer>
  </main>;
}

interface DFConclusionProps extends CommonProps {
  dfRatings: Record<string,DFRating>;
  missionOutcomes: Record<number,string>;
  t: Record<string,any>;
}

export function DFConclusionScreen({ language, profile, setLanguage, setScreen, reset, renderTrustBar, dfRatings, missionOutcomes, t }: DFConclusionProps) {
  const isIt = language === "it";
  const [showAllConclusion, setShowAllConclusion] = useState(false);
  const dfScore = Object.values(dfRatings).reduce((s,v)=>s+(v==="medium"?7.5:v==="high"?10:0),0);
  const dfHighVery = dfScore >= 50;
  const dfHighMaybe = dfScore >= 30;
  const dfHighlight = dfHighMaybe;
  const m0outcome = missionOutcomes[0] as Outcome | undefined;
  const decisionTaken = m0outcome ? t.decisionLabels[m0outcome] : null;
  const decisionImg = m0outcome === "positive" ? "./envizi-data-automation.png" : m0outcome === "warning" ? "./envizi-manual-forms.png" : "./envizi-spreadsheets-email.png";
  const decisionColor = m0outcome === "positive" ? "#39efb4" : m0outcome === "warning" ? "#ffc07c" : "#ff7777";
  const accentColor = dfHighVery ? "#39efb4" : dfHighMaybe ? "#ffc07c" : "#57606a";
  // Build ordered list: high first, then medium
  const priorityReqs = [
    ...DF_REQUIREMENTS.filter(r=>dfRatings[r.id]==="high"),
    ...DF_REQUIREMENTS.filter(r=>dfRatings[r.id]==="medium"),
  ];
  const visibleConclusion = showAllConclusion ? priorityReqs : priorityReqs.slice(0,3);
  return <main className="dfScreen" style={{display:"flex",flexDirection:"column",height:"1080px",overflow:"hidden"}}>
    <header className="missionNav missionNavTrust"><button className="brand brandButton" onClick={reset}><span className="brandMark">e·</span><span>Envizi<br/>Impact Quest</span></button><div className="missionProgress"><span className="activeDot"/> DATA FOUNDATION</div>{renderTrustBar()}<button className="langMini" onClick={()=>setLanguage(language==="it"?"en":"it")}>{language==="it"?"EN":"IT"}</button></header>
    <div className="dfConclusionBody" style={{flex:1,overflow:"hidden"}}>
      <div className="dfcLeft">
        <p className="eyebrow" style={{letterSpacing:".18em",fontSize:"clamp(11px,1.1vw,16px)"}}>{isIt?"CONCLUSIONI · DATA FOUNDATION":"CONCLUSIONS · DATA FOUNDATION"}</p>
        <h1 className="dfcTitle" style={{fontWeight:800,lineHeight:1.1,marginBottom:4}}>{isIt?"La tua scelta per la gestione dei dati ESG":"Your ESG data management choice"}</h1>
        <div className="dfcGaugeWrap">
          <ConclusionGauge score={dfScore} max={100} accentColor={accentColor} isIt={isIt}/>
          <p className="dfcGaugeVerdict" style={{color:dfHighVery?"#39efb4":dfHighMaybe?"#ffc07c":"#7a9a90"}}>{dfHighVery?(isIt?"Alta aderenza — la soluzione copre la maggior parte dei tuoi requisiti prioritari.":"High fit — the solution covers most of your priority requirements."):dfHighMaybe?(isIt?"Aderenza parziale — approfondisci con il tuo team.":"Partial fit — explore further with your team."):(isIt?"Approfondisci con il tuo team.":"Explore further with your team.")}</p>
        </div>
        {decisionTaken&&<div className="dfcDecisionCard" style={{borderColor:decisionColor+"55"}}><img src={decisionImg} alt={decisionTaken} className="dfcDecisionCardImg"/><div className="dfcDecisionCardBody"><small className="dfcDecisionCardLabel">{isIt?"DECISIONE ADOTTATA · MISSIONE 01":"DECISION ADOPTED · MISSION 01"}</small><strong className="dfcDecisionCardValue" style={{color:decisionColor}}>{decisionTaken}</strong></div></div>}
        <div className="dfcActions" style={{marginTop:"auto",paddingTop:"12px"}}>
          <button className="actionButton dfcActionSecondary" onClick={()=>setScreen("dataFoundation")}>{isIt?"← Indietro":"← Back"}</button>
          <button className="actionButton" style={{whiteSpace:"nowrap"}} onClick={()=>setScreen("challengeComplete1")}>{isIt?"Prossima sfida →":"Next challenge →"}</button>
        </div>
      </div>
      <div className="dfcRight" style={{overflowY:"auto"}}>
        {dfHighlight&&<p className="dfcIntroTitle">{isIt?"Obiettivo → Esigenza → AS-IS → Gap → Capacità → Beneficio:":"Objective → Need → AS-IS → Gap → Capability → Benefit:"}</p>}
        {visibleConclusion.map(r=>{
          const rating = dfRatings[r.id];
          const accent = rating==="high"?"#39efb4":"#ffc07c";
          return <div key={r.id} className="dfcHRow" style={{"--dfcAccent":accent} as React.CSSProperties}>
            <p className="dfcHRowTitle" style={{color:accent}}>{isIt?r.it:r.en}</p>
            <div className="dfcHChips">
              <div className="dfcHChip dfcHChipCrit"><span className="dfcHChipLabel">{isIt?"Gap AS-IS":"AS-IS gap"}</span><p className="dfcHChipText">{isIt?(r as any).critIt:(r as any).critEn}</p></div>
              <div className="dfcHChip dfcHChipCap"><span className="dfcHChipLabel">{isIt?"Capacità soluzione":"Solution capability"}</span><p className="dfcHChipText">{isIt?r.capIt:r.capEn}</p></div>
              <div className="dfcHChip dfcHChipToBe"><span className="dfcHChipLabel">{isIt?"Copertura target (To-be)":"Target coverage (To-be)"}</span><p className="dfcHChipText">{isIt?(r as any).toBeIt:(r as any).toBeEn}</p></div>
              <div className="dfcHChip dfcHChipBen"><span className="dfcHChipLabel">{isIt?"Beneficio":"Benefit"}</span><p className="dfcHChipText">{isIt?r.benIt:r.benEn}</p></div>
            </div>
          </div>;
        })}
        {!showAllConclusion&&priorityReqs.length>3&&<button className="secondaryAction" style={{marginTop:"8px",width:"100%"}} onClick={()=>setShowAllConclusion(true)}>{isIt?`Mostra tutti (${priorityReqs.length})`:`Show all (${priorityReqs.length})`}</button>}
        {!dfHighlight&&<p style={{color:"#57606a",fontSize:"clamp(12px,1vw,14px)",fontStyle:"italic"}}>{isIt?"Nessun requisito selezionato come medio o alto. Torna indietro per rivalutare.":"No requirement rated medium or high. Go back to re-evaluate."}</p>}
      </div>
    </div>
  </main>;
}

// ── ENERGY FOUNDATION ────────────────────────────────────────────────────────

interface EFProps extends CommonProps {
  efRatings: Record<string,DFRating>;
  setEfRating: (id:string,v:DFRating)=>void;
}

export function EnergyFoundationScreen({ language, setLanguage, setScreen, reset, renderTrustBar, efRatings, setEfRating }: EFProps) {
  const isIt = language === "it";
  const allRated = EF_REQUIREMENTS.every(r => efRatings[r.id]);
  const efScore = Object.values(efRatings).reduce((s,v)=>s+(v==="medium"?7.5:v==="high"?10:0),0);
  const efPct = Math.min(100,Math.round(efScore));
  const efHighlight = efScore >= 35;
  return <main className="dfScreen">
    <header className="missionNav missionNavTrust"><button className="brand brandButton" onClick={reset}><span className="brandMark">e·</span><span>Envizi<br/>Impact Quest</span></button><div className="missionProgress"><span className="activeDot"/> {isIt?"ENERGIA E DECARBONIZZAZIONE":"ENERGY AND DECARBONISATION"}</div>{renderTrustBar()}<button className="langMini" onClick={()=>setLanguage(language==="it"?"en":"it")}>{language==="it"?"EN":"IT"}</button></header>
    <div className="dfStickyBar">
      <div className="dfStickyLeft">
        <p className="eyebrow">{isIt?"PERCHÉ SELEZIONARE IBM ENVIZI · ENERGY ANALYTICS":"WHY SELECT IBM ENVIZI · ENERGY ANALYTICS"}</p>
        <h1>{isIt?"Quanto contano per te questi requisiti di energy management?":"How important are these energy management requirements for you?"}</h1>
        <p className="dfSubtitle">{isIt?"Basso = non in esame · Medio = in esame per il prossimo passo · Alto = urgente":"Low = not under review · Medium = under review for next step · High = urgent"}</p>
        {efHighlight&&<div className="dfScoreMsg"><span className="dfScoreMsgIcon">⬡</span><p>{isIt?"Molto probabilmente IBM Envizi è la soluzione per le tue esigenze energetiche.":"IBM Envizi is very likely the right solution for your energy management needs."}</p></div>}
      </div>
      <div className="dfStickyRight">
        <div className="dfScoreBox"><span className="dfScoreBoxLabel">{isIt?"Punteggio rilevanza":"Relevance score"}</span><strong className={efHighlight?"dfScoreHigh":""}>{efScore}<em>/60</em></strong><div className="dfScoreTrack"><span className="dfScoreFill" style={{width:`${efPct}%`,background:efHighlight?"#39efb4":"#ffc07c"}}/></div></div>
        <button className="introBackBtn" onClick={()=>goBack()}>← {isIt?"Indietro":"Back"}</button>
        <button className="actionButton dfContinueBtn" disabled={!allRated} onClick={()=>setScreen("energyConclusion")}>{isIt?"Continua →":"Continue →"}</button>
        {!allRated&&<p className="dfHint">{isIt?"Valuta tutti i requisiti per continuare.":"Rate all requirements to continue."}</p>}
      </div>
    </div>
    <div className="dfColHeaders"><div className="dfColH dfColHReq">{isIt?"Requisito · Valutazione":"Requirement · Rating"}</div><div className="dfColH dfColHCap">⬡ {isIt?"Capacità IBM Envizi":"IBM Envizi capability"}</div><div className="dfColH dfColHBen">{isIt?"Beneficio ESG Manager":"ESG Manager benefit"}</div></div>
    <FoundationGrid reqs={EF_REQUIREMENTS as Req[]} ratings={efRatings} setRating={setEfRating} language={language}/>
    <footer className="dfFooter"><p className="dfSources">{isIt?"Capacità basate su: ":"Capabilities based on: "}<a href="https://www.ibm.com/products/envizi/interval-meter-analytics" target="_blank" rel="noreferrer">Interval Meter Analytics ↗</a>{" · "}<a href="https://www.ibm.com/products/envizi/utility-bill-analytics" target="_blank" rel="noreferrer">Utility Bill Analytics ↗</a></p></footer>
  </main>;
}

interface EFConclusionProps extends CommonProps {
  efRatings: Record<string,DFRating>;
  missionOutcomes: Record<number,string>;
}

export function EnergyConclusionScreen({ language, setLanguage, setScreen, reset, renderTrustBar, efRatings, missionOutcomes }: EFConclusionProps) {
  const isIt = language === "it";
  const efScore = Object.values(efRatings).reduce((s,v)=>s+(v==="medium"?7.5:v==="high"?10:0),0);
  const efPct = Math.min(100,Math.round(efScore));
  const efHighVery = efScore >= 50;
  const efHighMaybe = efScore >= 30;
  const efHighlight = efHighMaybe;
  const m1outcome = missionOutcomes[1] as Outcome | undefined;
  const decisionTaken = m1outcome ? (isIt ? {positive:"Envizi Utility Bill Analytics + Interval Meter Analytics",warning:"Cruscotto energetico manuale",critical:"Bollette e contatori separati"}[m1outcome] : {positive:"Envizi Utility Bill Analytics + Interval Meter Analytics",warning:"Manual energy dashboard",critical:"Bills and meters kept separate"}[m1outcome]) : null;
  const decisionImg = m1outcome === "positive" ? "./energy-envizi-analytics.png" : m1outcome === "warning" ? "./energy-manual-dashboard.png" : "./energy-asis-fragmented.png";
  const decisionColor = m1outcome === "positive" ? "#39efb4" : m1outcome === "warning" ? "#ffc07c" : "#ff7777";
  const accentColor = efHighVery ? "#39efb4" : efHighMaybe ? "#ffc07c" : "#57606a";
  return <main className="dfScreen">
    <header className="missionNav missionNavTrust"><button className="brand brandButton" onClick={reset}><span className="brandMark">e·</span><span>Envizi<br/>Impact Quest</span></button><div className="missionProgress"><span className="activeDot"/> {isIt?"ENERGIA E DECARBONIZZAZIONE":"ENERGY AND DECARBONISATION"}</div>{renderTrustBar()}<button className="langMini" onClick={()=>setLanguage(language==="it"?"en":"it")}>{language==="it"?"EN":"IT"}</button></header>
    <div className="dfConclusionBody">
      <div className="dfcLeft">
        <p className="eyebrow" style={{letterSpacing:".18em",fontSize:"22px"}}>{isIt?"CONCLUSIONI · ENERGIA E DECARBONIZZAZIONE":"CONCLUSIONS · ENERGY AND DECARBONISATION"}</p>
        <h1 className="dfcTitle" style={{fontWeight:800,lineHeight:1.1,marginBottom:4}}>{isIt?"La tua scelta per il controllo dell'energia":"Your energy management choice"}</h1>
        <div className="dfcGaugeWrap">
          <ConclusionGauge score={efScore} max={60} accentColor={accentColor} isIt={isIt}/>
          <p className="dfcGaugeVerdict" style={{color:accentColor}}>{efHighVery?(isIt?"Molto probabilmente IBM Envizi è la soluzione per le tue esigenze energetiche.":"IBM Envizi is very likely the right solution for your energy needs."):efHighMaybe?(isIt?"Probabilmente IBM Envizi è la soluzione per le tue esigenze energetiche.":"IBM Envizi is probably the right solution for your energy needs."):(isIt?"Approfondisci con il tuo team IBM.":"Explore further with your IBM team.")}</p>
        </div>
        {decisionTaken&&<div className="dfcDecisionCard" style={{borderColor:decisionColor+"55"}}><img src={decisionImg} alt={decisionTaken} className="dfcDecisionCardImg"/><div className="dfcDecisionCardBody"><small className="dfcDecisionCardLabel">{isIt?"DECISIONE ADOTTATA · MISSIONE 02":"DECISION ADOPTED · MISSION 02"}</small><strong className="dfcDecisionCardValue" style={{color:decisionColor}}>{decisionTaken}</strong></div></div>}
        <div className="dfcActions">
          <button className="actionButton dfcActionSecondary" onClick={()=>setScreen("energyFoundation")}>{isIt?"← Indietro":"← Back"}</button>
          <button className="actionButton" style={{whiteSpace:"nowrap"}} onClick={()=>setScreen("challengeComplete5")}>{isIt?"Completa Sfida 5 →":"Complete Challenge 5 →"}</button>
        </div>
      </div>
      <ConclusionHighCards reqs={EF_REQUIREMENTS as Req[]} ratings={efRatings} language={language}/>
    </div>
  </main>;
}

// ── SUPPLY FOUNDATION ─────────────────────────────────────────────────────────

interface SCProps extends CommonProps {
  scRatings: Record<string,DFRating>;
  setScRating: (id:string,v:DFRating)=>void;
}

export function SupplyFoundationScreen({ language, setLanguage, setScreen, reset, renderTrustBar, scRatings, setScRating }: SCProps) {
  const isIt = language === "it";
  const allRated = SC_REQUIREMENTS.every(r => scRatings[r.id]);
  const scScore = Object.values(scRatings).reduce((s,v)=>s+(v==="medium"?7.5:v==="high"?10:0),0);
  const scPct = Math.min(100,Math.round(scScore));
  const scHighlight = scScore >= 35;
  return <main className="dfScreen">
    <header className="missionNav missionNavTrust"><button className="brand brandButton" onClick={reset}><span className="brandMark">e·</span><span>Envizi<br/>Impact Quest</span></button><div className="missionProgress"><span className="activeDot"/> {isIt?"COINVOLGIMENTO SUPPLY CHAIN":"SUPPLY CHAIN ENGAGEMENT"}</div>{renderTrustBar()}<button className="langMini" onClick={()=>setLanguage(language==="it"?"en":"it")}>{language==="it"?"EN":"IT"}</button></header>
    <div className="dfStickyBar">
      <div className="dfStickyLeft">
        <p className="eyebrow">{isIt?"PERCHÉ SELEZIONARE IBM ENVIZI · SUPPLY CHAIN INTELLIGENCE":"WHY SELECT IBM ENVIZI · SUPPLY CHAIN INTELLIGENCE"}</p>
        <h1>{isIt?"Quanto contano per te questi requisiti di supply chain?":"How important are these supply chain requirements for you?"}</h1>
        <p className="dfSubtitle">{isIt?"Basso = non in esame · Medio = in esame per il prossimo passo · Alto = urgente":"Low = not under review · Medium = under review for next step · High = urgent"}</p>
        {scHighlight&&<div className="dfScoreMsg"><span className="dfScoreMsgIcon">⬡</span><p>{isIt?"Molto probabilmente IBM Envizi è la soluzione per le tue esigenze Scope 3 e supply chain.":"IBM Envizi is very likely the right solution for your Scope 3 and supply chain needs."}</p></div>}
      </div>
      <div className="dfStickyRight">
        <div className="dfScoreBox"><span className="dfScoreBoxLabel">{isIt?"Punteggio rilevanza":"Relevance score"}</span><strong className={scHighlight?"dfScoreHigh":""}>{scScore}<em>/60</em></strong><div className="dfScoreTrack"><span className="dfScoreFill" style={{width:`${scPct}%`,background:scHighlight?"#39efb4":"#ffc07c"}}/></div></div>
        <button className="introBackBtn" onClick={()=>goBack()}>← {isIt?"Indietro":"Back"}</button>
        <button className="actionButton dfContinueBtn" disabled={!allRated} onClick={()=>setScreen("supplyConclusion")}>{isIt?"Continua →":"Continue →"}</button>
        {!allRated&&<p className="dfHint">{isIt?"Valuta tutti i requisiti per continuare.":"Rate all requirements to continue."}</p>}
      </div>
    </div>
    <div className="dfColHeaders"><div className="dfColH dfColHReq">{isIt?"Requisito · Valutazione":"Requirement · Rating"}</div><div className="dfColH dfColHCap">⬡ {isIt?"Capacità IBM Envizi":"IBM Envizi capability"}</div><div className="dfColH dfColHBen">{isIt?"Beneficio ESG Manager":"ESG Manager benefit"}</div></div>
    <FoundationGrid reqs={SC_REQUIREMENTS as Req[]} ratings={scRatings} setRating={setScRating} language={language}/>
    <footer className="dfFooter"><p className="dfSources">{isIt?"Capacità basate su: ":"Capabilities based on: "}<a href="https://www.ibm.com/products/envizi/supply-chain-intelligence" target="_blank" rel="noreferrer">Supply Chain Intelligence ↗</a>{" · "}<a href="https://www.ibm.com/products/envizi/scope-3-ghg-accounting-reporting" target="_blank" rel="noreferrer">Scope 3 GHG Accounting ↗</a></p></footer>
  </main>;
}

interface SCConclusionProps extends CommonProps {
  scRatings: Record<string,DFRating>;
  missionOutcomes: Record<number,string>;
}

export function SupplyConclusionScreen({ language, setLanguage, setScreen, reset, renderTrustBar, scRatings, missionOutcomes }: SCConclusionProps) {
  const isIt = language === "it";
  const scScore = Object.values(scRatings).reduce((s,v)=>s+(v==="medium"?7.5:v==="high"?10:0),0);
  const scPct = Math.min(100,Math.round(scScore));
  const scHighVery = scScore >= 50;
  const scHighMaybe = scScore >= 30;
  const scHighlight = scHighMaybe;
  const m2outcome = missionOutcomes[2] as Outcome | undefined;
  const decisionTaken = m2outcome ? (isIt ? {positive:"Envizi Surveys + Assessments e Supply Chain Intelligence",warning:"Portale questionari separato",critical:"E-mail e fogli separati"}[m2outcome] : {positive:"Envizi Surveys + Assessments and Supply Chain Intelligence",warning:"Separate questionnaire portal",critical:"Email and separate spreadsheets"}[m2outcome]) : null;
  const decisionImg = m2outcome === "positive" ? "./supply-chain-envizi.png" : m2outcome === "warning" ? "./supply-chain-portal.png" : "./supply-chain-asis.png";
  const decisionColor = m2outcome === "positive" ? "#39efb4" : m2outcome === "warning" ? "#ffc07c" : "#ff7777";
  const accentColor = scHighVery ? "#39efb4" : scHighMaybe ? "#ffc07c" : "#57606a";
  return <main className="dfScreen">
    <header className="missionNav missionNavTrust"><button className="brand brandButton" onClick={reset}><span className="brandMark">e·</span><span>Envizi<br/>Impact Quest</span></button><div className="missionProgress"><span className="activeDot"/> {isIt?"COINVOLGIMENTO SUPPLY CHAIN":"SUPPLY CHAIN ENGAGEMENT"}</div>{renderTrustBar()}<button className="langMini" onClick={()=>setLanguage(language==="it"?"en":"it")}>{language==="it"?"EN":"IT"}</button></header>
    <div className="dfConclusionBody">
      <div className="dfcLeft">
        <p className="eyebrow" style={{letterSpacing:".18em",fontSize:"22px"}}>{isIt?"CONCLUSIONI · SUPPLY CHAIN ENGAGEMENT":"CONCLUSIONS · SUPPLY CHAIN ENGAGEMENT"}</p>
        <h1 className="dfcTitle" style={{fontWeight:800,lineHeight:1.1,marginBottom:4}}>{isIt?"La tua scelta per il coinvolgimento della supply chain":"Your supply chain engagement choice"}</h1>
        <div className="dfcGaugeWrap">
          <ConclusionGauge score={scScore} max={60} accentColor={accentColor} isIt={isIt}/>
          <p className="dfcGaugeVerdict" style={{color:accentColor}}>{scHighVery?(isIt?"Molto probabilmente IBM Envizi è la soluzione per le tue esigenze Scope 3 e supply chain.":"IBM Envizi is very likely the right solution for your Scope 3 and supply chain needs."):scHighMaybe?(isIt?"Probabilmente IBM Envizi è la soluzione per le tue esigenze Scope 3 e supply chain.":"IBM Envizi is probably the right solution for your Scope 3 and supply chain needs."):(isIt?"Approfondisci con il tuo team IBM.":"Explore further with your IBM team.")}</p>
        </div>
        {decisionTaken&&<div className="dfcDecisionCard" style={{borderColor:decisionColor+"55"}}><img src={decisionImg} alt={decisionTaken} className="dfcDecisionCardImg"/><div className="dfcDecisionCardBody"><small className="dfcDecisionCardLabel">{isIt?"DECISIONE ADOTTATA · MISSIONE 03":"DECISION ADOPTED · MISSION 03"}</small><strong className="dfcDecisionCardValue" style={{color:decisionColor}}>{decisionTaken}</strong></div></div>}
        <div className="dfcActions">
          <button className="actionButton dfcActionSecondary" onClick={()=>setScreen("supplyFoundation")}>{isIt?"← Indietro":"← Back"}</button>
          <button className="actionButton" style={{whiteSpace:"nowrap"}} onClick={()=>setScreen("challengeComplete4")}>{isIt?"Completa Sfida 4 →":"Complete Challenge 4 →"}</button>
        </div>
      </div>
      <ConclusionHighCards reqs={SC_REQUIREMENTS as Req[]} ratings={scRatings} language={language}/>
    </div>
  </main>;
}

// ── REPORTING FOUNDATION ─────────────────────────────────────────────────────

interface RFProps extends CommonProps {
  rfRatings: Record<string,DFRating>;
  setRfRating: (id:string,v:DFRating)=>void;
}

export function ReportingFoundationScreen({ language, setLanguage, setScreen, reset, renderTrustBar, rfRatings, setRfRating }: RFProps) {
  const isIt = language === "it";
  const allRated = RF_REQUIREMENTS.every(r => rfRatings[r.id]);
  const rfScore = Object.values(rfRatings).reduce((s,v)=>s+(v==="medium"?7.5:v==="high"?10:0),0);
  const rfPct = Math.min(100,Math.round(rfScore));
  const rfHighlight = rfScore >= 35;
  return <main className="dfScreen">
    <header className="missionNav missionNavTrust"><button className="brand brandButton" onClick={reset}><span className="brandMark">e·</span><span>Envizi<br/>Impact Quest</span></button><div className="missionProgress"><span className="activeDot"/> {isIt?"REPORTING E PERFORMANCE":"REPORTING AND PERFORMANCE"}</div>{renderTrustBar()}<button className="langMini" onClick={()=>setLanguage(language==="it"?"en":"it")}>{language==="it"?"EN":"IT"}</button></header>
    <div className="dfStickyBar">
      <div className="dfStickyLeft">
        <p className="eyebrow">{isIt?"PERCHÉ SELEZIONARE IBM ENVIZI · GHG & REPORTING":"WHY SELECT IBM ENVIZI · GHG & REPORTING"}</p>
        <h1>{isIt?"Quanto contano per te questi requisiti di reporting?":"How important are these reporting requirements for you?"}</h1>
        <p className="dfSubtitle">{isIt?"Basso = non in esame · Medio = in esame per il prossimo passo · Alto = urgente":"Low = not under review · Medium = under review for next step · High = urgent"}</p>
        {rfHighlight&&<div className="dfScoreMsg"><span className="dfScoreMsgIcon">⬡</span><p>{isIt?"Molto probabilmente IBM Envizi è la soluzione per le tue esigenze di reporting.":"IBM Envizi is very likely the right solution for your reporting needs."}</p></div>}
      </div>
      <div className="dfStickyRight">
        <div className="dfScoreBox"><span className="dfScoreBoxLabel">{isIt?"Punteggio rilevanza":"Relevance score"}</span><strong className={rfHighlight?"dfScoreHigh":""}>{rfScore}<em>/80</em></strong><div className="dfScoreTrack"><span className="dfScoreFill" style={{width:`${rfPct}%`,background:rfHighlight?"#39efb4":"#ffc07c"}}/></div></div>
        <button className="introBackBtn" onClick={()=>goBack()}>← {isIt?"Indietro":"Back"}</button>
        <button className="actionButton dfContinueBtn" disabled={!allRated} onClick={()=>setScreen("reportingConclusion")}>{isIt?"Continua →":"Continue →"}</button>
        {!allRated&&<p className="dfHint">{isIt?"Valuta tutti i requisiti per continuare.":"Rate all requirements to continue."}</p>}
      </div>
    </div>
    <div className="dfColHeaders"><div className="dfColH dfColHReq">{isIt?"Requisito · Valutazione":"Requirement · Rating"}</div><div className="dfColH dfColHCap">⬡ {isIt?"Capacità IBM Envizi":"IBM Envizi capability"}</div><div className="dfColH dfColHBen">{isIt?"Beneficio ESG Manager":"ESG Manager benefit"}</div></div>
    <FoundationGrid reqs={RF_REQUIREMENTS as Req[]} ratings={rfRatings} setRating={setRfRating} language={language}/>
    <footer className="dfFooter"><p className="dfSources">{isIt?"Capacità basate su: ":"Capabilities based on: "}<a href="https://www.ibm.com/products/envizi/scope-1-2-ghg-accounting-reporting" target="_blank" rel="noreferrer">Scope 1–2 GHG Accounting &amp; Reporting ↗</a>{" · "}<a href="https://www.ibm.com/products/envizi/scope-3-ghg-accounting-reporting" target="_blank" rel="noreferrer">Scope 3 GHG ↗</a>{" · "}<a href="https://www.ibm.com/products/envizi/esg-reporting-frameworks" target="_blank" rel="noreferrer">ESG Reporting Frameworks ↗</a></p></footer>
  </main>;
}

interface RFConclusionProps extends CommonProps {
  rfRatings: Record<string,DFRating>;
  missionOutcomes: Record<number,string>;
}

export function ReportingConclusionScreen({ language, setLanguage, setScreen, reset, renderTrustBar, rfRatings, missionOutcomes }: RFConclusionProps) {
  const isIt = language === "it";
  const rfScore = Object.values(rfRatings).reduce((s,v)=>s+(v==="medium"?7.5:v==="high"?10:0),0);
  const rfPct = Math.min(100,Math.round(rfScore));
  const rfHighVery = rfScore >= 50;
  const rfHighMaybe = rfScore >= 30;
  const rfHighlight = rfHighMaybe;
  const m3outcome = missionOutcomes[3] as Outcome | undefined;
  const decisionTaken = m3outcome ? (isIt ? {positive:"Envizi ESG Reporting Frameworks + GHG Reporting",warning:"Workflow documentale con template",critical:"E-mail, Word e fogli"}[m3outcome] : {positive:"Envizi ESG Reporting Frameworks + GHG Reporting",warning:"Document workflow with templates",critical:"Email, Word and spreadsheets"}[m3outcome]) : null;
  const decisionImg = m3outcome === "positive" ? "./reporting-envizi.png" : m3outcome === "warning" ? "./reporting-intermediate.png" : "./reporting-asis.png";
  const decisionColor = m3outcome === "positive" ? "#39efb4" : m3outcome === "warning" ? "#ffc07c" : "#ff7777";
  const accentColor = rfHighVery ? "#39efb4" : rfHighMaybe ? "#ffc07c" : "#57606a";
  return <main className="dfScreen">
    <header className="missionNav missionNavTrust"><button className="brand brandButton" onClick={reset}><span className="brandMark">e·</span><span>Envizi<br/>Impact Quest</span></button><div className="missionProgress"><span className="activeDot"/> {isIt?"REPORTING E PERFORMANCE":"REPORTING AND PERFORMANCE"}</div>{renderTrustBar()}<button className="langMini" onClick={()=>setLanguage(language==="it"?"en":"it")}>{language==="it"?"EN":"IT"}</button></header>
    <div className="dfConclusionBody">
      <div className="dfcLeft">
        <p className="eyebrow" style={{letterSpacing:".18em",fontSize:"22px"}}>{isIt?"CONCLUSIONI · REPORTING E PERFORMANCE":"CONCLUSIONS · REPORTING AND PERFORMANCE"}</p>
        <h1 className="dfcTitle" style={{fontWeight:800,lineHeight:1.1,marginBottom:4}}>{isIt?"La tua scelta per il reporting delle performance ESG":"Your ESG performance reporting choice"}</h1>
        <div className="dfcGaugeWrap">
          <ConclusionGauge score={rfScore} max={80} accentColor={accentColor} isIt={isIt}/>
          <p className="dfcGaugeVerdict" style={{color:accentColor}}>{rfHighVery?(isIt?"Molto probabilmente IBM Envizi è la soluzione per le tue esigenze di reporting.":"IBM Envizi is very likely the right solution for your reporting needs."):rfHighMaybe?(isIt?"Probabilmente IBM Envizi è la soluzione per le tue esigenze di reporting.":"IBM Envizi is probably the right solution for your reporting needs."):(isIt?"Approfondisci con il tuo team IBM.":"Explore further with your IBM team.")}</p>
        </div>
        {decisionTaken&&<div className="dfcDecisionCard" style={{borderColor:decisionColor+"55"}}><img src={decisionImg} alt={decisionTaken} className="dfcDecisionCardImg"/><div className="dfcDecisionCardBody"><small className="dfcDecisionCardLabel">{isIt?"DECISIONE ADOTTATA · MISSIONE 04":"DECISION ADOPTED · MISSION 04"}</small><strong className="dfcDecisionCardValue" style={{color:decisionColor}}>{decisionTaken}</strong></div></div>}
        <div className="dfcActions">
          <button className="actionButton dfcActionSecondary" onClick={()=>setScreen("reportingFoundation")}>{isIt?"← Indietro":"← Back"}</button>
          <button className="actionButton" style={{whiteSpace:"nowrap"}} onClick={()=>setScreen("challengeComplete2")}>{isIt?"Completa Sfida 2 →":"Complete Challenge 2 →"}</button>
        </div>
      </div>
      <ConclusionHighCards reqs={RF_REQUIREMENTS as Req[]} ratings={rfRatings} language={language}/>
    </div>
  </main>;
}

// ── PLANNING FOUNDATION ──────────────────────────────────────────────────────

interface PLProps extends CommonProps {
  plRatings: Record<string,DFRating>;
  setPlRating: (id:string,v:DFRating)=>void;
}

export function PlanningFoundationScreen({ language, setLanguage, setScreen, reset, renderTrustBar, plRatings, setPlRating }: PLProps) {
  const isIt = language === "it";
  const allRated = PL_REQUIREMENTS.every(r => plRatings[r.id]);
  const plScore = Object.values(plRatings).reduce((s,v)=>s+(v==="medium"?7.5:v==="high"?10:0),0);
  const plPct = Math.min(100,Math.round(plScore));
  const plHighlight = plScore >= 35;
  return <main className="dfScreen">
    <header className="missionNav missionNavTrust"><button className="brand brandButton" onClick={reset}><span className="brandMark">e·</span><span>Envizi<br/>Impact Quest</span></button><div className="missionProgress"><span className="activeDot"/> {isIt?"ROTTA VERSO NET ZERO":"NET ZERO PATHWAY"}</div>{renderTrustBar()}<button className="langMini" onClick={()=>setLanguage(language==="it"?"en":"it")}>{language==="it"?"EN":"IT"}</button></header>
    <div className="dfStickyBar">
      <div className="dfStickyLeft">
        <p className="eyebrow">{isIt?"PERCHÉ SELEZIONARE IBM ENVIZI · PLANNING E SCENARIO MODELER":"WHY SELECT IBM ENVIZI · PLANNING & SCENARIO MODELER"}</p>
        <h1>{isIt?"Quanto contano per te questi requisiti di pianificazione Net Zero?":"How important are these Net Zero planning requirements for you?"}</h1>
        <p className="dfSubtitle">{isIt?"Basso = non in esame · Medio = in esame per il prossimo passo · Alto = urgente":"Low = not under review · Medium = under review for next step · High = urgent"}</p>
        {plHighlight&&<div className="dfScoreMsg"><span className="dfScoreMsgIcon">⬡</span><p>{isIt?"Molto probabilmente IBM Envizi è la soluzione per la tua pianificazione della decarbonizzazione.":"IBM Envizi is very likely the right solution for your decarbonisation planning needs."}</p></div>}
      </div>
      <div className="dfStickyRight">
        <div className="dfScoreBox"><span className="dfScoreBoxLabel">{isIt?"Punteggio rilevanza":"Relevance score"}</span><strong className={plHighlight?"dfScoreHigh":""}>{plScore}<em>/60</em></strong><div className="dfScoreTrack"><span className="dfScoreFill" style={{width:`${plPct}%`,background:plHighlight?"#39efb4":"#ffc07c"}}/></div></div>
        <button className="introBackBtn" onClick={()=>goBack()}>← {isIt?"Indietro":"Back"}</button>
        <button className="actionButton dfContinueBtn" disabled={!allRated} onClick={()=>setScreen("planningConclusion")}>{isIt?"Continua →":"Continue →"}</button>
        {!allRated&&<p className="dfHint">{isIt?"Valuta tutti i requisiti per continuare.":"Rate all requirements to continue."}</p>}
      </div>
    </div>
    <div className="dfColHeaders"><div className="dfColH dfColHReq">{isIt?"Requisito · Valutazione":"Requirement · Rating"}</div><div className="dfColH dfColHCap">⬡ {isIt?"Capacità IBM Envizi":"IBM Envizi capability"}</div><div className="dfColH dfColHBen">{isIt?"Beneficio ESG Manager":"ESG Manager benefit"}</div></div>
    <FoundationGrid reqs={PL_REQUIREMENTS as Req[]} ratings={plRatings} setRating={setPlRating} language={language}/>
    <footer className="dfFooter"><p className="dfSources">{isIt?"Capacità basate su: ":"Capabilities based on: "}<a href="https://www.ibm.com/products/envizi/scenario-modeler" target="_blank" rel="noreferrer">Scenario Modeler ↗</a>{" · "}<a href="https://www.ibm.com/products/envizi/sustainability-program-tracking" target="_blank" rel="noreferrer">Sustainability Program Tracking ↗</a></p></footer>
  </main>;
}

interface PLConclusionProps extends CommonProps {
  plRatings: Record<string,DFRating>;
  missionOutcomes: Record<number,string>;
}

export function PlanningConclusionScreen({ language, setLanguage, setScreen, reset, renderTrustBar, plRatings, missionOutcomes }: PLConclusionProps) {
  const isIt = language === "it";
  const plScore = Object.values(plRatings).reduce((s,v)=>s+(v==="medium"?7.5:v==="high"?10:0),0);
  const plPct = Math.min(100,Math.round(plScore));
  const plHighVery = plScore >= 50;
  const plHighMaybe = plScore >= 30;
  const plHighlight = plHighMaybe;
  const m4outcome = missionOutcomes[4] as Outcome | undefined;
  const decisionTaken = m4outcome ? (isIt ? {positive:"Envizi Scenario Modeler + Program Tracking + Planning Analytics",warning:"Portafoglio progetti in foglio e project tool",critical:"Nessun modello di pianificazione"}[m4outcome] : {positive:"Envizi Scenario Modeler + Program Tracking + Planning Analytics",warning:"Project portfolio in spreadsheets and project tool",critical:"No planning model"}[m4outcome]) : null;
  const decisionImg = m4outcome === "positive" ? "./planning-envizi.png" : m4outcome === "warning" ? "./planning-intermediate.png" : "./planning-asis.png";
  const decisionColor = m4outcome === "positive" ? "#39efb4" : m4outcome === "warning" ? "#ffc07c" : "#ff7777";
  const accentColor = plHighVery ? "#39efb4" : plHighMaybe ? "#ffc07c" : "#57606a";
  return <main className="dfScreen">
    <header className="missionNav missionNavTrust"><button className="brand brandButton" onClick={reset}><span className="brandMark">e·</span><span>Envizi<br/>Impact Quest</span></button><div className="missionProgress"><span className="activeDot"/> {isIt?"ROTTA VERSO NET ZERO":"NET ZERO PATHWAY"}</div>{renderTrustBar()}<button className="langMini" onClick={()=>setLanguage(language==="it"?"en":"it")}>{language==="it"?"EN":"IT"}</button></header>
    <div className="dfConclusionBody">
      <div className="dfcLeft">
        <p className="eyebrow" style={{letterSpacing:".18em",fontSize:"22px"}}>{isIt?"CONCLUSIONI · ROTTA VERSO NET ZERO":"CONCLUSIONS · NET ZERO PATHWAY"}</p>
        <h1 className="dfcTitle" style={{fontWeight:800,lineHeight:1.1,marginBottom:4}}>{isIt?"La tua scelta per il piano di decarbonizzazione":"Your decarbonisation planning choice"}</h1>
        <div className="dfcGaugeWrap">
          <ConclusionGauge score={plScore} max={60} accentColor={accentColor} isIt={isIt}/>
          <p className="dfcGaugeVerdict" style={{color:accentColor}}>{plHighVery?(isIt?"Molto probabilmente IBM Envizi è la soluzione per la tua pianificazione della decarbonizzazione.":"IBM Envizi is very likely the right solution for your decarbonisation planning needs."):plHighMaybe?(isIt?"Probabilmente IBM Envizi è la soluzione per la tua pianificazione della decarbonizzazione.":"IBM Envizi is probably the right solution for your decarbonisation planning needs."):(isIt?"Approfondisci con il tuo team IBM.":"Explore further with your IBM team.")}</p>
        </div>
        {decisionTaken&&<div className="dfcDecisionCard" style={{borderColor:decisionColor+"55"}}><img src={decisionImg} alt={decisionTaken} className="dfcDecisionCardImg"/><div className="dfcDecisionCardBody"><small className="dfcDecisionCardLabel">{isIt?"DECISIONE ADOTTATA · MISSIONE 05":"DECISION ADOPTED · MISSION 05"}</small><strong className="dfcDecisionCardValue" style={{color:decisionColor}}>{decisionTaken}</strong></div></div>}
        <div className="dfcActions">
          <button className="actionButton dfcActionSecondary" onClick={()=>setScreen("planningFoundation")}>{isIt?"← Indietro":"← Back"}</button>
          <button className="actionButton" style={{whiteSpace:"nowrap"}} onClick={()=>setScreen("challengeComplete6")}>{isIt?"Completa Sfida 6 →":"Complete Challenge 6 →"}</button>
        </div>
      </div>
      <ConclusionHighCards reqs={PL_REQUIREMENTS as Req[]} ratings={plRatings} language={language}/>
    </div>
  </main>;
}

// ── FRAMEWORK FOUNDATION ─────────────────────────────────────────────────────

interface FRProps extends CommonProps {
  frRatings: Record<string,DFRating>;
  setFrRating: (id:string,v:DFRating)=>void;
}

export function FrameworkFoundationScreen({ language, setLanguage, setScreen, reset, renderTrustBar, frRatings, setFrRating }: FRProps) {
  const isIt = language === "it";
  const allRated = FR_REQUIREMENTS.every(r => frRatings[r.id]);
  const frScore = Object.values(frRatings).reduce((s,v)=>s+(v==="medium"?7.5:v==="high"?10:0),0);
  const frPct = Math.min(100,Math.round(frScore));
  const frHighlight = frScore >= 35;
  return <main className="dfScreen">
    <header className="missionNav missionNavTrust"><button className="brand brandButton" onClick={reset}><span className="brandMark">e·</span><span>Envizi<br/>Impact Quest</span></button><div className="missionProgress"><span className="activeDot"/> {isIt?"FRAMEWORK ESG E DISCLOSURE":"ESG FRAMEWORKS AND DISCLOSURE"}</div>{renderTrustBar()}<button className="langMini" onClick={()=>setLanguage(language==="it"?"en":"it")}>{language==="it"?"EN":"IT"}</button></header>
    <div className="dfStickyBar">
      <div className="dfStickyLeft">
        <p className="eyebrow">{isIt?"PERCHÉ SELEZIONARE IBM ENVIZI · SUSTAINABILITY REPORTING MANAGER":"WHY SELECT IBM ENVIZI · SUSTAINABILITY REPORTING MANAGER"}</p>
        <h1>{isIt?"Quanto contano per te questi requisiti di gestione framework e disclosure?":"How important are these framework management and disclosure requirements for you?"}</h1>
        <p className="dfSubtitle">{isIt?"Basso = non in esame · Medio = in esame per il prossimo passo · Alto = urgente":"Low = not under review · Medium = under review for next step · High = urgent"}</p>
        {frHighlight&&<div className="dfScoreMsg"><span className="dfScoreMsgIcon">⬡</span><p>{isIt?"Molto probabilmente IBM Envizi è la soluzione per la tua gestione dei framework ESG.":"IBM Envizi is very likely the right solution for your ESG framework management needs."}</p></div>}
      </div>
      <div className="dfStickyRight">
        <div className="dfScoreBox"><span className="dfScoreBoxLabel">{isIt?"Punteggio rilevanza":"Relevance score"}</span><strong className={frHighlight?"dfScoreHigh":""}>{frScore}<em>/60</em></strong><div className="dfScoreTrack"><span className="dfScoreFill" style={{width:`${frPct}%`,background:frHighlight?"#39efb4":"#ffc07c"}}/></div></div>
        <button className="introBackBtn" onClick={()=>goBack()}>← {isIt?"Indietro":"Back"}</button>
        <button className="actionButton dfContinueBtn" disabled={!allRated} onClick={()=>setScreen("frameworkConclusion")}>{isIt?"Continua →":"Continue →"}</button>
        {!allRated&&<p className="dfHint">{isIt?"Valuta tutti i requisiti per continuare.":"Rate all requirements to continue."}</p>}
      </div>
    </div>
    <div className="dfColHeaders"><div className="dfColH dfColHReq">{isIt?"Requisito · Valutazione":"Requirement · Rating"}</div><div className="dfColH dfColHCap">⬡ {isIt?"Capacità IBM Envizi":"IBM Envizi capability"}</div><div className="dfColH dfColHBen">{isIt?"Beneficio ESG Manager":"ESG Manager benefit"}</div></div>
    <FoundationGrid reqs={FR_REQUIREMENTS as Req[]} ratings={frRatings} setRating={setFrRating} language={language}/>
    <footer className="dfFooter"><p className="dfSources">{isIt?"Capacità basate su: ":"Capabilities based on: "}<a href="https://www.ibm.com/products/envizi/esg-reporting-frameworks" target="_blank" rel="noreferrer">ESG Reporting Frameworks ↗</a>{" · "}<a href="https://www.ibm.com/products/envizi/sustainability-reporting-manager" target="_blank" rel="noreferrer">Sustainability Reporting Manager ↗</a></p></footer>
  </main>;
}

interface FRConclusionProps extends CommonProps {
  frRatings: Record<string,DFRating>;
  missionOutcomes: Record<number,string>;
}

export function FrameworkConclusionScreen({ language, setLanguage, setScreen, reset, renderTrustBar, frRatings, missionOutcomes }: FRConclusionProps) {
  const isIt = language === "it";
  const frScore = Object.values(frRatings).reduce((s,v)=>s+(v==="medium"?7.5:v==="high"?10:0),0);
  const frPct = Math.min(100,Math.round(frScore));
  const frHighVery = frScore >= 50;
  const frHighMaybe = frScore >= 30;
  const frHighlight = frHighMaybe;
  const m5outcome = missionOutcomes[5] as Outcome | undefined;
  const decisionTaken = m5outcome ? (isIt ? {positive:"Un ESG Reporting Frameworks con gestione integrata dei requisiti",warning:"Tool documentale con template framework",critical:"File locali aggiornati manualmente"}[m5outcome] : {positive:"An ESG Reporting Frameworks with integrated requirements management",warning:"Document management tool with framework templates",critical:"Manually updated local files"}[m5outcome]) : null;
  const decisionImg = m5outcome === "positive" ? "./framework-envizi.png" : m5outcome === "warning" ? "./framework-intermediate.png" : "./framework-asis.png";
  const decisionColor = m5outcome === "positive" ? "#39efb4" : m5outcome === "warning" ? "#ffc07c" : "#ff7777";
  const accentColor = frHighVery ? "#39efb4" : frHighMaybe ? "#ffc07c" : "#57606a";
  return <main className="dfScreen">
    <header className="missionNav missionNavTrust"><button className="brand brandButton" onClick={reset}><span className="brandMark">e·</span><span>Envizi<br/>Impact Quest</span></button><div className="missionProgress"><span className="activeDot"/> {isIt?"FRAMEWORK ESG E DISCLOSURE":"ESG FRAMEWORKS AND DISCLOSURE"}</div>{renderTrustBar()}<button className="langMini" onClick={()=>setLanguage(language==="it"?"en":"it")}>{language==="it"?"EN":"IT"}</button></header>
    <div className="dfConclusionBody">
      <div className="dfcLeft">
        <p className="eyebrow" style={{letterSpacing:".18em",fontSize:"22px"}}>{isIt?"CONCLUSIONI · FRAMEWORK ESG E DISCLOSURE":"CONCLUSIONS · ESG FRAMEWORKS AND DISCLOSURE"}</p>
        <h1 className="dfcTitle" style={{fontWeight:800,lineHeight:1.1,marginBottom:4}}>{isIt?"La tua scelta per la gestione dei framework ESG":"Your ESG framework management choice"}</h1>
        <div className="dfcGaugeWrap">
          <ConclusionGauge score={frScore} max={60} accentColor={accentColor} isIt={isIt}/>
          <p className="dfcGaugeVerdict" style={{color:accentColor}}>{frHighVery?(isIt?"Molto probabilmente IBM Envizi è la soluzione per la tua gestione dei framework ESG.":"IBM Envizi is very likely the right solution for your ESG framework management needs."):frHighMaybe?(isIt?"Probabilmente IBM Envizi è la soluzione per la tua gestione dei framework ESG.":"IBM Envizi is probably the right solution for your ESG framework management needs."):(isIt?"Approfondisci con il tuo team IBM.":"Explore further with your IBM team.")}</p>
        </div>
        {decisionTaken&&<div className="dfcDecisionCard" style={{borderColor:decisionColor+"55"}}><img src={decisionImg} alt={decisionTaken} className="dfcDecisionCardImg"/><div className="dfcDecisionCardBody"><small className="dfcDecisionCardLabel">{isIt?"DECISIONE ADOTTATA · MISSIONE 06":"DECISION ADOPTED · MISSION 06"}</small><strong className="dfcDecisionCardValue" style={{color:decisionColor}}>{decisionTaken}</strong></div></div>}
        <div className="dfcActions">
          <button className="actionButton dfcActionSecondary" onClick={()=>setScreen("frameworkFoundation")}>{isIt?"← Indietro":"← Back"}</button>
          <button className="actionButton" style={{whiteSpace:"nowrap"}} onClick={()=>setScreen("challengeComplete3")}>{isIt?"Completa Sfida 3 →":"Complete Challenge 3 →"}</button>
        </div>
      </div>
      <ConclusionHighCards reqs={FR_REQUIREMENTS as Req[]} ratings={frRatings} language={language}/>
    </div>
  </main>;
}
