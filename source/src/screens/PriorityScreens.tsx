import React, { useState, useEffect } from "react";
import type { Priority } from "../types";
import type { CommonProps, NeedItem } from "./types";
import { missionCatalog } from "../constants";

type NeedsByMission = [number, (NeedItem & { rank: number })[]][];

// ── approachDataCopy ─────────────────────────────────────────────────────────

interface ApproachDataCopyProps extends CommonProps {
  t: Record<string, any>;
}

export function ApproachDataCopyScreen({ language, setLanguage, setScreen, reset, t }: ApproachDataCopyProps) {
  const isIt = language === "it";
  const [zoomWarnOpen,setZoomWarnOpen]=React.useState(false);
  React.useEffect(()=>{
    const handler=(e:KeyboardEvent)=>{
      const mod=e.metaKey||e.ctrlKey;
      if(!mod)return;
      if(e.key==="+"||e.key==="="||e.key==="-"||e.key==="0"){e.preventDefault();setZoomWarnOpen(true);}
    };
    window.addEventListener("keydown",handler);
    return ()=>window.removeEventListener("keydown",handler);
  },[]);
  return <main className="approachIntroScreen" style={{position:"relative"}}>
    {zoomWarnOpen&&<div style={{position:"fixed",inset:0,zIndex:99999,background:"rgba(7,18,15,.82)",display:"flex",alignItems:"center",justifyContent:"center"}} onClick={()=>setZoomWarnOpen(false)}><div style={{background:"#0d1f19",border:"1px solid rgba(57,239,180,.3)",borderRadius:"14px",padding:"28px 32px",maxWidth:"380px",width:"90vw",textAlign:"center",boxShadow:"0 8px 40px rgba(0,0,0,.6)"}} onClick={e=>e.stopPropagation()}><p style={{margin:"0 0 8px",fontSize:"13px",fontFamily:"var(--font-geist-mono,monospace)",letterSpacing:".14em",textTransform:"uppercase",color:"#39efb4"}}>{isIt?"Attenzione":"Warning"}</p><p style={{margin:"0 0 20px",fontSize:"15px",color:"#e8f5ef",lineHeight:1.5}}>{isIt?"Il rapporto di visualizzazione è ottimizzato per questa schermata. Sei sicuro di voler cambiare lo zoom?":"The display ratio is optimised for this screen. Are you sure you want to change the zoom?"}</p><div style={{display:"flex",gap:"10px",justifyContent:"center"}}><button style={{padding:"8px 22px",borderRadius:"8px",border:"1px solid rgba(57,239,180,.35)",background:"transparent",color:"#39efb4",fontSize:"14px",cursor:"pointer",fontFamily:"inherit"}} onClick={()=>setZoomWarnOpen(false)}>{isIt?"Annulla":"Cancel"}</button><button style={{padding:"8px 22px",borderRadius:"8px",border:"1px solid #c84040",background:"rgba(200,64,64,.12)",color:"#ff8080",fontSize:"14px",cursor:"pointer",fontFamily:"inherit"}} onClick={()=>setZoomWarnOpen(false)}>{isIt?"Continua comunque":"Continue anyway"}</button></div></div></div>}
    <div style={{position:"fixed",top:0,left:0,right:0,height:"4px",background:"#3b82f4",zIndex:9999,pointerEvents:"none"}}/>
    <div style={{position:"fixed",bottom:0,left:0,right:0,height:"4px",background:"#39efb4",zIndex:9999,pointerEvents:"none"}}/>
    <header className="missionNav"><button className="brand brandButton" onClick={reset}><span className="brandMark">e·</span><span>Envizi<br/>Impact Quest</span></button><div className="missionProgress"><span className="activeDot"/> IL PERCORSO</div><button className="langMini" onClick={()=>setLanguage(language==="it"?"en":"it")}>{language==="it"?"EN":"IT"}</button></header>
    <section className="approachIntroBody approachIntroBodyWithImg">
      <div className="approachIntroLeft">
        <h1 className="approachIntroTitle">{t.approachDataTitle}</h1>
        <div className="approachIntroText">{(t.approachDataBody as string[]).map((para,i)=><p key={i}>{para}</p>)}</div>
        <button className="actionButton approachIntroCta" onClick={()=>setScreen("priorityData")}>{t.approachDataCta}<b>→</b></button>
      </div>
      <div className="approachIntroRight">
        <img src="./step-2.svg" className="approachIntroStepBadge" alt="Step 2"/>
        <img src="./logica-issue.png" className="approachIntroImg" alt="Criticità dati ESG"/>
        <p className="approachIntroImgCaption approachIntroImgCaptionSm">{t.approachDataExample as string}</p>
      </div>
    </section>
  </main>;
}

// ── priorities ───────────────────────────────────────────────────────────────

interface PrioritiesProps extends CommonProps {
  priorities: Priority[];
  priorityIncluded: Record<Priority, boolean>;
  togglePriorityIncluded: (p: Priority) => void;
  rankPriority: (fromIdx: number, toRank: number) => void;
  prioExperience: Record<Priority, string>;
  setPrioExpModal: (p: Priority | null) => void;
  prioExpModal: Priority | null;
  prioExpMode: "scratch" | "scenario";
  setPrioExpMode: (mode: "scratch" | "scenario") => void;
  prioExpSelected: Record<Priority, number>;
  setPrioExpSelected: React.Dispatch<React.SetStateAction<Record<Priority, number>>>;
  setPrioExperience: React.Dispatch<React.SetStateAction<Record<Priority, string>>>;
  prioDefaultExp: Record<Priority, Record<"it"|"en", [string,string,string]>>;
  displayCompanyName: string;
  renderTrustBar: () => JSX.Element;
  t: Record<string, any>;
  name: string;
  onSave?: (name: string) => void;
  defaultSaveName?: string;
}

