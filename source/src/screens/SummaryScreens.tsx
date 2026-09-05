import type { Priority, Outcome } from "../types";
import type { CommonProps, NeedItem } from "./types";
import { missionCatalog } from "../constants";

type NeedsByMission = [number, (NeedItem & { rank: number })[]][];

interface SummaryProps extends CommonProps {
  priorities: Priority[];
  priorityIncluded: Record<Priority, boolean>;
  missionOrder: number[];
  missionOutcomes: Record<number, string>;
  needsByMissionHub: NeedsByMission;
  calculatedTrustScore: number;
  decisionLabel: (missionIndex: number, outcome: Outcome) => string;
  outcomeLabel: (missionIndex: number, outcome: Outcome) => string;
  t: Record<string, any>;
}

export function SummaryScreen({
  language, setLanguage, setScreen, reset, renderTrustBar,
  priorities, priorityIncluded, missionOrder, missionOutcomes, needsByMissionHub,
  calculatedTrustScore, decisionLabel, outcomeLabel, t,
}: SummaryProps) {
  return <main className="summaryScreen">
    <header className="missionNav missionNavTrust"><button className="brand brandButton" onClick={reset}><span className="brandMark">e·</span><span>Envizi<br/>Impact Quest</span></button><div className="missionProgress"><span className="activeDot"/> ESG ROADMAP</div>{renderTrustBar()}<button className="langMini" onClick={()=>setLanguage(language==="it"?"en":"it")}>{language==="it"?"EN":"IT"}</button></header>
    <section className="summaryIntro">
      <p className="eyebrow">{t.summaryKicker}</p>
      <h1>{t.summaryTitle}</h1>
      <p>{t.summaryIntro}</p>
      <div className="summaryPriorities">
        <small>{t.topPriorities}</small>
        <div>{priorities.slice(0,3).map((p,i)=><span key={p} className={priorityIncluded[p]?"":"summaryPriorityExcluded"}><b>{String(i+1).padStart(2,"0")}</b>{t.priorityNames[p]}{!priorityIncluded[p]&&<small className="summaryPriorityExcludedNote">{language==="it"?" (escluso dall'analisi)":" (excluded from analysis)"}</small>}</span>)}</div>
      </div>
      {calculatedTrustScore>=80&&<div className="trustedBadgeSummary">★ {t.trustedLabel}</div>}
    </section>
    <section className="summaryGrid">
      {missionOrder.map((missionIndex,position)=>{
        const m=missionCatalog[missionIndex];
        const outcome=missionOutcomes[missionIndex] as Outcome | undefined;
        const assignedNeeds=needsByMissionHub.find(([mi])=>mi===missionIndex)?.[1]||[];
        const displayNeeds=missionIndex===0?[{id:"__foundation__",label:language==="it"?"Una data foundation solida e tracciabile":"A solid and traceable data foundation"},...assignedNeeds]:assignedNeeds;
        return <article className={`summaryCard ${outcome}`} key={m.value}>
          <div className="summaryCardTitle"><span>{String(position+1).padStart(2,"0")}</span><h2>{language==="it"?m.it:m.en}</h2></div>
          <div><small>{t.adoptedDecision}</small><strong>{outcome?decisionLabel(missionIndex,outcome):"—"}</strong></div>
          <div><small>{t.expectedImpact}</small><p>{outcome?outcomeLabel(missionIndex,outcome):"—"}</p></div>
          <div className="summaryParams"><small>{t.parameters}</small>{displayNeeds.length>0?displayNeeds.map(n=><span key={n.id}>⬡ {n.label}</span>):<span>—</span>}</div>
        </article>;
      })}
    </section>
    <footer className="summaryActions">
      <button className="secondaryAction" onClick={reset}>← {t.backStart}</button>
      <button className="actionButton" onClick={()=>setScreen("nextStep")}>{t.nextStep}<b>→</b></button>
    </footer>
  </main>;
}

