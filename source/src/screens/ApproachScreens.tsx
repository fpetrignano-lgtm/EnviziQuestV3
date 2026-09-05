import { useState, useEffect } from "react";
import type { CommonProps } from "./types";

interface Props extends CommonProps {
  t: Record<string, any>;
}

export function ApproachIntro({language,setLanguage,setScreen,reset,goBack,t}:Props){
  const isIt = language==="it";
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
  return(
    <main className="approachIntroScreen" style={{position:"relative"}}>
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
      <div className="welcomeBlueBar"/>
      <header className="missionNav">
        <button className="brand brandButton" onClick={reset}><span className="brandMark">e·</span><span>Envizi<br/>Impact Quest</span></button>
        <div className="missionProgress"><span className="activeDot"/> IL PERCORSO</div>
        <button className="langMini" onClick={()=>setLanguage(language==="it"?"en":"it")}>{language==="it"?"EN":"IT"}</button>
      </header>
      <section className="approachIntroBody approachIntroBodyWithImg">
        <div className="approachIntroLeft">
          <h1 className="approachIntroTitle">{t.approachIntroTitle}</h1>
          <div className="approachIntroText">{(t.approachIntroBody as string[]).map((para,i)=><p key={i}>{para}</p>)}</div>
        </div>
        <div className="approachIntroRight approachIntroRightWithCta">
          <img src="./step-6.svg" className="approachIntroStepBadge" alt="Step 6"/>
          <img src="./logica-macro.png" className="approachIntroImg" alt="Dalle priorità alle decisioni"/>
          <button className="actionButton approachIntroCta approachIntroCtaRight" onClick={()=>setScreen("approachReport")}>{t.approachIntroCta}<b>→</b></button>
        </div>
      </section>
      <div className="welcomeBlueBar" style={{background:"#39efb4"}}/>
    </main>
  );
}

function useVidPlus() {
  const [open,setOpen]=useState(false);
  const [dismissed,setDismissed]=useState(false);
  useEffect(()=>{
    const h=(e:KeyboardEvent)=>{
      if(dismissed)return;
      if((e.metaKey||e.ctrlKey)&&(e.key==="+"||e.key==="="||e.key==="-"||e.key==="0")){e.preventDefault();setOpen(true);}
    };
    window.addEventListener("keydown",h);
    return ()=>window.removeEventListener("keydown",h);
  },[dismissed]);
  return [open,setOpen,setDismissed] as const;
}

function VidPlusModal({open,onClose,onDismiss,isIt}:{open:boolean,onClose:()=>void,onDismiss:()=>void,isIt:boolean}){
  if(!open)return null;
  return <div style={{position:"fixed",inset:0,zIndex:99999,background:"rgba(7,18,15,.82)",display:"flex",alignItems:"center",justifyContent:"center"}} onClick={onClose}>
    <div style={{background:"#0d1f19",border:"1px solid rgba(57,239,180,.3)",borderRadius:"14px",padding:"28px 32px",maxWidth:"380px",width:"90vw",textAlign:"center",boxShadow:"0 8px 40px rgba(0,0,0,.6)"}} onClick={e=>e.stopPropagation()}>
      <p style={{margin:"0 0 8px",fontSize:"13px",fontFamily:"var(--font-geist-mono,monospace)",letterSpacing:".14em",textTransform:"uppercase",color:"#39efb4"}}>{isIt?"Attenzione":"Warning"}</p>
      <p style={{margin:"0 0 20px",fontSize:"15px",color:"#e8f5ef",lineHeight:1.5}}>{isIt?"Il rapporto di visualizzazione è ottimizzato per questa schermata. Sei sicuro di voler cambiare lo zoom?":"The display ratio is optimised for this screen. Are you sure you want to change the zoom?"}</p>
      <div style={{display:"flex",gap:"10px",justifyContent:"center"}}>
        <button style={{padding:"8px 22px",borderRadius:"8px",border:"1px solid rgba(57,239,180,.35)",background:"transparent",color:"#39efb4",fontSize:"14px",cursor:"pointer",fontFamily:"inherit"}} onClick={onClose}>{isIt?"Annulla":"Cancel"}</button>
        <button style={{padding:"8px 22px",borderRadius:"8px",border:"1px solid #c84040",background:"rgba(200,64,64,.12)",color:"#ff8080",fontSize:"14px",cursor:"pointer",fontFamily:"inherit"}} onClick={onDismiss}>{isIt?"Continua comunque":"Continue anyway"}</button>
      </div>
    </div>
  </div>;
}


export function ApproachReport({language,setLanguage,setScreen,reset,goBack,t}:Props){
  const isIt=language==="it";
  const [zoomOpen,setZoomOpen,setZoomDismissed]=useVidPlus();
  return(
    <main className="approachIntroScreen" style={{position:"relative"}}>
      <VidPlusModal open={zoomOpen} onClose={()=>setZoomOpen(false)} onDismiss={()=>{setZoomOpen(false);setZoomDismissed(true);}} isIt={isIt}/>
      <div className="welcomeBlueBar"/>
      <header className="missionNav">
        <button className="brand brandButton" onClick={reset}><span className="brandMark">e·</span><span>Envizi<br/>Impact Quest</span></button>
        <div className="missionProgress"><span className="activeDot"/> IL PERCORSO</div>
        <button className="langMini" onClick={()=>setLanguage(language==="it"?"en":"it")}>{language==="it"?"EN":"IT"}</button>
      </header>
      <section className="approachIntroBody approachIntroBodyWithImg">
        <div className="approachIntroLeft">
          <h1 className="approachIntroTitle">{t.approachReportTitle}</h1>
        </div>
        <div className="approachIntroRight approachIntroRightWithCta">
          <img src="./step-6.svg" className="approachIntroStepBadge" alt="Step 6"/>
          <img src="./logica-report-finale.png" className="approachIntroImg" alt="Report finale ESG"/>
          <p className="approachIntroImgCaption approachIntroImgCaptionSm">{t.approachReportExample as string}</p>
          <button className="actionButton approachIntroCta approachIntroCtaRight" onClick={()=>setScreen("intro")}>{t.approachReportCta}<b>→</b></button>
        </div>
      </section>
      <div className="welcomeBlueBar" style={{background:"#39efb4"}}/>
    </main>
  );
}
