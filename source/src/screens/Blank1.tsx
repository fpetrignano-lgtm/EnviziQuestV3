import { useState, useEffect } from "react";
import type { CommonProps } from "./types";

interface Props extends CommonProps {
  p10SlideIdx: number;
  setP10SlideIdx: React.Dispatch<React.SetStateAction<number>>;
  P10_SLIDES: string[];
  onDownloadPptx?: (lang: "it"|"en") => void;
  onRefreshAndView?: (lang: "it"|"en") => Promise<void>;
}

export function Blank1({language,profile,setLanguage,setScreen,reset,renderTrustBar,p10SlideIdx,setP10SlideIdx,P10_SLIDES}:Props){
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
    <main style={{display:"flex",flexDirection:"column",height:"1080px",background:"var(--bg)",overflow:"hidden",position:"relative"}}>
      {zoomWarnOpen&&<div style={{position:"fixed",inset:0,zIndex:99999,background:"rgba(7,18,15,.82)",display:"flex",alignItems:"center",justifyContent:"center"}} onClick={()=>setZoomWarnOpen(false)}>
        <div style={{background:"#0d1f19",border:"1px solid rgba(57,239,180,.3)",borderRadius:"14px",padding:"28px 32px",maxWidth:"380px",width:"90vw",textAlign:"center",boxShadow:"0 8px 40px rgba(0,0,0,.6)"}} onClick={e=>e.stopPropagation()}>
          <p style={{margin:"0 0 8px",fontSize:"13px",fontFamily:"var(--font-geist-mono,monospace)",letterSpacing:".14em",textTransform:"uppercase",color:"#39efb4"}}>{language==="it"?"Attenzione":"Warning"}</p>
          <p style={{margin:"0 0 20px",fontSize:"15px",color:"#e8f5ef",lineHeight:1.5}}>{language==="it"?"Il rapporto di visualizzazione è ottimizzato per questa schermata. Sei sicuro di voler cambiare lo zoom?":"The display ratio is optimised for this screen. Are you sure you want to change the zoom?"}</p>
          <div style={{display:"flex",gap:"10px",justifyContent:"center"}}>
            <button style={{padding:"8px 22px",borderRadius:"8px",border:"1px solid rgba(57,239,180,.35)",background:"transparent",color:"#39efb4",fontSize:"14px",cursor:"pointer",fontFamily:"inherit"}} onClick={()=>setZoomWarnOpen(false)}>{language==="it"?"Annulla":"Cancel"}</button>
            <button style={{padding:"8px 22px",borderRadius:"8px",border:"1px solid #c84040",background:"rgba(200,64,64,.12)",color:"#ff8080",fontSize:"14px",cursor:"pointer",fontFamily:"inherit"}} onClick={()=>setZoomWarnOpen(false)}>{language==="it"?"Continua comunque":"Continue anyway"}</button>
          </div>
        </div>
      </div>}
      <div style={{position:"absolute",top:0,left:0,right:0,height:"4px",background:"#3b82f4",zIndex:100}}/>
      <header className="missionNav">
        <button className="brand brandButton" onClick={reset}><span className="brandMark">e·</span><span>Envizi<br/>Impact Quest</span></button>
        <div className="missionProgress"><span className="activeDot"/> IL QUEST</div>
        <button className="langMini" onClick={()=>setLanguage(language==="it"?"en":"it")}>{language==="it"?"EN":"IT"}</button>
      </header>
      <section style={{display:"flex",flexDirection:"column",alignItems:"center",gap:"12px",padding:"12px 0 20px",width:"100%",flex:1,minHeight:0}}>
        <div style={{position:"relative",width:"100%",maxWidth:"none",flex:1,minHeight:0,display:"flex",alignItems:"center",justifyContent:"center"}}>
          <img src="./slide-education-1.png" alt="Education slide 1" style={{width:"100%",height:"100%",objectFit:"contain",borderRadius:"10px",boxShadow:"0 4px 32px rgba(0,0,0,.5)",display:"block"}}/>
        </div>
        <div style={{display:"flex",alignItems:"center",gap:"20px",marginTop:"4px",flexShrink:0}}>
          <button className="introBackBtn" onClick={()=>setScreen("questIntro")}>← {language==="it"?"Indietro":"Back"}</button>
          <button style={{background:"#1a56db",color:"#fff",border:"none",borderRadius:"8px",padding:"14px 36px",fontWeight:700,cursor:"pointer",fontSize:"16px",letterSpacing:".04em"}} onClick={()=>{setP10SlideIdx(0);setScreen("p10Slideshow");}}>▶ {language==="it"?"Presentazione IT":"Presentation IT"}</button>
          <button style={{background:"#0f3460",color:"#fff",border:"none",borderRadius:"8px",padding:"14px 36px",fontWeight:700,cursor:"pointer",fontSize:"16px",letterSpacing:".04em"}} onClick={()=>{setP10SlideIdx(0);setLanguage("en");setScreen("p10Slideshow");}}>▶ Presentation EN</button>
          <button className="actionButton approachIntroCta" onClick={()=>setScreen("approach")}>{language==="it"?"Avanti":"Next"} <b>→</b></button>
        </div>
      </section>
      <div style={{position:"absolute",bottom:0,left:0,right:0,height:"4px",background:"#39efb4",zIndex:100}}/>
    </main>
  );
}

