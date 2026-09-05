import type { CommonProps } from "./types";
import type { Screen } from "../types";

interface Props extends CommonProps {
  p10SlideIdx: number;
  setP10SlideIdx: React.Dispatch<React.SetStateAction<number>>;
  P10_SLIDES: string[];
  backScreen?: Screen;
}

export function P10Slideshow({language,setLanguage,setScreen,reset,p10SlideIdx,setP10SlideIdx,P10_SLIDES,backScreen="blank1"}:Props){
  return(
    <main style={{background:"#000",display:"grid",gridTemplateRows:"auto 1fr auto",height:"100dvh",overflow:"hidden"}}>
      <header style={{display:"flex",alignItems:"center",justifyContent:"space-between",padding:"10px 20px",background:"rgba(0,0,0,.85)",zIndex:10}}>
        <button className="brand brandButton" onClick={reset} style={{color:"#fff"}}><span className="brandMark">e·</span><span>Envizi<br/>Impact Quest</span></button>
        <span style={{color:"#c9e8dc",fontSize:"13px",fontWeight:700}}>{p10SlideIdx+1} / {P10_SLIDES.length}</span>
        <button className="langMini" onClick={()=>setScreen(backScreen)} style={{background:"transparent",border:"1px solid #39efb4",color:"#39efb4",borderRadius:"4px",padding:"4px 10px",cursor:"pointer"}}>✕ {language==="it"?"Chiudi":"Close"}</button>
      </header>
      <section style={{display:"flex",alignItems:"center",justifyContent:"center",overflow:"hidden",background:"#000",minHeight:0}}>
        <img src={P10_SLIDES[p10SlideIdx]} alt={`Slide ${p10SlideIdx+1}`} style={{maxWidth:"100%",maxHeight:"100%",width:"100%",height:"100%",objectFit:"contain"}}/>
      </section>
      <footer style={{display:"flex",alignItems:"center",justifyContent:"center",gap:"24px",padding:"12px 20px",background:"rgba(0,0,0,.85)"}}>
        <button onClick={()=>setP10SlideIdx(i=>Math.max(0,i-1))} disabled={p10SlideIdx===0} style={{background:"transparent",border:"none",cursor:p10SlideIdx===0?"not-allowed":"pointer",opacity:p10SlideIdx===0?0.2:1}}>
          <svg width="36" height="54" viewBox="0 0 36 54"><polygon points="34,2 2,27 34,52" fill="white"/></svg>
        </button>
        <div style={{display:"flex",gap:"6px"}}>
          {P10_SLIDES.map((_,i)=><span key={i} onClick={()=>setP10SlideIdx(i)} style={{width:"8px",height:"8px",borderRadius:"50%",background:i===p10SlideIdx?"#39efb4":"#3a6a58",border:i===p10SlideIdx?"none":"1px solid #39efb4",cursor:"pointer",display:"inline-block"}}/>)}
        </div>
        <button onClick={()=>p10SlideIdx===P10_SLIDES.length-1?setScreen(backScreen):setP10SlideIdx(i=>i+1)} style={{background:"transparent",border:"none",cursor:"pointer"}}>
          <svg width="36" height="54" viewBox="0 0 36 54"><polygon points="2,2 34,27 2,52" fill="white"/></svg>
        </button>
      </footer>
    </main>
  );
}