interface NextStepProps extends CommonProps {
  priorities: Priority[];
  missionOrder: number[];
  missionOutcomes: Record<number, string>;
  missionParameters: Record<number, string[]>;
  trustScore: number;
  contactEmail: string;
  setContactEmail: (v: string) => void;
  approachBiz: string;
  approachData: string;
  decisionLabel: (missionIndex: number, outcome: Outcome) => string;
  missionItems: (missionIndex: number) => { title: string; detail: string; metric: string }[];
  missionUnits: (missionIndex: number) => string[];
  renderSaveBtn: (isIt: boolean) => JSX.Element;
  t: Record<string, any>;
  name: string;
  profile: import("../types").Profile;
}

export function NextStepScreen({
  language, setLanguage, setScreen, reset, renderTrustBar,
  priorities, missionOrder, missionOutcomes, missionParameters, trustScore,
  contactEmail, setContactEmail, approachBiz, approachData,
  decisionLabel, missionItems, missionUnits, renderSaveBtn, t, name, profile,
}: NextStepProps) {
  const isIt = language === "it";
  const top3 = priorities.slice(0,3).map((p,i)=>`${i+1}. ${t.priorityNames[p]}`).join(", ");
  const decisionsLine = missionOrder.map(mi=>{const o=missionOutcomes[mi];return o?`M${mi+1}: ${decisionLabel(mi,o as Outcome)}`:`M${mi+1}: —`;}).join(" | ");
  const paramsLine = missionOrder.map(mi=>{const vals=missionParameters[mi]||[];const items=missionItems(mi);const units=missionUnits(mi);const filled=items.map((item,i)=>vals[i]?`${item.title}: ${vals[i]} ${units[i]}`:"").filter(Boolean);return filled.length?`[M${mi+1}: ${filled.join(", ")}]`:"";}).filter(Boolean).join(" ");
  const toEmail = contactEmail.trim() || t.nextContactEmail;
  const subj = isIt?"Demo IBM Envizi — Envizi Impact Quest":"IBM Envizi Demo — Envizi Impact Quest";
  const pocSubj = isIt?"Proof of Concept IBM Envizi — Envizi Impact Quest":"IBM Envizi PoC — Envizi Impact Quest";
  const bvaSubj = isIt?"Business Value Assessment IBM Envizi — Envizi Impact Quest":"IBM Envizi BVA — Envizi Impact Quest";
  const commonBody = isIt
    ?`%0A%0A— Profilo: ${name} (${profile==="marco"?t.maleRole:t.femaleRole})%0A— Punteggio fiducia finale: ${trustScore}/100%0A— Top 3 priorità: ${top3}%0A— Decisioni: ${decisionsLine}${paramsLine?`%0A— Parametri AS-IS: ${paramsLine}`:""}${approachBiz?`%0A— Esigenze di business: ${approachBiz}`:""}${approachData?`%0A— Sfide sui dati: ${approachData}`:""}%0A%0AIn attesa di un riscontro.`
    :`%0A%0A— Profile: ${name} (${profile==="marco"?t.maleRole:t.femaleRole})%0A— Final trust score: ${trustScore}/100%0A— Top 3 priorities: ${top3}%0A— Decisions: ${decisionsLine}${paramsLine?`%0A— AS-IS parameters: ${paramsLine}`:""}${approachBiz?`%0A— Business needs: ${approachBiz}`:""}${approachData?`%0A— Data challenges: ${approachData}`:""}%0A%0ALooking forward to your reply.`;
  const demoBody = isIt
    ?`Ciao,%0A%0AHo completato l'Envizi Impact Quest e vorrei approfondire come IBM Envizi si integra nel nostro contesto con una demo.${commonBody}`
    :`Hi,%0A%0AI have completed the Envizi Impact Quest and would like to explore how IBM Envizi fits our context with a demo.${commonBody}`;
  const pocBody = isIt
    ?`Ciao,%0A%0AHo completato l'Envizi Impact Quest e sono interessato a un Proof of Concept con i dati reali della mia organizzazione.${commonBody}`
    :`Hi,%0A%0AI have completed the Envizi Impact Quest and I am interested in a Proof of Concept with my organisation's real data.${commonBody}`;
  const bvaBody = isIt
    ?`Ciao,%0A%0AHo completato l'Envizi Impact Quest e vorrei richiedere un Business Value Assessment per quantificare il valore di IBM Envizi per la mia organizzazione.${commonBody}`
    :`Hi,%0A%0AI have completed the Envizi Impact Quest and would like to request a Business Value Assessment to quantify the value of IBM Envizi for my organisation.${commonBody}`;
  return <main className="nextStepScreen">
    <header className="missionNav missionNavTrust"><button className="brand brandButton" onClick={reset}><span className="brandMark">e·</span><span>Envizi<br/>Impact Quest</span></button><div className="missionProgress"><span className="activeDot"/> NEXT STEP</div>{renderTrustBar()}<button className="langMini" onClick={()=>setLanguage(language==="it"?"en":"it")}>{language==="it"?"EN":"IT"}</button></header>
    <section className="nextStepBody">
      <p className="eyebrow">{t.nextKicker}</p>
      <h1>{t.nextTitle}</h1>
      <div className="nextStepCards">
        <div className="nextStepCard nextStepCardDemo">
          <small>{t.nextDemoLabel}</small>
          <p>{t.nextDemoIntro}</p>
          <div className="nextDemoEmailRow"><input className="nextDemoEmailInput" type="email" placeholder={t.nextDemoEmailPlaceholder} value={contactEmail} onChange={e=>setContactEmail(e.target.value)}/></div>
          <a className="nextStepBtn primary" href={`mailto:${toEmail}?subject=${subj}&body=${demoBody}`}>{t.nextDemoButton}</a>
          {!contactEmail.trim()&&<a className="nextDemoFallbackLink" href={`mailto:${t.nextContactEmail}?subject=${subj}&body=${demoBody}`}>{t.nextDemoFallback}</a>}
        </div>
        <div className="nextStepCard"><small>{t.nextPocLabel}</small><p>{t.nextPocIntro}</p><a className="nextStepBtn primary" href={`mailto:${toEmail||t.nextContactEmail}?subject=${pocSubj}&body=${pocBody}`}>{t.nextPocButton}</a></div>
        <div className="nextStepCard"><small>{t.nextBvaLabel}</small><p>{t.nextBvaIntro}</p><a className="nextStepBtn primary" href={`mailto:${toEmail||t.nextContactEmail}?subject=${bvaSubj}&body=${bvaBody}`}>{t.nextBvaButton}</a></div>
        <div className="nextStepCard"><small>{t.nextSiteLabel}</small><p>{t.nextSiteIntro}</p><a className="nextStepBtn primary" href="https://www.ibm.com/it-it/products/envizi" target="_blank" rel="noreferrer">{t.nextSiteButton}</a></div>
      </div>
      <div className="nextStepContact"><small>{t.nextContactLabel}</small><strong>{t.nextContactName}</strong><span>{t.nextContactRole}</span><a href={`mailto:${t.nextContactEmail}`}>{t.nextContactEmail}</a></div>
      <div className="nextStepActions">
        <button className="secondaryAction" onClick={reset}>← {t.backStart}</button>
        <button className="actionButton" onClick={()=>setScreen("thankYou")}>{t.nextStep}<b>→</b></button>
      </div>
    </section>
  </main>;
}