export function PrioritiesScreen({
  language, profile, setLanguage, setScreen, reset, renderTrustBar,
  priorities, priorityIncluded, togglePriorityIncluded, rankPriority,
  prioExperience, setPrioExpModal, prioExpModal, prioExpMode, setPrioExpMode,
  prioExpSelected, setPrioExpSelected, setPrioExperience, prioDefaultExp,
  displayCompanyName, t, name, onSave, defaultSaveName,
}: PrioritiesProps) {
  const isIt = language === "it";
  const prioImg: Record<Priority, string> = {credit:"./obj-credit.png",compliance:"./obj-compliance.png",customers:"./obj-customers.png",efficiency:"./obj-efficiency.png",supply:"./obj-supply.png",reputation:"./obj-reputation.png"};
  const [saveName, setSaveName] = React.useState(defaultSaveName || "");
  const [saved, setSaved] = React.useState(false);
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
  return <main className="priorityScreen priorityScreenCards" style={{position:"relative"}}>
    {zoomWarnOpen&&<div style={{position:"fixed",inset:0,zIndex:99999,background:"rgba(7,18,15,.82)",display:"flex",alignItems:"center",justifyContent:"center"}} onClick={()=>setZoomWarnOpen(false)}><div style={{background:"#0d1f19",border:"1px solid rgba(57,239,180,.3)",borderRadius:"14px",padding:"28px 32px",maxWidth:"380px",width:"90vw",textAlign:"center",boxShadow:"0 8px 40px rgba(0,0,0,.6)"}} onClick={e=>e.stopPropagation()}><p style={{margin:"0 0 8px",fontSize:"13px",fontFamily:"var(--font-geist-mono,monospace)",letterSpacing:".14em",textTransform:"uppercase",color:"#39efb4"}}>{isIt?"Attenzione":"Warning"}</p><p style={{margin:"0 0 20px",fontSize:"15px",color:"#e8f5ef",lineHeight:1.5}}>{isIt?"Il rapporto di visualizzazione è ottimizzato per questa schermata. Sei sicuro di voler cambiare lo zoom?":"The display ratio is optimised for this screen. Are you sure you want to change the zoom?"}</p><div style={{display:"flex",gap:"10px",justifyContent:"center"}}><button style={{padding:"8px 22px",borderRadius:"8px",border:"1px solid rgba(57,239,180,.35)",background:"transparent",color:"#39efb4",fontSize:"14px",cursor:"pointer",fontFamily:"inherit"}} onClick={()=>setZoomWarnOpen(false)}>{isIt?"Annulla":"Cancel"}</button><button style={{padding:"8px 22px",borderRadius:"8px",border:"1px solid #c84040",background:"rgba(200,64,64,.12)",color:"#ff8080",fontSize:"14px",cursor:"pointer",fontFamily:"inherit"}} onClick={()=>setZoomWarnOpen(false)}>{isIt?"Continua comunque":"Continue anyway"}</button></div></div></div>}
    <div style={{position:"fixed",top:0,left:0,right:0,height:"4px",background:"#3b82f4",zIndex:9999,pointerEvents:"none"}}/>
    <div style={{position:"fixed",bottom:0,left:0,right:0,height:"4px",background:"#39efb4",zIndex:9999,pointerEvents:"none"}}/>
    <header className="missionNav missionNavTrust">
      <button className="brand brandButton" onClick={reset}><span className="brandMark">e·</span><span>Envizi<br/>Impact Quest</span></button>
      <div className="missionProgress"><span className="activeDot"/> BUSINESS PRIORITIES</div>
      {renderTrustBar()}
      <button className="langMini" onClick={()=>setLanguage(language==="it"?"en":"it")}>{language==="it"?"EN":"IT"}</button>
    </header>
    <div className="prioCardsLayout">
      <div className="prioCardsIntro">
        <p className="eyebrow">{t.priorityKicker}</p>
        <h1>{t.priorityTitle}</h1>
        <p>{(t.priorityIntro as string).replace("COMPANY_NAME",displayCompanyName)}</p>
        <div className="priorityPersona">
          <img src={`./characters/${profile}-neutral.png`} alt={name}/>
          <div><strong>{name}</strong><small>ESG MANAGER</small></div>
        </div>
      </div>
      <div className="prioCardsArea">
        <div className="prioCardGrid">
          {priorities.map((p,i)=>(
            <div key={p} className={`prioCard${i<3?" prioCardTop":""}`}>
              <div className="prioCardRank">{String(i+1).padStart(2,"0")}</div>
              <img className="prioCardImg" src={prioImg[p]} alt={t.priorityNames[p]}/>
              <div className="prioCardBody">
                <strong className="prioCardName">{t.priorityNames[p]}</strong>
                <span className="prioCardDetail">{t.priorityDetails[p]}</span>
                <button className="prioIncludeToggle" onClick={()=>togglePriorityIncluded(p)} aria-pressed={priorityIncluded[p]} title={isIt?"Includi in analisi":"Include in analysis"}>
                  <span className={`prioIncludeDot${priorityIncluded[p]?" prioIncludeDotOn":""}`}/>
                  {isIt?"Includi in analisi":"Include in analysis"}
                </button>
                <button className="prioExpLink" onClick={()=>setPrioExpModal(p)}>
                  {prioExperience[p]?<span className="prioExpDot"/>:null}
                  {isIt?"✏ Racconta la tua esperienza":"✏ Share your experience"}
                </button>
              </div>
              <div className="prioCardMove">
                <button className="prioMoveBtn" onClick={()=>rankPriority(i,i)} disabled={i===0} aria-label={t.moveUp}>▲</button>
                <button className="prioMoveBtn" onClick={()=>rankPriority(i,i+2)} disabled={i===priorities.length-1} aria-label={t.moveDown}>▼</button>
              </div>
            </div>
          ))}
        </div>
        <button className="actionButton prioCardsConfirmBtn" onClick={()=>{localStorage.setItem("envizi-quest-priorities",JSON.stringify(priorities));setScreen("approachDataCopy")}}>{isIt?"Avanti":"Next"}<b>→</b></button>
      </div>
    </div>
    {prioExpModal&&(()=>{
      const p = prioExpModal;
      const phrases = prioDefaultExp[p][language as "it"|"en"];
      const selIdx = prioExpSelected[p];
      const modalMode = prioExpMode;
      const edited = prioExperience[p];
      const scenarioValue = modalMode === "scenario" ? (selIdx >= 0 ? (edited !== "" ? edited : phrases[selIdx]) : "") : "";
      const currentVal = modalMode === "scratch" ? edited : scenarioValue;
      const canSave = currentVal.trim() !== "" || (modalMode === "scenario" && selIdx >= 0);
      const selectPhrase = (idx: number) => {
        if (selIdx === idx) { setPrioExpSelected(prev=>({...prev,[p]:-1})); setPrioExperience(prev=>({...prev,[p]:""})); }
        else { setPrioExpSelected(prev=>({...prev,[p]:idx})); setPrioExperience(prev=>({...prev,[p]:""})); }
      };
      const switchMode = (mode: "scratch"|"scenario") => { setPrioExpMode(mode); setPrioExpSelected(prev=>({...prev,[p]:-1})); setPrioExperience(prev=>({...prev,[p]:""})); };
      const exitWithout = () => { setPrioExpModal(null); setPrioExpMode("scratch"); };
      const saveAndExit = () => { if (modalMode === "scenario" && edited === "" && selIdx >= 0) setPrioExperience(prev=>({...prev,[p]:phrases[selIdx]})); setPrioExpModal(null); setPrioExpMode("scratch"); };
      return <div className="prioExpOverlay" onClick={exitWithout}>
        <div className="prioExpDialog" onClick={e=>e.stopPropagation()}>
          <div className="prioExpDialogHeader"><strong>{t.priorityNames[p]}</strong></div>
          <div className="prioExpTabs">
            <button className={`prioExpTab${modalMode==="scratch"?" prioExpTabActive":""}`} onClick={()=>switchMode("scratch")}>{isIt?"✍ Scrivi da zero":"✍ Write from scratch"}</button>
            <button className={`prioExpTab${modalMode==="scenario"?" prioExpTabActive":""}`} onClick={()=>switchMode("scenario")}>{isIt?"📋 Scegli uno scenario":"📋 Choose a scenario"}</button>
          </div>
          {modalMode==="scratch"&&(
            <>
              <p className="prioExpHint">{isIt?"Descrivi liberamente il contesto o la sfida specifica di questa priorità per la tua azienda.":"Freely describe the context or specific challenge of this priority for your organisation."}</p>
              <textarea className="prioExpTextarea" value={edited} placeholder={isIt?"Scrivi qui il tuo testo…":"Write your text here…"} onChange={e=>setPrioExperience(prev=>({...prev,[p]:e.target.value}))} rows={6} autoFocus/>
            </>
          )}
          {modalMode==="scenario"&&(
            <>
              <p className="prioExpHint">{isIt?"Seleziona il caso in cui ti riconosci di più, poi rivedi e personalizza la frase.":"Select the case you identify with most, then review and personalise the phrase."}</p>
              <div className="prioExpPhrases">
                {phrases.map((phrase,idx)=>(
                  <button key={idx} className={`prioExpPhrase${selIdx===idx?" prioExpPhraseActive":""}`} onClick={()=>selectPhrase(idx)}>
                    <span className="prioExpPhraseNum">{String(idx+1).padStart(2,"0")}</span>
                    <span className="prioExpPhraseText">{phrase}</span>
                    {selIdx===idx&&<span className="prioExpPhraseCheck">✓</span>}
                  </button>
                ))}
              </div>
              <textarea className={`prioExpTextarea${selIdx<0?" prioExpTextareaEmpty":""}`} value={scenarioValue} placeholder={isIt?"Seleziona uno scenario qui sopra per iniziare…":"Select a scenario above to get started…"} onChange={e=>setPrioExperience(prev=>({...prev,[p]:e.target.value}))} disabled={selIdx<0} rows={5}/>
            </>
          )}
          <div className="prioExpActions">
            <button className="prioExpClear" onClick={exitWithout}>{isIt?"Esci senza modifiche":"Exit without saving"}</button>
            <button className="actionButton prioExpSave" onClick={saveAndExit} disabled={!canSave}>{isIt?"Salva e esci":"Save and exit"}<b>→</b></button>
          </div>
        </div>
      </div>;
    })()}
  </main>;
}

// ── priorityData ─────────────────────────────────────────────────────────────

interface PriorityDataProps extends CommonProps {
  priorities: Priority[];
  priorityIncluded: Record<Priority, boolean>;
  dataNeeds: NeedItem[];
  needRelevance: Record<string, number>;
  setNeedRelevance: React.Dispatch<React.SetStateAction<Record<string, number>>>;
  needCriticality: Record<string, number>;
  setNeedCriticality: React.Dispatch<React.SetStateAction<Record<string, number>>>;
  needIncluded: Record<string, boolean>;
  toggleNeedIncluded: (id: string) => void;
  isNeedIncluded: (id: string) => boolean;
  pdHelpOpen: boolean;
  setPdHelpOpen: React.Dispatch<React.SetStateAction<boolean>>;
  needIdToMission: Record<string, number>;
  needIdToCapability: Record<string, {it:string,en:string}>;
  displayCompanyName: string;
  renderTrustBar: () => JSX.Element;
  t: Record<string, any>;
  name: string;
  pdCustomLabels: Record<string, string>;
  setPdCustomLabels: React.Dispatch<React.SetStateAction<Record<string, string>>>;
  pdCustomMemos: Record<string, string>;
  setPdCustomMemos: React.Dispatch<React.SetStateAction<Record<string, string>>>;
}