export function IlTuoReport({language,profile,setLanguage,setScreen,reset,renderTrustBar,p10SlideIdx,setP10SlideIdx,P10_SLIDES,onDownloadPptx,onRefreshAndView}:Props){
  const isIt = language === "it";
  const [refreshing, setRefreshing] = useState(false);
  const [refreshError, setRefreshError] = useState<string|null>(null);

  const handleRefresh = async (lang: "it"|"en") => {
    if (!onRefreshAndView) return;
    setRefreshing(true);
    setRefreshError(null);
    setLanguage(lang);
    try {
      await onRefreshAndView(lang);
      setScreen("reportSlideshowPng");
    } catch(e:any) {
      setRefreshError(isIt ? "Errore aggiornamento slide. Riprova." : "Slide update failed. Please retry.");
    } finally {
      setRefreshing(false);
    }
  };

  return(
    <main style={{display:"flex",flexDirection:"column",height:"1080px",background:"var(--bg)",overflow:"hidden",position:"relative"}}>
      <div style={{position:"absolute",top:0,left:0,right:0,height:"4px",background:"#3b82f4",zIndex:100}}/>
      <header className="missionNav">
        <button className="brand brandButton" onClick={reset}><span className="brandMark">e·</span><span>Envizi<br/>Impact Quest</span></button>
        <button className="langMini" onClick={()=>setLanguage(language==="it"?"en":"it")}>{language==="it"?"EN":"IT"}</button>
      </header>
      <section style={{display:"flex",flexDirection:"column",alignItems:"center",gap:"12px",padding:"12px 0 20px",width:"100%",flex:1,minHeight:0}}>
        <div style={{width:"100%",padding:"0 40px",flexShrink:0}}>
          <h1 style={{margin:"0 0 6px",fontSize:"clamp(25px,2.24vw,33.6px)",fontWeight:700,color:"#e8f5ef",letterSpacing:"-.01em"}}>
            {isIt?"Sintesi intermedia delle priorità":"Interim priorities summary"}
          </h1>
          <p style={{margin:0,fontSize:"clamp(17px,1.4vw,19.6px)",color:"#7db89a",lineHeight:1.4,maxWidth:"none"}}>
            {isIt
              ? <>Questo documento raccoglie gli obiettivi ESG selezionati, le esigenze di gestione dati prioritarie e la roadmap delle sfide operative.<br/>Verrà aggiornato automaticamente, riflettendo le nuove valutazioni e i progressi raggiunti. Seleziona «Genera e visualizza» oppure «Scarica il documento di presentazione».</>
              : <>This document consolidates the selected ESG objectives, priority data management needs and operational challenge roadmap.<br/>It will be updated automatically, reflecting new ratings and progress made. Select «Generate & view» or «Download the presentation».</>
            }
          </p>
        </div>
        <div style={{position:"relative",width:"100%",maxWidth:"none",flex:1,minHeight:0,display:"flex",alignItems:"center",justifyContent:"center"}}>
          <img src="./logica-report-finale.png" alt={isIt?"Anteprima report":"Report preview"} style={{width:"100%",height:"100%",objectFit:"contain",borderRadius:"10px",boxShadow:"0 4px 32px rgba(0,0,0,.5)",display:"block"}}/>
        </div>
        {refreshError&&<p style={{color:"#ff7777",fontSize:"13px",margin:0}}>{refreshError}</p>}
        <div style={{display:"flex",alignItems:"center",gap:"12px",marginTop:"4px",flexShrink:0,flexWrap:"wrap",justifyContent:"center"}}>
          <button className="introBackBtn" onClick={()=>setScreen("priorityMatrix")}>← {isIt?"Indietro":"Back"}</button>

          {/* Scarica PPTX */}
          {onDownloadPptx&&<>
            <button style={{background:"#0d5c3a",color:"#39efb4",border:"1px solid #39efb4",borderRadius:"8px",padding:"12px 24px",fontWeight:700,cursor:"pointer",fontSize:"15px",letterSpacing:".04em"}}
              onClick={()=>onDownloadPptx("it")}>↓ {isIt?"Scarica IT":"Download IT"}</button>
            <button style={{background:"#0d3a2a",color:"#39efb4",border:"1px solid #39efb4",borderRadius:"8px",padding:"12px 24px",fontWeight:700,cursor:"pointer",fontSize:"15px",letterSpacing:".04em"}}
              onClick={()=>onDownloadPptx("en")}>↓ Download EN</button>
          </>}

          {/* Scarica e visualizza — aggiorna i PNG e apre il slideshow */}
          {onRefreshAndView&&<>
            <button
              disabled={refreshing}
              style={{background:refreshing?"#1a3a2a":"#1a56db",color:"#fff",border:"none",borderRadius:"8px",padding:"12px 24px",fontWeight:700,cursor:refreshing?"not-allowed":"pointer",fontSize:"15px",letterSpacing:".04em",opacity:refreshing?0.7:1}}
              onClick={()=>handleRefresh("it")}>
              {refreshing?"⏳ "+( isIt?"Generando…":"Generating…"):"▶ "+(isIt?"Genera e visualizza IT":"Generate & view IT")}
            </button>
            <button
              disabled={refreshing}
              style={{background:refreshing?"#0f2040":"#0f3460",color:"#fff",border:"none",borderRadius:"8px",padding:"12px 24px",fontWeight:700,cursor:refreshing?"not-allowed":"pointer",fontSize:"15px",letterSpacing:".04em",opacity:refreshing?0.7:1}}
              onClick={()=>handleRefresh("en")}>
              {refreshing?"⏳ Generating…":"▶ Generate & view EN"}
            </button>
          </>}

          <button className="actionButton approachIntroCta" onClick={()=>setScreen("esgStrategist")}>{isIt?"Avanti":"Next"} <b>→</b></button>
        </div>
      </section>
      <div style={{position:"absolute",bottom:0,left:0,right:0,height:"4px",background:"#3b82f4",zIndex:100}}/>
    </main>
  );
}
