import type { Outcome, Profile } from "../types";
import type { CommonProps } from "./types";
import { missionCatalog, imageFor } from "../constants";
import { lookup4x4 } from "../4x4Matrix";

interface ActiveScenario {
  briefing: string;
  objectiveText: string;
  asIsTitle: string;
  asIsIntro: string;
  asIsItems: {title:string;detail:string;metric:string}[];
  decisionIntro: string;
  optionA: string; optionADetail: string;
  optionB: string; optionBDetail: string;
  optionC: string; optionCDetail: string;
  successTitle: string; successText: string;
  warningTitle: string; warningText: string;
  criticalTitle: string; criticalText: string;
  metricLabels: string[];
  enviziValue: string;
}

interface TrustStep {
  label: string;
  val: number | null;
  isCurrent: boolean;
  fill: string;
  stroke: string;
  strokeW: string;
}

interface MissionFlowProps extends CommonProps {
  screen: string;
  selectedMission: number;
  missionOutcomes: Record<number, string>;
  active: ActiveScenario;
  asIsRatings: Record<number, ("alto"|"medio"|"basso")[]>;
  setAsIsRatings: React.Dispatch<React.SetStateAction<Record<number, ("alto"|"medio"|"basso")[]>>>;
  negativeChoice: "form" | "postpone";
  pendingOutcome: Outcome;
  missionParameters: Record<number, string[]>;
  companyDims: [number,number,number,number,number];
  displayCompanyName: string;
  activeTrustIntro: string;
  activeTrustSources?: {label:string;url:string}[];
  trustSteps: TrustStep[];
  trustTotalW: number;
  TRUST_BAR_W: number;
  TRUST_BAR_GAP: number;
  TRUST_CHART_H: number;
  TRUST_SVG_PAD_X: number;
  resultValues: string[];
  setPmMissionFilter: (v: number | null) => void;
  setPmFromBriefing: (v: boolean) => void;
  renderSaveBtn: (isIt: boolean) => JSX.Element;
  missionItems: (missionIndex: number) => {title:string;detail:string;metric:string}[];
  missionUnits: (missionIndex: number) => string[];
  t: Record<string, any>;
  name: string;
}