export function PriorityDataScreen({
  language, profile, setLanguage, setScreen, reset, renderTrustBar,
  priorities, priorityIncluded, dataNeeds, needRelevance, setNeedRelevance, needCriticality, setNeedCriticality,
  needIncluded, toggleNeedIncluded, isNeedIncluded, pdHelpOpen, setPdHelpOpen,
  needIdToMission, needIdToCapability, displayCompanyName, t, name,
  pdCustomLabels: customLabels, setPdCustomLabels: setCustomLabels,
  pdCustomMemos: customMemos, setPdCustomMemos: setCustomMemos,
}: PriorityDataProps) {
  const isIt = language === "it";
  const [slideIdx, setSlideIdx] = React.useState(0);
  const [selectedNeedId, setSelectedNeedId] = React.useState<string|null>(null);
  const [customModalOpen, setCustomModalOpen] = React.useState<string|null>(null); // priority key
  const [customLabelDraft, setCustomLabelDraft] = React.useState("");
  const [customMemoDraft, setCustomMemoDraft] = React.useState("");
  const totalSlides = priorities.length;
  const p = priorities[slideIdx];
  const colItems = dataNeeds.filter(n => n.priority === p);
  const isPriorityDisabled = !(priorityIncluded[p] ?? true);

  // id sintetico per la riga custom di questa priority
  const customId = `custom-${p}`;

  // Tooltip stato per le righe ereditate
  const [inheritedTooltip, setInheritedTooltip] = React.useState<string|null>(null);

  // Per ogni item del slide corrente, cerca se la stessa label esiste in un obiettivo precedente già incluso
  const getInheritedFrom = (item: {id:string, label:string}): {srcSlideIdx:number, srcId:string, priorityName:string} | null => {
    for (let i = 0; i < slideIdx; i++) {
      const prevPriority = priorities[i];
      const prevItems = dataNeeds.filter(n => n.priority === prevPriority);
      const match = prevItems.find(n => n.label === item.label);
      if (match && isNeedIncluded(match.id)) {
        return { srcSlideIdx: i, srcId: match.id, priorityName: (t.priorityNames as Record<string,string>)[prevPriority] };
      }
    }
    return null;
  };

  // Quando cambia slide, azzera la selezione
  React.useEffect(()=>{ setSelectedNeedId(null); }, [slideIdx]);
  const [zoomWarnOpen,setZoomWarnOpen]=React.useState(false);
  React.useEffect(()=>{
    const handler=(e:KeyboardEvent)=>{
      const mod=e.metaKey||e.ctrlKey;
      if(!mod)return;
      if(e.key==="+"||e.key==="="||e.key==="-"||e.key==="0"){e.preventDefault();setZoomWarnOpen(true);}
    };
    window.addEventListener("keydown",handler);
    return ()=>window.removeEventListener("keydown",handler);
  },[]);

  const useCases = (t.needUseCases ?? {}) as Record<string,string>;
  const examples = (t.needExamples ?? {}) as Record<string,string>;
  const selectedItem = selectedNeedId && selectedNeedId !== customId
    ? colItems.find(n => n.id === selectedNeedId) ?? null
    : null;
  const selectedUseCase = selectedItem ? (useCases[selectedItem.label] ?? null) : null;
  const selectedExample = selectedItem ? (examples[selectedItem.label] ?? null) : null;

  const openCustomModal = (prioKey: string) => {
    setCustomLabelDraft(customLabels[prioKey] ?? "");
    setCustomMemoDraft(customMemos[prioKey] ?? "");
    setCustomModalOpen(prioKey);
  };
  const closeCustomModal = () => setCustomModalOpen(null);
  const saveCustomModal = () => {
    if(customModalOpen) {
      if(customLabelDraft.trim()) setCustomLabels(prev=>({...prev,[customModalOpen]:customLabelDraft.trim()}));
      setCustomMemos(prev=>({...prev,[customModalOpen]:customMemoDraft}));
    }
    setCustomModalOpen(null);
  };

  const exportDataNeedsCsv = () => {
    const missionNames: {[k:number]:{it:string,en:string}} = {0:{it:"M1 · Fabbrica dei dati ESG",en:"M1 · ESG data factory"},1:{it:"M2 · Energia e decarbonizzazione",en:"M2 · Energy and decarbonisation"},2:{it:"M3 · Coinvolgimento supply chain",en:"M3 · Supply chain engagement"},3:{it:"M4 · Reporting e performance",en:"M4 · Reporting and performance"},4:{it:"M5 · Rotta verso Net Zero",en:"M5 · Net Zero pathway"},5:{it:"M6 · Framework ESG e disclosure",en:"M6 · ESG frameworks and disclosure"}};
    const esc = (s:string) => s.includes(",")||s.includes('"')||s.includes("\n")?`"${s.replace(/"/g,'""')}"`:s;
    const headers = isIt ? ["Rank","Priorità di business","ID","Esigenza di gestione dati ESG","Inclusa","Rilevanza (1-10)","Criticità (1-10)","Priorità (tier)","Missione / Sfida Quest","Modulo IBM Envizi"] : ["Rank","Business priority","ID","ESG data management need","Included","Relevance (1-10)","Criticality (1-10)","Priority tier","Mission / Quest challenge","IBM Envizi module"];
    const rows: string[][] = [];
    priorities.forEach((p,pi) => {
      const items = dataNeeds.filter(n => n.priority === p);
      items.forEach((item,ii) => {
        const rel = Math.min(needRelevance[item.id]??5,10);
        const crit = needCriticality[item.id]??5;
        const included = isNeedIncluded(item.id);
        const tier = rel>7&&crit>7?(isIt?"Alta":"High"):rel>4||crit>4?(isIt?"Media":"Medium"):(isIt?"Bassa":"Low");
        const mi = needIdToMission[item.id]??null;
        const missionLabel = mi!==null?(isIt?missionNames[mi].it:missionNames[mi].en):(isIt?"Trasversale":"Cross-cutting");
        const cap = needIdToCapability[item.id];
        const capLabel = cap?(isIt?cap.it:cap.en):"";
        rows.push([`${pi+1}.${ii+1}`,isIt?(t.priorityNames as Record<string,string>)[p]:(t.priorityNames as Record<string,string>)[p],item.id,item.label,included?(isIt?"Sì":"Yes"):(isIt?"No":"No"),String(rel),String(crit),tier,missionLabel,capLabel]);
      });
    });
    const csv = "\uFEFF"+[headers,...rows].map(r=>r.map(esc).join(",")).join("\n");
    const blob = new Blob([csv],{type:"text/csv;charset=utf-8;"});
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href=url; a.download=`Envizi-Quest-Esigenze-${displayCompanyName.replace(/[^a-zA-Z0-9]/g,"_")||"Export"}.csv`; a.click();
    URL.revokeObjectURL(url);
  };

  return <main className="pdSlideScreen" style={{position:"relative"}}>
    {zoomWarnOpen&&<div style={{position:"fixed",inset:0,zIndex:99999,background:"rgba(7,18,15,.82)",display:"flex",alignItems:"center",justifyContent:"center"}} onClick={()=>setZoomWarnOpen(false)}><div style={{background:"#0d1f19",border:"1px solid rgba(57,239,180,.3)",borderRadius:"14px",padding:"28px 32px",maxWidth:"380px",width:"90vw",textAlign:"center",boxShadow:"0 8px 40px rgba(0,0,0,.6)"}} onClick={e=>e.stopPropagation()}><p style={{margin:"0 0 8px",fontSize:"13px",fontFamily:"var(--font-geist-mono,monospace)",letterSpacing:".14em",textTransform:"uppercase",color:"#39efb4"}}>{isIt?"Attenzione":"Warning"}</p><p style={{margin:"0 0 20px",fontSize:"15px",color:"#e8f5ef",lineHeight:1.5}}>{isIt?"Il rapporto di visualizzazione è ottimizzato per questa schermata. Sei sicuro di voler cambiare lo zoom?":"The display ratio is optimised for this screen. Are you sure you want to change the zoom?"}</p><div style={{display:"flex",gap:"10px",justifyContent:"center"}}><button style={{padding:"8px 22px",borderRadius:"8px",border:"1px solid rgba(57,239,180,.35)",background:"transparent",color:"#39efb4",fontSize:"14px",cursor:"pointer",fontFamily:"inherit"}} onClick={()=>setZoomWarnOpen(false)}>{isIt?"Annulla":"Cancel"}</button><button style={{padding:"8px 22px",borderRadius:"8px",border:"1px solid #c84040",background:"rgba(200,64,64,.12)",color:"#ff8080",fontSize:"14px",cursor:"pointer",fontFamily:"inherit"}} onClick={()=>setZoomWarnOpen(false)}>{isIt?"Continua comunque":"Continue anyway"}</button></div></div></div>}
    <div style={{position:"fixed",top:0,left:0,right:0,height:"4px",background:"#3b82f4",zIndex:9999,pointerEvents:"none"}}/>
    <div style={{position:"fixed",bottom:0,left:0,right:0,height:"4px",background:"#39efb4",zIndex:9999,pointerEvents:"none"}}/>
    <header className="missionNav missionNavTrust">
      <button className="brand brandButton" onClick={reset}><span className="brandMark">e·</span><span>Envizi<br/>Impact Quest</span></button>
      <div className="missionProgress"><span className="activeDot"/> DATA NEEDS</div>
      {renderTrustBar()}
      <button className="langMini" onClick={()=>setLanguage(language==="it"?"en":"it")}>{language==="it"?"EN":"IT"}</button>
    </header>

    {/* ── Top bar: titolo + navigazione ── */}
    <div className="pdSlideTopBar">
      <div className="pdSlideTopLeft">
        <p className="pdSlideTitleLabel">{isIt?"Dagli obiettivi alle esigenze di gestione dati ESG":"From objectives to ESG data management needs"}</p>
        <div className="pdSlideObjHeader">
          <span className="pdSlideObjNum">{String(slideIdx+1).padStart(2,"0")}</span>
          <div>
            <span className="pdSlideObjMeta">{isIt?"Obiettivo:":"Objective:"}</span>
            <span className="pdSlideObjName">{(t.priorityNames as Record<string,string>)[p]}</span>
          </div>
        </div>
      </div>
      <div className="pdSlideNavRow">
        {/* Dot pills navigazione obiettivi */}
        <div className="pdSlideDots">
          {priorities.map((_,i)=>(
            <button key={i} className={`pdSlideDot${i===slideIdx?" pdSlideDotActive":""}`} onClick={()=>setSlideIdx(i)} aria-label={`Obiettivo ${i+1}`}/>
          ))}
        </div>
        <div className="pdSlideNavBtns">
          <button className="pdSlideNavBtn" onClick={()=>{ if(slideIdx===0) goBack(); else setSlideIdx(i=>i-1); }}>←</button>
          <span className="pdSlideNavCount">{slideIdx+1} / {totalSlides}</span>
          <button className="pdSlideNavBtn" onClick={()=>{ if(slideIdx===totalSlides-1) setScreen("priorityMatrix"); else setSlideIdx(i=>i+1); }}>→</button>
        </div>
      </div>
    </div>

    {/* ── Corpo: lista items + colonna destra fissa ── */}
    <div className="pdSlideBody">
      {/* Lista esigenze */}
      <div className="pdSlideList" style={isPriorityDisabled?{position:"relative"}:undefined}>
        {/* ── Banner obiettivo deselezionato ── */}
        {isPriorityDisabled && (
          <div style={{position:"absolute",inset:0,zIndex:10,display:"flex",flexDirection:"column",alignItems:"center",justifyContent:"center",background:"rgba(7,18,15,0.72)",borderRadius:"10px",gap:"12px",padding:"32px 24px",textAlign:"center",pointerEvents:"auto"}}>
            <span style={{fontSize:"clamp(28px,2.5vw,40px)",lineHeight:1}}>⊘</span>
            <p style={{margin:0,fontSize:"clamp(14px,1.2vw,17px)",color:"#b5c9c1",fontWeight:600,lineHeight:1.4}}>
              {isIt?"Obiettivo deselezionato":"Objective deselected"}
            </p>
            <div style={{display:"flex",gap:"10px",flexWrap:"wrap",justifyContent:"center",marginTop:"4px"}}>
              <button
                className="secondaryAction"
                style={{fontSize:"clamp(12px,1vw,14px)",padding:"8px 20px"}}
                onClick={()=>setScreen("priorities")}
              >
                {isIt?"← Business Priorities":"← Business Priorities"}
              </button>
              {slideIdx < totalSlides-1
                ? <button
                    className="actionButton"
                    style={{fontSize:"clamp(12px,1vw,14px)",padding:"8px 20px"}}
                    onClick={()=>setSlideIdx(i=>i+1)}
                  >
                    {isIt?"Prossimo obiettivo →":"Next objective →"}
                  </button>
                : <button
                    className="actionButton"
                    style={{fontSize:"clamp(12px,1vw,14px)",padding:"8px 20px"}}
                    onClick={()=>setScreen("priorityMatrix")}
                  >
                    {isIt?"Vai alla matrice →":"Go to matrix →"}
                  </button>
              }
            </div>
          </div>
        )}
        {/* Header colonne */}
        <div className="pdSlideColHeader">
          <div className="pdSlideColHLabel">{isIt?"Esigenza di gestione dati ESG":"ESG data management need"}</div>
          <div className="pdSlideColHIncl">{isIt?"Includi":"Include"}</div>
          <div className="pdSlideColHScore">{isIt?"Rilevanza":"Relevance"}</div>
          <div className="pdSlideColHScore">{isIt?"Criticità":"Criticality"}</div>
        </div>
        {colItems.map((item, posInGroup)=>{
          const rankLabel = `${slideIdx+1}.${posInGroup+1}`;
          const relMax = 10;
          const inherited = getInheritedFrom(item);
          // se ereditato, usa i valori dell'item sorgente
          const srcId = inherited ? inherited.srcId : item.id;
          const rel = Math.min(needRelevance[srcId]??5, 10);
          const crit = needCriticality[srcId]??5;
          const included = isNeedIncluded(srcId);
          const tier = rel>7&&crit>7?"high":rel>4||crit>4?"mid":"low";
          const tierColor = tier==="high"?"#ff4d4d":tier==="mid"?"#7dd3fc":"#9ca3af";
          const isSelected = selectedNeedId === item.id;
          const tooltipId = `inh-${item.id}`;
          const showInheritedMsg = () => setInheritedTooltip(inheritedTooltip===tooltipId ? null : tooltipId);
          return <div key={item.id} className={`pdSlideRow${included?"":" pdSlideRowDimmed"}${isSelected?" pdSlideRowSelected":""}`} style={inherited?{opacity:0.75}:undefined}>
            <div className="pdSlideRowLabel pdSlideRowLabelClickable" style={{color: included ? tierColor : "#c5d8d2"}}
              onClick={()=>{ if(inherited) showInheritedMsg(); else setSelectedNeedId(isSelected ? null : item.id); }}>
              <span className="pdSlideRowCode">{rankLabel}</span>
              <span className="pdSlideRowText">{item.label}</span>
              {inherited
                ? <span className="pdInheritedBadge">↩</span>
                : <span className="pdSlideRowSelectHint">{isSelected?"▾":"▸"}</span>
              }
            </div>
            {inherited && inheritedTooltip===tooltipId && (
              <div className="pdInheritedTooltip" style={{gridColumn:"1 / -1"}} onClick={e=>e.stopPropagation()}>
                {isIt
                  ? <>Questa esigenza è già stata valutata nell'obiettivo <strong>{inherited.priorityName}</strong>. Per modificare la valutazione torna a quell'obiettivo.{" "}<button className="pdInheritedGoBtn" onClick={()=>{ setInheritedTooltip(null); setSlideIdx(inherited.srcSlideIdx); }}>Vai →</button></>
                  : <>This need was already rated under objective <strong>{inherited.priorityName}</strong>. To change the rating, go back to that objective.{" "}<button className="pdInheritedGoBtn" onClick={()=>{ setInheritedTooltip(null); setSlideIdx(inherited.srcSlideIdx); }}>Go →</button></>
                }
                <button className="pdInheritedCloseBtn" onClick={()=>setInheritedTooltip(null)}>✕</button>
              </div>
            )}
            <div className="pdSlideRowIncl">
              <button
                className={`pdInclBtn${included?" pdInclBtnOn":""}`}
                style={{"--incl-color": tierColor} as React.CSSProperties}
                onClick={()=>{ if(inherited) showInheritedMsg(); else toggleNeedIncluded(item.id); }}
                aria-label={included?(isIt?"Escludi":"Exclude"):(isIt?"Includi":"Include")}
              />
            </div>
            <div className="pdSlideRowScore" onClick={()=>{ if(inherited) showInheritedMsg(); }}>
              <input type="range" min={1} max={relMax} value={rel}
                style={{"--v":rel,"--vmax":relMax-1} as React.CSSProperties}
                onChange={e=>{ if(!inherited) setNeedRelevance(v=>({...v,[item.id]:Number(e.target.value)})); }}
                className="pdScoreSlider pdSliderRel" disabled={!included||!!inherited}/>
              <span className="pdBandVal pdBandValRel" style={{opacity:included?1:0.35}}>{rel}<span className="pdBandMax">/{relMax}</span></span>
            </div>
            <div className="pdSlideRowScore" onClick={()=>{ if(inherited) showInheritedMsg(); }}>
              <input type="range" min={1} max={10} value={crit}
                style={{"--v":crit} as React.CSSProperties}
                onChange={e=>{ if(!inherited) setNeedCriticality(v=>({...v,[item.id]:Number(e.target.value)})); }}
                className="pdScoreSlider pdSliderCrit" disabled={!included||!!inherited}/>
              <span className="pdBandVal pdBandValCrit" style={{opacity:included?1:0.35}}>{crit}</span>
            </div>
          </div>;
        })}

        {/* ── Riga custom "Altro" ── */}
        {(()=>{
          const cRel  = Math.min(needRelevance[customId]??5, 10);
          const cCrit = needCriticality[customId]??5;
          const cIncl = isNeedIncluded(customId);
          const cLabel = customLabels[p] || (isIt?"Altro":"Other");
          const tier = cRel>7&&cCrit>7?"high":cRel>4||cCrit>4?"mid":"low";
          const tierColor = tier==="high"?"#ff4d4d":tier==="mid"?"#7dd3fc":"#9ca3af";
          const rankLabel = `${slideIdx+1}.${colItems.length+1}`;
          return (
            <div className={`pdSlideRow pdSlideRowCustom${cIncl?"":" pdSlideRowDimmed"}`}>
              <div className="pdSlideRowLabel pdSlideRowLabelClickable" style={{color:cIncl?tierColor:"#c5d8d2"}}
                onClick={()=>openCustomModal(p)}
                title={isIt?"Clicca per modificare":"Click to edit"}>
                <span className="pdSlideRowCode">{rankLabel}</span>
                <span className="pdSlideRowText">{cLabel}</span>
                <span className="pdSlideRowSelectHint">✏</span>
              </div>
              <div className="pdSlideRowIncl">
                <button
                  className={`pdInclBtn${cIncl?" pdInclBtnOn":""}`}
                  style={{"--incl-color":tierColor} as React.CSSProperties}
                  onClick={()=>toggleNeedIncluded(customId)}
                  aria-label={cIncl?(isIt?"Escludi":"Exclude"):(isIt?"Includi":"Include")}
                />
              </div>
              <div className="pdSlideRowScore">
                <input type="range" min={1} max={10} value={cRel}
                  style={{"--v":cRel,"--vmax":9} as React.CSSProperties}
                  onChange={e=>setNeedRelevance(v=>({...v,[customId]:Number(e.target.value)}))}
                  className="pdScoreSlider pdSliderRel" disabled={!cIncl}/>
                <span className="pdBandVal pdBandValRel" style={{opacity:cIncl?1:0.35}}>{cRel}<span className="pdBandMax">/10</span></span>
              </div>
              <div className="pdSlideRowScore">
                <input type="range" min={1} max={10} value={cCrit}
                  style={{"--v":cCrit} as React.CSSProperties}
                  onChange={e=>setNeedCriticality(v=>({...v,[customId]:Number(e.target.value)}))}
                  className="pdScoreSlider pdSliderCrit" disabled={!cIncl}/>
                <span className="pdBandVal pdBandValCrit" style={{opacity:cIncl?1:0.35}}>{cCrit}</span>
              </div>
            </div>
          );
        })()}

      </div>

      {/* ── Modale use case ── */}
      {selectedNeedId && selectedItem && (()=>{
        const mRel  = Math.min(needRelevance[selectedNeedId]??5, 10);
        const mCrit = needCriticality[selectedNeedId]??5;
        const mIncluded = isNeedIncluded(selectedNeedId);
        const setRel  = (v:number) => {
          setNeedRelevance(prev=>({...prev,[selectedNeedId]:v}));
          if(!mIncluded) toggleNeedIncluded(selectedNeedId);
        };
        const setCrit = (v:number) => {
          setNeedCriticality(prev=>({...prev,[selectedNeedId]:v}));
          if(!mIncluded) toggleNeedIncluded(selectedNeedId);
        };
        return (
          <div className="pdNeedModalOverlay" onClick={()=>setSelectedNeedId(null)}>
            <div className="pdNeedModal" onClick={e=>e.stopPropagation()}>
              <div className="pdNeedModalHead">
                <span className="pdNeedModalIcon">💡</span>
                <span className="pdNeedModalLabel">{selectedItem.label}</span>
                <button className="pdNeedModalClose" onClick={()=>setSelectedNeedId(null)}>✕</button>
              </div>
              <div className="pdNeedModalBody">
                {selectedUseCase
                  ? selectedUseCase.split("\n").map((line,i)=>{
                      const idx = line.indexOf(" — ");
                      if(idx > -1) return <p key={i} className="pdUseCaseLine"><strong>{line.slice(0,idx)}</strong><span>{line.slice(idx)}</span></p>;
                      return <p key={i} className="pdUseCaseLine">{line}</p>;
                    })
                  : <p className="pdUseCaseLine" style={{color:"#4a7a68",fontStyle:"italic"}}>{isIt?"Nessun use case disponibile per questa esigenza.":"No use case available for this need."}</p>
                }
                {selectedExample && (
                  <div className="pdUseCaseExample">
                    <p className="pdUseCaseExampleLabel"><strong>{isIt?"Scenario":"Scenario"}</strong></p>
                    <p className="pdUseCaseExampleText">{selectedExample}</p>
                  </div>
                )}

                {/* ── Vota ── */}
                <div className="pdNeedModalVote">
                  <p className="pdNeedModalVoteQ">
                    {isIt
                      ? "Quanto è rilevante questo use case nella tua realtà, e quanto è problematico / critico?"
                      : "How relevant is this use case in your context, and how critical / problematic?"}
                  </p>
                  <div className="pdNeedModalScores">
                    {/* Rilevanza */}
                    <div className="pdNeedModalScoreCol">
                      <span className="pdNeedModalScoreLabel pdNeedModalScoreLabelRel">{isIt?"Rilevanza":"Relevance"}</span>
                      <div className="pdNeedModalStepper">
                        <button className="pdNeedModalStep" onClick={()=>setRel(Math.min(10,mRel+1))} disabled={mRel>=10}>▲</button>
                        <span className={`pdNeedModalVal${mRel>5?" pdNeedModalValHigh":""}`}>{mRel}<span className="pdNeedModalValMax">/10</span></span>
                        <button className="pdNeedModalStep" onClick={()=>setRel(Math.max(1,mRel-1))} disabled={mRel<=1}>▼</button>
                      </div>
                      <span className="pdNeedModalScoreHint">{isIt?"1 = poco rilevante · 10 = molto":"1 = low · 10 = very relevant"}</span>
                    </div>
                    {/* Criticità */}
                    <div className="pdNeedModalScoreCol">
                      <span className="pdNeedModalScoreLabel pdNeedModalScoreLabelCrit">{isIt?"Criticità":"Criticality"}</span>
                      <div className="pdNeedModalStepper">
                        <button className="pdNeedModalStep" onClick={()=>setCrit(Math.min(10,mCrit+1))} disabled={mCrit>=10}>▲</button>
                        <span className={`pdNeedModalVal${mCrit>5?" pdNeedModalValHigh":""}`}>{mCrit}<span className="pdNeedModalValMax">/10</span></span>
                        <button className="pdNeedModalStep" onClick={()=>setCrit(Math.max(1,mCrit-1))} disabled={mCrit<=1}>▼</button>
                      </div>
                      <span className="pdNeedModalScoreHint">{isIt?"1 = poco critico · 10 = molto":"1 = low · 10 = very critical"}</span>
                    </div>
                    {/* Includi pill */}
                    <div className="pdNeedModalScoreCol pdNeedModalInclCol">
                      <span className="pdNeedModalScoreLabel">{isIt?"Includi":"Include"}</span>
                      <button
                        className={`pdInclBtn pdInclBtnLg${mIncluded?" pdInclBtnOn":""}`}
                        onClick={()=>toggleNeedIncluded(selectedNeedId)}
                        aria-label={mIncluded?(isIt?"Escludi":"Exclude"):(isIt?"Includi":"Include")}
                      />
                      <span className="pdNeedModalScoreHint">{mIncluded?(isIt?"In analisi":"In analysis"):(isIt?"Esclusa":"Excluded")}</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        );
      })()}

      {/* ── Modale custom "Altro" ── */}
      {customModalOpen && (()=>{
        const ck = customModalOpen;
        const ckId = `custom-${ck}`;
        const mRel  = Math.min(needRelevance[ckId]??5, 10);
        const mCrit = needCriticality[ckId]??5;
        const mIncl = isNeedIncluded(ckId);
        const setRel = (v:number)=>{ setNeedRelevance(prev=>({...prev,[ckId]:v})); if(!mIncl) toggleNeedIncluded(ckId); };
        const setCrit= (v:number)=>{ setNeedCriticality(prev=>({...prev,[ckId]:v})); if(!mIncl) toggleNeedIncluded(ckId); };
        return (
          <div className="pdNeedModalOverlay" onClick={closeCustomModal}>
            <div className="pdNeedModal" onClick={e=>e.stopPropagation()}>
              <div className="pdNeedModalHead">
                <span className="pdNeedModalIcon">✏</span>
                <span className="pdNeedModalLabel">{isIt?"Esigenza personalizzata":"Custom need"}</span>
                <button className="pdNeedModalClose" onClick={closeCustomModal}>✕</button>
              </div>
              <div className="pdNeedModalBody">
                {/* Titolo editabile — max 1 riga */}
                <div className="pdCustomTitleWrap">
                  <label className="pdCustomTitleLabel">{isIt?"Nome esigenza (max 1 riga)":"Need name (single line)"}</label>
                  <input
                    className="pdCustomTitleInput"
                    type="text"
                    maxLength={120}
                    placeholder={isIt?"Altro…":"Other…"}
                    value={customLabelDraft}
                    onChange={e=>setCustomLabelDraft(e.target.value)}
                  />
                </div>
                {/* Memo — 4 righe */}
                <div className="pdCustomTitleWrap">
                  <label className="pdCustomTitleLabel">{isIt?"Note / memo":"Notes / memo"}</label>
                  <textarea
                    className="pdCustomMemoArea"
                    rows={4}
                    placeholder={isIt?"Descrivi il contesto, la situazione attuale, eventuali vincoli…":"Describe the context, current situation, constraints…"}
                    value={customMemoDraft}
                    onChange={e=>setCustomMemoDraft(e.target.value)}
                  />
                </div>
                {/* Vota */}
                <div className="pdNeedModalVote">
                  <p className="pdNeedModalVoteQ">
                    {isIt
                      ? "Quanto è rilevante questa esigenza nella tua realtà, e quanto è problematica / critica?"
                      : "How relevant is this need in your context, and how critical / problematic?"}
                  </p>
                  <div className="pdNeedModalScores">
                    <div className="pdNeedModalScoreCol">
                      <span className="pdNeedModalScoreLabel pdNeedModalScoreLabelRel">{isIt?"Rilevanza":"Relevance"}</span>
                      <div className="pdNeedModalStepper">
                        <button className="pdNeedModalStep" onClick={()=>setRel(Math.min(10,mRel+1))} disabled={mRel>=10}>▲</button>
                        <span className={`pdNeedModalVal${mRel>5?" pdNeedModalValHigh":""}`}>{mRel}<span className="pdNeedModalValMax">/10</span></span>
                        <button className="pdNeedModalStep" onClick={()=>setRel(Math.max(1,mRel-1))} disabled={mRel<=1}>▼</button>
                      </div>
                      <span className="pdNeedModalScoreHint">{isIt?"1 = poco · 10 = molto":"1 = low · 10 = high"}</span>
                    </div>
                    <div className="pdNeedModalScoreCol">
                      <span className="pdNeedModalScoreLabel pdNeedModalScoreLabelCrit">{isIt?"Criticità":"Criticality"}</span>
                      <div className="pdNeedModalStepper">
                        <button className="pdNeedModalStep" onClick={()=>setCrit(Math.min(10,mCrit+1))} disabled={mCrit>=10}>▲</button>
                        <span className={`pdNeedModalVal${mCrit>5?" pdNeedModalValHigh":""}`}>{mCrit}<span className="pdNeedModalValMax">/10</span></span>
                        <button className="pdNeedModalStep" onClick={()=>setCrit(Math.max(1,mCrit-1))} disabled={mCrit<=1}>▼</button>
                      </div>
                      <span className="pdNeedModalScoreHint">{isIt?"1 = poco · 10 = molto":"1 = low · 10 = high"}</span>
                    </div>
                    <div className="pdNeedModalScoreCol pdNeedModalInclCol">
                      <span className="pdNeedModalScoreLabel">{isIt?"Includi":"Include"}</span>
                      <button
                        className={`pdInclBtn pdInclBtnLg${mIncl?" pdInclBtnOn":""}`}
                        onClick={()=>toggleNeedIncluded(ckId)}
                        aria-label={mIncl?(isIt?"Escludi":"Exclude"):(isIt?"Includi":"Include")}
                      />
                      <span className="pdNeedModalScoreHint">{mIncl?(isIt?"In analisi":"In analysis"):(isIt?"Esclusa":"Excluded")}</span>
                    </div>
                  </div>
                </div>
                {/* Salva */}
                <div style={{display:"flex",justifyContent:"flex-end",marginTop:"8px"}}>
                  <button className="actionButton" style={{minWidth:"140px"}} onClick={saveCustomModal}>
                    {isIt?"Salva →":"Save →"}
                  </button>
                </div>
              </div>
            </div>
          </div>
        );
      })()}

      {/* Colonna destra fissa */}
      <div className="pdSlideRight">
        <div className="pdPersona">
          <img src={`./characters/${profile}-neutral.png`} alt={name}/>
          <div><strong>{name}</strong><small>ESG MANAGER</small></div>
        </div>
        <div className="pdScoreLegend">
          <div className="pdScoreLegendRow"><span className="pdLegendDot pdLegendRel"/>
            <div><strong>{isIt?"Rilevanza":"Relevance"}</strong><small>{isIt?"1 = poco rilevante · 10 = molto rilevante":"1 = low relevance · 10 = very relevant"}</small></div>
          </div>
          <div className="pdScoreLegendRow"><span className="pdLegendDot pdLegendCrit"/>
            <div><strong>{isIt?"Criticità":"Criticality"}</strong><small>{isIt?"1 = poco problematico · 10 = molto problematico":"1 = low severity · 10 = very critical"}</small></div>
          </div>
        </div>
        <div className="pdTierLegend pdTierLegendVert">
          <span><span style={{color:"#ff4d4d"}}>⬡</span> <span>{isIt?"Alta (R>7 e C>7)":"High (R>7 and C>7)"}</span></span>
          <span><span style={{color:"#7dd3fc"}}>⬡</span> <span>{isIt?"Media (R>4 o C>4)":"Medium (R>4 or C>4)"}</span></span>
          <span><span style={{color:"#9ca3af"}}>⬡</span> <span>{isIt?"Bassa":"Low"}</span></span>
        </div>
        <div className="pdSlideRightActions">
          <button className="secondaryAction" style={{fontSize:"clamp(12px,1vw,14px)",padding:"10px 12px",width:"100%"}} onClick={exportDataNeedsCsv}>↓ {isIt?"Esporta CSV":"Export CSV"}</button>
          {slideIdx < totalSlides-1
            ? <button className="actionButton" style={{width:"100%"}} onClick={()=>setSlideIdx(i=>i+1)}>{isIt?"Prossimo obiettivo →":"Next objective →"}</button>
            : <button className="actionButton" style={{width:"100%"}} onClick={()=>setScreen("priorityMatrix")}>{t.priorityDataCta}<b>→</b></button>
          }
        </div>
      </div>
    </div>
  </main>;
}