interface ThankYouProps extends CommonProps {
  t: Record<string, any>;
}

export function ThankYouScreen({ language, setLanguage, reset, goBack, renderTrustBar, t }: ThankYouProps) {
  return <main className="thankYouScreen">
    <header className="missionNav"><button className="brand brandButton" onClick={reset}><span className="brandMark">e·</span><span>Envizi<br/>Impact Quest</span></button><div className="missionProgress"><span className="activeDot"/> FINAL</div><div className="introNavRight"><button className="introBackBtn" onClick={()=>goBack()}>← {language==="it"?"Indietro":"Back"}</button><button className="langMini" onClick={()=>setLanguage(language==="it"?"en":"it")}>{language==="it"?"EN":"IT"}</button></div></header>
    <section className="thankYouBody"><h1>{t.thankYouTitle}</h1></section>
  </main>;
}

interface MilestoneProps extends CommonProps {
  missionOutcomes: Record<number, string>;
  renderSaveBtn: (isIt: boolean) => JSX.Element;
  name: string;
}

export function MilestoneScreen({ language, profile, setLanguage, setScreen, reset, goBack, renderTrustBar, missionOutcomes, renderSaveBtn, name }: MilestoneProps) {
  const isTrusted = missionOutcomes[0] === "positive";
  const isIt = language === "it";
  const milestoneText = isTrusted
    ? (isIt ? "Complimenti, hai sbloccato il livello Trusted ESG Data Manager." : "Congratulations, you have unlocked the Trusted ESG Data Manager level.")
    : (isIt ? "Avviare la digitalizzazione dell\u2019ESG in modo semplice, con moduli per la raccolta dati e senza integrazione delle fonti, pu\u00f2 essere un\u2019ottima decisione per contenere costi e rischi iniziali. Anche in questo contesto IBM Envizi pu\u00f2 diventare fattore critico di successo per la tua iniziativa. Verifica quali requisiti della gestione dati sono comunque importanti per te e il valore di Envizi a supporto." : "Starting ESG digitalisation simply, with data collection forms and without source integration, can be an excellent decision to contain initial costs and risks. Even in this context, IBM Envizi can become a critical success factor for your initiative. Check which data management requirements are still important to you and the value Envizi can provide.");
  return (
    <main className="thankYouScreen">
      <header className="missionNav">
        <button className="brand brandButton" onClick={reset}><span className="brandMark">e·</span><span>Envizi<br/>Impact Quest</span></button>
        <div className="missionProgress"><span className="activeDot"/> MILESTONE</div>
        <button className="langMini" onClick={()=>setLanguage(language==="it"?"en":"it")}>{language==="it"?"EN":"IT"}</button>
      </header>
      <section className="thankYouBody" style={{display:"grid",gridTemplateColumns:"1fr 1fr",alignItems:"center",gap:"0",padding:"0",overflow:"hidden"}}>
        <div style={{height:"100%",overflow:"hidden"}}>
          <img src={`./characters/${profile}-${isTrusted?"success":"neutral"}.png`} alt={name} style={{width:"100%",height:"100%",objectFit:"cover",objectPosition:"center top",display:"block"}}/>
        </div>
        <div style={{padding:"3vw 4vw",display:"flex",flexDirection:"column",gap:"16px"}}>
          <h1 style={{color:isTrusted?"#39efb4":"#ffc07c",fontSize:isTrusted?"clamp(24px,3vw,44px)":"clamp(28px,3vw,40px)",lineHeight:1.5,letterSpacing:"-.02em",margin:0}}>
            {milestoneText}
          </h1>
          <div style={{display:"flex",gap:"12px",flexWrap:"wrap"}}>
            <button className="secondaryAction" onClick={()=>goBack()}>{isIt?"\u2190 Indietro":"\u2190 Back"}</button>
            <button className="actionButton" style={{width:"auto",marginTop:0,padding:"12px 16px"}} onClick={()=>setScreen("asis")}>{isIt?"Approfondiamo perch\u00e9 Envizi \u2192":"Let\u2019s explore why Envizi \u2192"}</button>
          </div>
          {renderSaveBtn(isIt)}
        </div>
      </section>
    </main>
  );
}