export function MissionFlowScreen({
  language, profile, setLanguage, setScreen, reset, goBack,
  screen, selectedMission, missionOutcomes, active, asIsRatings, setAsIsRatings,
  negativeChoice, pendingOutcome, missionParameters, companyDims, displayCompanyName,
  activeTrustIntro, activeTrustSources, trustSteps, trustTotalW,
  TRUST_BAR_W, TRUST_BAR_GAP, TRUST_CHART_H, TRUST_SVG_PAD_X,
  resultValues, setPmMissionFilter, setPmFromBriefing, renderSaveBtn,
  missionItems, missionUnits, t, name,
}: MissionFlowProps) {
  const result = screen === "negative" || screen === "success";

  const tobeDeltas: {[mi:number]:{positive:(number|null)[],warning:(number|null)[],critical:(number|null)[]}} = {
    0:{positive:[0.83,0.38,0.17,0.10],warning:[0.92,0.72,0.78,0.60],critical:[1,1,1,1]},
    1:{positive:[0.82,0.88,0.13,0.18],warning:[0.93,0.95,0.48,0.55],critical:[1,1,1,1]},
    2:{positive:[null,0.62,null,0.12],warning:[null,0.80,null,0.45],critical:[null,1,null,1]},
    3:{positive:[0.33,0.21,0.12,0.28],warning:[0.72,0.65,0.55,0.60],critical:[1,1,1,1]},
    4:{positive:[null,null,3.2,0.55],warning:[null,null,1.8,0.75],critical:[null,null,1,1]},
    5:{positive:[null,0.26,0.12,0.22],warning:[null,0.70,0.52,0.61],critical:[null,1,1,1]},
  };

  return <main className={`missionScreen mission-${selectedMission} ${screen} ${screen==="negative"?(negativeChoice==="form"?"formOutcome":"asIsOutcome"):""}`}>
    <header className="missionNav">
      <button className="brand brandButton" onClick={reset}><span className="brandMark">e·</span><span>Envizi<br/>Impact Quest</span></button>
      <div className="missionProgress"><span className="activeDot"/> {t.mission} <b>{String(selectedMission+1).padStart(2,"0")}</b><i>/</i>06</div>
      <button className="langMini" onClick={()=>setLanguage(language==="it"?"en":"it")}>{language==="it"?"EN":"IT"}</button>
    </header>
    <section className="characterStage">
      <img src={imageFor(profile,screen)} alt={`${name} · ${screen}`}/>
      <div className="characterTag"><span className="statusDot"/><div><small>ESG MANAGER</small><strong>{name}</strong></div></div>
      {screen==="trust"&&<button className="actionButton trustStageCta" onClick={()=>setScreen(selectedMission===0?"milestone":"asis")}>{t.trustContinue}<b>→</b></button>}
    </section>
    <section className="missionContent">
      <div className="missionLabel"><span>{t.mission} {String(selectedMission+1).padStart(2,"0")}</span><i>90 DAYS</i></div>

      {screen==="briefing"&&(()=>{
        const effects = (t.crossEffects[selectedMission]||[]).filter((e:any) => { const o=missionOutcomes[e.from]; return o&&(e[o as keyof typeof e] as string|null)!==null; });
        return <>
          <h1>{language==="it"?missionCatalog[selectedMission].it:missionCatalog[selectedMission].en}</h1>
          <div className="companyChip"><strong>{displayCompanyName}</strong><span>{t.companyFacts}</span></div>
          {effects.length>0&&<div className="crossEffectBanners">{effects.map((e:any)=>{const o=missionOutcomes[e.from] as Outcome;const msg=e[o as keyof typeof e] as string;return<div key={e.from} className={`crossEffectBanner ${o}`}><span className="crossEffectIcon">{o==="positive"?"✓":"!"}</span><p><strong>{t.crossEffectLabel} · {language==="it"?missionCatalog[e.from].it:missionCatalog[e.from].en}:</strong> {msg}</p></div>})}</div>}
          <p className="storyText">{(active.briefing as string).replace("COMPANY_NAME",displayCompanyName).replace("PLANTS_COUNT",String(companyDims[1]))}</p>
          <div className="objectiveBox"><small>{t.objective}</small><p>{active.objectiveText}</p></div>
          <button className="actionButton" onClick={()=>{if(selectedMission===0){setPmMissionFilter(0);setPmFromBriefing(true);setScreen("compare");}else{setScreen("asis");}}}>{t.analyse}<b>→</b></button>
        </>;
      })()}

      {screen==="asis"&&(()=>{
        const ratingVal = {"alto":25,"medio":12,"basso":0};
        const savedRatings = asIsRatings[selectedMission];
        const currentRatings: ("alto"|"medio"|"basso"|null)[] = savedRatings ?? active.asIsItems.map(()=>null);
        const allSelected = currentRatings.every(r=>r!==null);
        const total = allSelected ? (currentRatings as ("alto"|"medio"|"basso")[]).reduce((s,r)=>s+ratingVal[r],0) : null;
        const totalColor = total===null?"#5a7a70":total<=25?"#39efb4":total<=50?"#f5c542":"#ff6b6b";
        const totalLabel = total===null?"—":language==="it"?(total<=25?"BASSA":total<=50?"MEDIA":"ALTA"):(total<=25?"LOW":total<=50?"MEDIUM":"HIGH");
        const setRating = (i:number,v:"alto"|"medio"|"basso")=>{const next=[...currentRatings] as ("alto"|"medio"|"basso"|null)[];next[i]=v;setAsIsRatings({...asIsRatings,[selectedMission]:next as ("alto"|"medio"|"basso")[]});};
        const matrixEntry = (selectedMission===0 && allSelected) ? lookup4x4(currentRatings as ("alto"|"medio"|"basso")[]) : null;
        const fitColor = matrixEntry ? (matrixEntry.fitEnvizi==="strategico"?"#ff6b6b":matrixEntry.fitEnvizi==="strutturale"?"#f5c542":matrixEntry.fitEnvizi==="evolutivo"?"#ffab77":"#7a9a90") : "#7a9a90";
        return <>
          <div className="asisHeader"><div><p className="resultEyebrow">{t.asIsKicker}</p><h1>{active.asIsTitle}</h1></div></div>
          <p className="storyText asisIntroText">{(active.asIsIntro as string).replace("COMPANY_NAME",displayCompanyName)}</p>
          <div className="asisMainLayoutWithPanel">
            <div className="asisLeftCol">
              <div className="asIsRatingGrid">{active.asIsItems.map((item,i)=>{const r=currentRatings[i];return<article key={item.title} className={`asIsRatingCard${r?" asIsRating-"+r:""}`}><div className="asIsRatingCardTop"><h2>{item.title}</h2><p>{item.detail}</p></div><div className="asIsRatingButtons"><button className={`asIsRatingBtn${r==="alto"?" asIsRatingBtnActive asIsRatingBtnAlto":""}`} onClick={()=>setRating(i,"alto")}>{language==="it"?"Alto":"High"}</button><button className={`asIsRatingBtn${r==="medio"?" asIsRatingBtnActive asIsRatingBtnMedio":""}`} onClick={()=>setRating(i,"medio")}>{language==="it"?"Medio":"Medium"}</button><button className={`asIsRatingBtn${r==="basso"?" asIsRatingBtnActive asIsRatingBtnBasso":""}`} onClick={()=>setRating(i,"basso")}>{language==="it"?"Basso":"Low"}</button></div></article>})}</div>
              {allSelected&&<div className="asisTotal"><span className="asisTotalLabel" style={{color:totalColor}}>{language==="it"?"Criticità totale":"Total criticality"}</span><span className="asisTotalScore" style={{color:totalColor}}>{total}<span className="asisTotalMax">/100</span></span><span className="asisTotalBadge" style={{color:totalColor,borderColor:totalColor}}>{totalLabel}</span></div>}
              <div style={{display:"flex",justifyContent:"space-between",alignItems:"center",marginTop:"8px"}}>
                <button className="introBackBtn" onClick={()=>goBack()}>← {language==="it"?"Indietro":"Back"}</button>
                <button className="actionButton asisBottomBtn" onClick={()=>setScreen(selectedMission===0?"dataFoundation":selectedMission===1?"energyFoundation":selectedMission===2?"supplyFoundation":selectedMission===3?"reportingFoundation":selectedMission===4?"planningFoundation":selectedMission===5?"frameworkFoundation":"missions")}>{language==="it"?"Continua →":"Continue →"}<b>→</b></button>
              </div>
            </div>
            {selectedMission===0&&<aside className="asisInsightPanel">
              {matrixEntry ? <>
                <div className="asisInsightHeader">
                  <small className="asisInsightKicker">{language==="it"?"DIAGNOSI 4×4":"4×4 DIAGNOSIS"}</small>
                  <h3 className="asisInsightTitle">{matrixEntry.diagnosi}</h3>
                  <span className="asisInsightFitBadge" style={{borderColor:fitColor,color:fitColor}}>{language==="it"?"ADEGUATEZZA SOLUZIONE":"SOLUTION FIT"} · {matrixEntry.fitEnvizi.toUpperCase()}</span>
                </div>
                <p className="asisInsightCopy">{matrixEntry.copyApp}</p>
                <div className="asisInsightRec">
                  <small className="asisInsightRecLabel">{language==="it"?"RACCOMANDAZIONE":"RECOMMENDATION"}</small>
                  <p className="asisInsightRecText">{matrixEntry.raccomandazione}</p>
                </div>
              </> : <p className="asisInsightEmpty">{language==="it"?"Seleziona tutti i valori per vedere la diagnosi.":"Select all values to see the diagnosis."}</p>}
            </aside>}
          </div>
        </>;
      })()}

      {screen==="tobe"&&(()=>{
        const items = missionItems(selectedMission);
        const units = missionUnits(selectedMission);
        const userVals = missionParameters[selectedMission]||[];
        const deltas = tobeDeltas[selectedMission]?.[pendingOutcome]||items.map(()=>null);
        const outcomeColor = pendingOutcome==="positive"?"#39efb4":pendingOutcome==="warning"?"#ffc07c":"#ff7777";
        const outcomeLabel2 = pendingOutcome==="positive"?(language==="it"?"Scelta A — Envizi":"Option A — Envizi"):pendingOutcome==="warning"?(language==="it"?"Scelta B — Soluzione intermedia":"Option B — Intermediate"):language==="it"?"Scelta C — Rimandare":"Option C — Postpone";
        return <>
          <div className="tobeIntro"><p className="eyebrow">{t.tobeKicker}</p><h1>{t.tobeTitle}</h1><p className="tobeSubtitle">{t.tobeSubtitle}</p><div className="tobeChoiceBadge" style={{borderColor:outcomeColor,color:outcomeColor}}>{outcomeLabel2}</div></div>
          <div className="tobeGrid">{items.map((item,i)=>{
            const raw=userVals[i]?parseFloat(userVals[i]):null;
            const factor=deltas[i];
            const hasDelta=factor!==null&&factor!==1;
            const tobeVal=raw!==null&&factor!==null?raw*factor:null;
            const isImprovement=factor!==null&&factor<1;
            const isWorse=factor!==null&&factor>1;
            const deltaSign=isImprovement?"↓":isWorse?"↑":"—";
            const deltaColor=isImprovement?outcomeColor:isWorse?"#ff7777":"#7a9a90";
            return <article key={item.title} className={`tobeCard${hasDelta?" tobeCardChanged":""}`}>
              <div className="tobeCardHeader"><span className="tobeCardNum">{String(i+1).padStart(2,"0")}</span><strong>{item.title}</strong></div>
              <div className="tobeRow">
                <div className="tobeCol"><small>{t.tobeAsIs}</small><b>{raw!==null?`${raw} ${units[i]}`:item.metric}</b></div>
                <div className="tobeArrow" style={{color:deltaColor}}>{deltaSign}</div>
                <div className="tobeCol tobeColNew"><small>{t.tobeToBe}</small><b style={{color:tobeVal!==null?outcomeColor:undefined}}>{tobeVal!==null?`${tobeVal%1===0?tobeVal:tobeVal.toFixed(1)} ${units[i]}`:factor===1?(language==="it"?"Invariato":"Unchanged"):(language==="it"?"n.d.":"n/a")}</b></div>
              </div>
              {hasDelta&&tobeVal!==null&&raw!==null&&<div className="tobeDeltaBar"><span className="tobeDeltaLabel">{language==="it"?(isImprovement?"Riduzione":"Aumento"):(isImprovement?"Reduction":"Increase")}</span><span className="tobeDeltaVal" style={{color:deltaColor}}>{isImprovement?`−${Math.round((1-factor!)*100)}%`:`+${Math.round((factor!-1)*100)}%`}</span></div>}
            </article>;
          })}</div>
          <button className="actionButton tobeConfirmBtn" onClick={()=>setScreen(pendingOutcome==="positive"?"success":"negative")}>{t.tobeConfirm}<b>→</b></button>
        </>;
      })()}

      {screen==="trust"&&<>
        <p className="resultEyebrow">{t.trustKicker}</p>
        <h1>{t.trustTitle}</h1>
        <p className="storyText">{activeTrustIntro}</p>
        {activeTrustSources&&activeTrustSources.length>0&&<p className="trustSourceList">{language==="it"?"Fonti: ":"Sources: "}{activeTrustSources.map((s,i)=><><a key={s.url} href={s.url} target="_blank" rel="noreferrer">{s.label} ↗</a>{i<activeTrustSources.length-1&&" · "}</> )}</p>}
        <div className="trustEvolutionChart">
          <small className="trustChartLabel">{language==="it"?"Evoluzione missione per missione":"Mission-by-mission evolution"}</small>
          <svg width="100%" viewBox={"0 0 "+trustTotalW+" "+(TRUST_CHART_H+40)} preserveAspectRatio="xMidYMid meet">
            {[30,50,70,100].map(v=>{const y=4+TRUST_CHART_H-(v/100)*TRUST_CHART_H;return<g key={v}><line x1={TRUST_SVG_PAD_X} x2={trustTotalW-TRUST_SVG_PAD_X} y1={y} y2={y} stroke="#1e3a30" strokeWidth="1" strokeDasharray="3 4"/><text x={TRUST_SVG_PAD_X-2} y={y+4} fontSize="8" fill="#4a6d60" textAnchor="end">{v}</text></g>;})}
            {trustSteps.map((s,i)=>{
              const x=TRUST_SVG_PAD_X+i*(TRUST_BAR_W+TRUST_BAR_GAP);
              const isEmpty=s.val===null;
              const barH=isEmpty?12:(s.val!/100)*TRUST_CHART_H;
              const barY=4+TRUST_CHART_H-barH;
              return <g key={i}>
                {s.isCurrent&&<rect x={x-5} y={4} width={TRUST_BAR_W+10} height={TRUST_CHART_H+8} rx="8" fill="rgba(57,239,180,0.07)" stroke={s.fill==="none"?"#39efb4":s.fill} strokeWidth="1.5" strokeDasharray={s.fill==="none"?"4 3":"0"}/>}
                <rect x={x} y={isEmpty?barY+barH-12:barY} width={TRUST_BAR_W} height={isEmpty?12:barH} rx="5" fill={isEmpty?"none":s.fill} stroke={s.stroke} strokeWidth={s.strokeW} opacity={isEmpty?1:0.92}/>
                {!isEmpty&&<text x={x+TRUST_BAR_W/2} y={barY-5} fontSize="11" fill={i===0?"#7fa898":s.isCurrent?"#f2fff9":"#c9e8dc"} textAnchor="middle" fontWeight={s.isCurrent?"700":"400"}>{s.val}</text>}
                {isEmpty&&<text x={x+TRUST_BAR_W/2} y={barY+barH/2+5} fontSize="9" fill="#3d6052" textAnchor="middle">—</text>}
                <text x={x+TRUST_BAR_W/2} y={4+TRUST_CHART_H+18} fontSize="8" fill={s.isCurrent?"#39efb4":"#4a6d60"} textAnchor="middle" fontWeight={s.isCurrent?"700":"400"}>{s.label.split("\n").map((l,li)=><tspan key={li} x={x+TRUST_BAR_W/2} dy={li===0?0:10}>{l}</tspan>)}</text>
              </g>;
            })}
          </svg>
        </div>
      </>}

      {result&&<>
        <p className="resultEyebrow">{screen==="success"?active.enviziValue:t.impact}</p>
        <h1>{screen==="success"?active.successTitle:negativeChoice==="form"?active.warningTitle:active.criticalTitle}</h1>
        <p className="storyText">{screen==="success"?active.successText:negativeChoice==="form"?active.warningText:active.criticalText}</p>
        {screen==="success"&&<div className="enviziFactChip"><span className="efcNumber">40.000+</span><div className="efcText"><span className="efcLabel">{t.efcLabel}</span><span className="efcDetail">{t.efcByMission[selectedMission]}</span><span className="efcSource"><a href="https://www.ibm.com/docs/it/envizi-esg-suite?topic=reference-emission-factors" target="_blank" rel="noreferrer">{language==="it"?"Libreria fattori Envizi ↗":"Envizi factor library ↗"}</a>{" · "}<span>{language==="it"?"Compatibile anche con ecoinvent":"Also compatible with ecoinvent"}</span></span></div></div>}
        <div className="metrics">
          <div><span>{active.metricLabels[0]}</span><strong>{resultValues[0]}</strong></div>
          <div><span>{active.metricLabels[1]}</span><strong>{resultValues[1]}</strong></div>
          <div><span>{active.metricLabels[2]}</span><strong>{resultValues[2]}</strong></div>
        </div>
        <blockquote className="boardQuote"><small>{t.boardQuoteLabel} · CFO, {displayCompanyName}</small><p>"{t.boardQuotes[selectedMission][screen==="success"?"positive":negativeChoice==="form"?"warning":"critical"]}"</p></blockquote>
        <button className="actionButton" onClick={()=>setScreen(selectedMission===0?"milestone":"missions")}>{t.backScenarios}<b>→</b></button>
        {screen==="success"&&renderSaveBtn(language==="it")}
      </>}

    </section>
  </main>;
}