// ── priorityMatrix ────────────────────────────────────────────────────────────

interface PriorityMatrixProps extends CommonProps {
  priorities: Priority[];
  dataNeeds: NeedItem[];
  needRelevance: Record<string, number>;
  needCriticality: Record<string, number>;
  needIncluded: Record<string, boolean>;
  isNeedIncluded: (id: string) => boolean;
  focusMinR: number;
  setFocusMinR: (v: number) => void;
  focusMinC: number;
  setFocusMinC: (v: number) => void;
  hoveredPriority: Priority | null;
  setHoveredPriority: (p: Priority | null) => void;
  pmMissionFilter: number | null;
  setPmMissionFilter: (v: number | null) => void;
  pmFromBriefing: boolean;
  setPmFromBriefing: (v: boolean) => void;
  pmSelected: {id:string,label:string,rel:number,crit:number,color:string} | null;
  setPmSelected: (v: {id:string,label:string,rel:number,crit:number,color:string} | null) => void;
  needIdToMission: Record<string, number>;
  renderTrustBar: () => JSX.Element;
  t: Record<string, any>;
}

export function PriorityMatrixScreen({
  language, setLanguage, setScreen, reset, renderTrustBar,
  priorities, dataNeeds, needRelevance, needCriticality, isNeedIncluded,
  focusMinR, setFocusMinR, focusMinC, setFocusMinC,
  hoveredPriority, setHoveredPriority, pmMissionFilter, setPmMissionFilter,
  pmFromBriefing, setPmFromBriefing, pmSelected, setPmSelected,
  needIdToMission, t,
}: PriorityMatrixProps) {
  const isIt = language === "it";
  const [zoomWarnOpen,setZoomWarnOpen]=React.useState(false);
  React.useEffect(()=>{
    const handler=(e:KeyboardEvent)=>{
      const mod=e.metaKey||e.ctrlKey;
      if(!mod)return;
      if(e.key==="+"||e.key==="="||e.key==="-"||e.key==="0"){e.preventDefault();setZoomWarnOpen(true);}
    };
    window.addEventListener("keydown",handler);
    return ()=>window.removeEventListener("keydown",handler);
  },[]);
  const MATRIX_W = 800;
  const MATRIX_H = 380;
  const PAD_L = 38;
  const PAD_B = 58;
  const VW = MATRIX_W + PAD_L;
  const VH = MATRIX_H + PAD_B;
  const allNeeds = dataNeeds.filter(n => isNeedIncluded(n.id)).map((n) => {
    const prioIdx = priorities.indexOf(n.priority);
    const rel = Math.min(needRelevance[n.id]??5,10);
    const crit = needCriticality[n.id]??5;
    const relNorm = rel;
    const tierColor = relNorm>7&&crit>7?"#ff4d4d":relNorm>4||crit>4?"#7dd3fc":"#9ca3af";
    return {...n,rel,relNorm,crit,prioIdx,color:tierColor};
  });
  const toX = (v:number) => PAD_L+(v-1)/(10-1)*MATRIX_W;
  const toY = (v:number) => (10-v)/(10-1)*MATRIX_H;
  const gridVals = [1,2,3,4,5,6,7,8,9,10];
  const zoomF = focusMinR;
  const vbX = zoomF>1?toX(zoomF)-PAD_L/2:0;
  const vbY = zoomF>1?toY(10):0;
  const vbW = zoomF>1?(PAD_L+MATRIX_W)-vbX:VW;
  const vbH = zoomF>1?(toY(zoomF)+PAD_B)-vbY:VH;
  return <main className="pmScreen" style={{position:"relative"}}>
    {zoomWarnOpen&&<div style={{position:"fixed",inset:0,zIndex:99999,background:"rgba(7,18,15,.82)",display:"flex",alignItems:"center",justifyContent:"center"}} onClick={()=>setZoomWarnOpen(false)}><div style={{background:"#0d1f19",border:"1px solid rgba(57,239,180,.3)",borderRadius:"14px",padding:"28px 32px",maxWidth:"380px",width:"90vw",textAlign:"center",boxShadow:"0 8px 40px rgba(0,0,0,.6)"}} onClick={e=>e.stopPropagation()}><p style={{margin:"0 0 8px",fontSize:"13px",fontFamily:"var(--font-geist-mono,monospace)",letterSpacing:".14em",textTransform:"uppercase",color:"#39efb4"}}>{isIt?"Attenzione":"Warning"}</p><p style={{margin:"0 0 20px",fontSize:"15px",color:"#e8f5ef",lineHeight:1.5}}>{isIt?"Il rapporto di visualizzazione è ottimizzato per questa schermata. Sei sicuro di voler cambiare lo zoom?":"The display ratio is optimised for this screen. Are you sure you want to change the zoom?"}</p><div style={{display:"flex",gap:"10px",justifyContent:"center"}}><button style={{padding:"8px 22px",borderRadius:"8px",border:"1px solid rgba(57,239,180,.35)",background:"transparent",color:"#39efb4",fontSize:"14px",cursor:"pointer",fontFamily:"inherit"}} onClick={()=>setZoomWarnOpen(false)}>{isIt?"Annulla":"Cancel"}</button><button style={{padding:"8px 22px",borderRadius:"8px",border:"1px solid #c84040",background:"rgba(200,64,64,.12)",color:"#ff8080",fontSize:"14px",cursor:"pointer",fontFamily:"inherit"}} onClick={()=>setZoomWarnOpen(false)}>{isIt?"Continua comunque":"Continue anyway"}</button></div></div></div>}
    <div style={{position:"fixed",top:0,left:0,right:0,height:"4px",background:"#3b82f4",zIndex:9999,pointerEvents:"none"}}/>
    <div style={{position:"fixed",bottom:0,left:0,right:0,height:"4px",background:"#39efb4",zIndex:9999,pointerEvents:"none"}}/>
    <header className="missionNav missionNavTrust">
      <button className="brand brandButton" onClick={reset}><span className="brandMark">e·</span><span>Envizi<br/>Impact Quest</span></button>
      <div className="missionProgress"><span className="activeDot"/> PRIORITY MATRIX</div>
      {renderTrustBar()}
      <button className="langMini" onClick={()=>setLanguage(language==="it"?"en":"it")}>{language==="it"?"EN":"IT"}</button>
    </header>
    <div className="pmBody">
      <div className="pmLeft">
        <p className="eyebrow">{isIt?"Matrice di Priorità":"Priority Matrix"}</p>
        <h1 className="pmTitle">{isIt?"Rilevanza vs Criticità":"Relevance vs Criticality"}</h1>
        <div className="pmTierLegend">
          <div className="pmTierLegendItem"><span className="pmTierDot" style={{background:"#ff4d4d"}}/><span style={{color:"#fde047"}}>{isIt?"Alta priorità":"High priority"}</span><small>{isIt?"R>7 e C>7":"R>7 and C>7"}</small></div>
          <div className="pmTierLegendItem"><span className="pmTierDot" style={{background:"#7dd3fc"}}/><span style={{color:"#fde047"}}>{isIt?"Media priorità":"Medium priority"}</span><small>{isIt?"R>4 o C>4":"R>4 or C>4"}</small></div>
          <div className="pmTierLegendItem"><span className="pmTierDot" style={{background:"#9ca3af"}}/><span style={{color:"#fde047"}}>{isIt?"Bassa priorità":"Low priority"}</span></div>
        </div>
        <div className="pmObjList">
          <p className="pmObjListLabel">{isIt?"Filtra per obiettivo":"Filter by objective"}</p>
          {priorities.map((p,pi)=><div key={p} className={`pmObjItem${hoveredPriority===p?" pmObjItemActive":""}`} onMouseEnter={()=>setHoveredPriority(p)} onMouseLeave={()=>setHoveredPriority(null)}><span className="pmObjRank">{pi+1}</span><span>{t.priorityNames[p]}</span></div>)}
        </div>
        <div className="pmObjList" style={{marginTop:"14px"}}>
          <p className="pmObjListLabel">{isIt?"Filtra per capacità richiesta":"Filter by required capability"}</p>
          {missionCatalog.map((m,mi)=>{
            const active = pmMissionFilter === mi;
            return <div key={mi} className={`pmObjItem${active?" pmObjItemActive":""}`} onClick={()=>setPmMissionFilter(active?null:mi)} style={{cursor:"pointer"}}>
              <span className="pmObjRank">{mi}</span>
              <span>{isIt?m.it:m.en}</span>
            </div>;
          })}
        </div>
      </div>
      <div className="pmPlotWrap">
        <h2 className="pmMatrixTitle">{isIt?"Esigenze di gestione dei dati ESG: Priorità di intervento":"ESG data management needs: Intervention priorities"}</h2>
        <div className="pmFocusBar">
          <span className="pmFocusLabel">{isIt?"Focalizza su elementi con":"Focus on needs with"}</span>
          <span className="pmFocusGroup">
            <span className="pmFocusKey">R ≥ &amp; C ≥</span>
            <span className="pmFocusStepper">
              <button className="pmFocusBtn" onClick={()=>{const v=Math.min(10,focusMinR+1);setFocusMinR(v);setFocusMinC(v);}} disabled={focusMinR>=10}>▲</button>
              <span className="pmFocusVal">{focusMinR}</span>
              <button className="pmFocusBtn" onClick={()=>{const v=Math.max(1,focusMinR-1);setFocusMinR(v);setFocusMinC(v);}} disabled={focusMinR<=1}>▼</button>
            </span>
          </span>
          <span className="pmFocusHint">{isIt?"(1 = nessun filtro · 10 = solo il massimo)":"(1 = no filter · 10 = max only)"}</span>
        </div>
        <svg className="pmSvg" viewBox={`${vbX} ${vbY} ${vbW} ${vbH}`} preserveAspectRatio="xMidYMid meet" style={{transition:"viewBox .35s"}}>
          {gridVals.map(v=><g key={v}>
            <line x1={toX(v)} y1={0} x2={toX(v)} y2={MATRIX_H} stroke="rgba(255,255,255,.55)" strokeWidth="1.5" strokeDasharray="5 5"/>
            <line x1={PAD_L} y1={toY(v)} x2={PAD_L+MATRIX_W} y2={toY(v)} stroke="rgba(255,255,255,.55)" strokeWidth="1.5" strokeDasharray="5 5"/>
            <text x={toX(v)} y={MATRIX_H+16} textAnchor="middle" fontSize="12" fill="#7ecfb8" fontFamily="monospace" fontWeight="700">{v}</text>
            <text x={PAD_L-8} y={toY(v)+5} textAnchor="end" fontSize="12" fill="#7ecfb8" fontFamily="monospace" fontWeight="700">{v}</text>
          </g>)}
          {pmMissionFilter!==null&&(()=>{
            const tx=toX(10); const ty=toY(10);
            const lbl=isIt?"Esigenza trasversale":"Cross-cutting need";
            const lbl2=isIt?"a tutte le sfide":"across all challenges";
            const bw=Math.max(lbl.length,lbl2.length)*5.6+16;
            const bh=28;
            return <g>
              <rect x={tx-bw/2} y={ty-bh/2} width={bw} height={bh} rx="4" fill="rgba(7,17,14,.88)" stroke="#f5c542" strokeWidth="1" strokeOpacity="0.7"/>
              <text x={tx} y={ty-3} textAnchor="middle" fontSize="7" fill="#f5c542" fontFamily="monospace" fontWeight="700">{lbl}</text>
              <text x={tx} y={ty+8} textAnchor="middle" fontSize="7" fill="#f5c542" fontFamily="monospace" fontWeight="700">{lbl2}</text>
            </g>;
          })()}
          <text x={PAD_L+MATRIX_W/2} y={MATRIX_H+36} textAnchor="middle" fontSize="12" fill="#c2d8cf" fontFamily="monospace" fontWeight="700" letterSpacing="3">{isIt?"RILEVANZA":"RELEVANCE"}</text>
          <text x={PAD_L+MATRIX_W} y={MATRIX_H+52} textAnchor="end" fontSize="9" fill="rgba(255,255,255,.85)" fontFamily="monospace" fontWeight="700">{isIt?"R = Rilevanza (1–10)   ·   C = Criticità (1–10)":"R = Relevance (1–10)   ·   C = Criticality (1–10)"}</text>
          <text x={10} y={MATRIX_H/2} textAnchor="middle" fontSize="12" fill="#c2d8cf" fontFamily="monospace" fontWeight="700" letterSpacing="3" transform={`rotate(-90,10,${MATRIX_H/2})`}>{isIt?"CRITICITÀ":"CRITICALITY"}</text>
          <rect x={toX(5.5)} y={0} width={PAD_L+MATRIX_W-toX(5.5)} height={MATRIX_H/2} fill="rgba(57,239,180,.04)"/>
          {(()=>{
            const FONT=7.5; const LINE_H=9; const MAX_LINES=4;
            const CHAR_W=FONT*0.52; const PAD_X=6; const PAD_Y=4;
            const maxChars=Math.floor((MATRIX_W/9-PAD_X*2)/CHAR_W);
            const needMeta=allNeeds.map(n=>{
              const words=n.label.split(" ");
              const lines:string[]=[]; let cur="";
              for(const w of words){const test=cur?cur+" "+w:w;if(test.length<=maxChars)cur=test;else{if(cur)lines.push(cur);cur=w;}}
              if(cur)lines.push(cur);
              const vis=lines.slice(0,MAX_LINES);
              const bw=Math.max(...vis.map(l=>l.length))*CHAR_W+PAD_X*2;
              const bh=vis.length*LINE_H+PAD_Y*2+8;
              return {n,vis,bw,bh,ox:toX(n.relNorm),oy:toY(n.crit),lx:toX(n.relNorm),ly:toY(n.crit)};
            });
            for(let iter=0;iter<50;iter++){
              for(let i=0;i<needMeta.length;i++){
                for(let j=i+1;j<needMeta.length;j++){
                  const a=needMeta[i],b=needMeta[j];
                  const overX=Math.max(0,(a.bw+b.bw)/2-Math.abs(a.lx-b.lx));
                  const overY=Math.max(0,(a.bh+b.bh)/2-Math.abs(a.ly-b.ly));
                  if(overX>0&&overY>0){const push=Math.min(overX,overY)*0.5;const dx=a.lx-b.lx||0.1,dy=a.ly-b.ly||0.1;const d=Math.sqrt(dx*dx+dy*dy)||1;a.lx+=push*dx/d;a.ly+=push*dy/d;b.lx-=push*dx/d;b.ly-=push*dy/d;}
                }
                const m=needMeta[i];
                m.lx=Math.max(PAD_L+m.bw/2+2,Math.min(PAD_L+MATRIX_W-m.bw/2-2,m.lx));
                m.ly=Math.max(m.bh/2+2,Math.min(MATRIX_H-m.bh/2-2,m.ly));
              }
            }
            return needMeta.map(({n,vis,bw,bh,ox,oy,lx,ly})=>{
              const inFocus=n.relNorm>=focusMinR&&n.crit>=focusMinC;
              const nMission=needIdToMission[n.id]??-1;
              const isTransversal=nMission===-1;
              const missionMatch=pmMissionFilter===null||isTransversal||nMission===pmMissionFilter;
              const visible=(hoveredPriority?n.priority===hoveredPriority:inFocus)&&missionMatch;
              const dx=ox-lx,dy=oy-ly;
              const boxStrokeDash=isTransversal&&pmMissionFilter!==null?"4 2":undefined;
              const boxStrokeW=isTransversal&&pmMissionFilter!==null?1.4:0.8;
              return <g key={n.id} className="pmDot" opacity={visible?1:0.1} onClick={()=>setPmSelected({id:n.id,label:n.label,rel:n.relNorm,crit:n.crit,color:n.color})} style={{cursor:"pointer"}}>
                <rect x={lx-bw/2} y={ly-bh/2} width={bw} height={bh} rx="3" fill="#07110e" fillOpacity="0.82" stroke={n.color} strokeWidth={boxStrokeW} strokeOpacity="0.7" strokeDasharray={boxStrokeDash}/>
                <text fontFamily="sans-serif" fontSize={FONT} fill={n.color} fontWeight="600">
                  {vis.map((line,i)=><tspan key={i} x={lx} y={ly-bh/2+PAD_Y+(i+0.85)*LINE_H} textAnchor="middle">{line}</tspan>)}
                </text>
                {isTransversal&&pmMissionFilter!==null&&<text x={lx+bw/2-3} y={ly-bh/2+8} fontSize="5.5" fill="#f5c542" fontFamily="monospace" fontWeight="700" textAnchor="end" opacity="0.9">TRASV.</text>}
                <text x={lx} y={ly+bh/2-3} fontSize="7" fill={n.color} fontFamily="monospace" fontWeight="700" opacity="1" textAnchor="middle">{`R${n.relNorm} · C${n.crit}`}</text>
              </g>;
            });
          })()}
        </svg>
        <div style={{display:"flex",alignItems:"center",justifyContent:"space-between",padding:"8px 0 4px",width:"100%",gap:"16px"}}>
          <p style={{margin:0,fontSize:"clamp(22px,1.9vw,26px)",color:"#5a9e88",lineHeight:1.45,maxWidth:"560px"}}>
            {isIt
              ? "La matrice determina l'ordine delle aree di approfondimento: le esigenze ad alta priorità guidano la sequenza delle sfide che affronterai."
              : "The matrix determines the order of focus areas: high-priority needs guide the sequence of challenges you will face."}
          </p>
          {pmFromBriefing
            ? <button className="actionButton" style={{flexShrink:0,width:"auto"}} onClick={()=>{setPmFromBriefing(false);setScreen("compare");}}>{isIt?"Continua verso l'AS-IS":"Continue to AS-IS"}<b> →</b></button>
            : <button className="actionButton" style={{flexShrink:0,width:"auto"}} onClick={()=>setScreen("ilTuoReport")}>{isIt?"Genera la sintesi e costruisci la roadmap":"Generate the summary and build the roadmap"}<b> →</b></button>
          }
        </div>
        {pmSelected&&<div className="pmPopoverOverlay" onClick={()=>setPmSelected(null)}>
          <div className="pmPopover" onClick={e=>e.stopPropagation()}>
            <button className="pmPopoverClose" onClick={()=>setPmSelected(null)}>✕</button>
            <p className="pmPopoverLabel" style={{color:pmSelected.color}}>{pmSelected.label}</p>
            <div className="pmPopoverScores">
              <div className="pmPopoverScore"><span className="pmPopoverScoreKey">{isIt?"Rilevanza":"Relevance"}</span><span className="pmPopoverScoreVal" style={{color:pmSelected.color}}>{pmSelected.rel}<span className="pmPopoverScoreMax">/10</span></span></div>
              <div className="pmPopoverScore"><span className="pmPopoverScoreKey">{isIt?"Criticità":"Criticality"}</span><span className="pmPopoverScoreVal" style={{color:pmSelected.color}}>{pmSelected.crit}<span className="pmPopoverScoreMax">/10</span></span></div>
            </div>
          </div>
        </div>}
        </div>
    </div>
  </main>;
}
