import type { Outcome } from "../types";
import type { CommonProps } from "./types";

interface ActiveScenario {
  optionA: string;
  optionADetail: string;
  optionATag?: string;
  optionB: string;
  optionBDetail: string;
  optionC: string;
  optionCDetail: string;
  asIsItems: {title:string;detail:string;metric:string}[];
}

interface Props extends CommonProps {
  selectedMission: number;
  active: ActiveScenario;
  asIsRatings: Record<number, ("alto"|"medio"|"basso")[]>;
  setScreenHistory: React.Dispatch<React.SetStateAction<any[]>>;
  setScreenState: (s: any) => void;
  handleDecision: (outcome: Outcome) => void;
  t: Record<string, any>;
}

const MISSION_IMGS = {
  positive:["./envizi-data-automation.png","./energy-envizi-analytics.png","./supply-chain-envizi.png","./reporting-envizi.png","./planning-envizi.png","./framework-envizi.png"],
  warning:["./envizi-manual-forms.png","./energy-manual-dashboard.png","./supply-chain-portal.png","./reporting-intermediate.png","./planning-intermediate.png","./framework-intermediate.png"],
  critical:["./envizi-spreadsheets-email.png","./energy-asis-fragmented.png","./supply-chain-asis.png","./reporting-asis.png","./planning-asis.png","./framework-asis.png"],
};

export function Compare({
  language,setLanguage,reset,
  selectedMission,active,asIsRatings,setScreenHistory,setScreenState,handleDecision,t,
}:Props){
  const m0=selectedMission===0;
  const isIt=language==="it";
  // 6 dimensioni di confronto — vendor-neutral
  type DimScore=1|2|3|4|5;
  const DIMS:{it:string,en:string}[]=[
    {it:"Copertura funzionale",en:"Functional coverage"},
    {it:"Facilità di implementazione",en:"Ease of implementation"},
    {it:"Qualità e tracciabilità del dato",en:"Data quality & traceability"},
    {it:"Scalabilità nel tempo",en:"Scalability over time"},
    {it:"Integrazione con sistemi esistenti",en:"Integration with existing systems"},
    {it:"Costo totale di ownership",en:"Total cost of ownership"},
  ];
  const DIM_SCORES:Record<string,DimScore[]>={
    critical:[1,5,1,1,2,5],
    warning: [3,3,3,3,3,3],
    positive:[5,2,5,5,4,2],
  };
  const options=[
    {key:"critical" as Outcome,title:active.optionC,detail:active.optionCDetail,img:MISSION_IMGS.critical[selectedMission]},
    {key:"warning" as Outcome,title:active.optionB,detail:active.optionBDetail,img:MISSION_IMGS.warning[selectedMission]},
    {key:"positive" as Outcome,title:active.optionA,tag:(active as any).optionATag as string|undefined,detail:active.optionADetail,img:MISSION_IMGS.positive[selectedMission]},
  ];
  const currentRatings=asIsRatings[selectedMission]||(active.asIsItems.map(()=>"alto" as "alto"|"medio"|"basso"));
  const ratingVal={"alto":25,"medio":12,"basso":0};
  const totalCrit=currentRatings.reduce((s,r)=>s+ratingVal[r],0);
  const critLevel=totalCrit<=25?"bassa":totalCrit<=50?"media":"alta";
  const critColor=critLevel==="alta"?"#ff6b6b":critLevel==="media"?"#f5c542":"#39efb4";
  const critLabel=isIt
    ?{alta:"CRITICITÀ ALTA",media:"CRITICITÀ MEDIA",bassa:"CRITICITÀ BASSA"}
    :{alta:"HIGH CRITICALITY",media:"MEDIUM CRITICALITY",bassa:"LOW CRITICALITY"};
  const critOnCard={"alta":"positive","media":"warning","bassa":"critical"} as Record<string,string>;

  return(
    <main className="compareScreen">
      <header className="missionNav">
        <button className="brand brandButton" onClick={reset}><span className="brandMark">e·</span><span>Envizi<br/>Impact Quest</span></button>
        <div className="missionProgress"><span className="activeDot"/> {t.mission} <b>{String(selectedMission+1).padStart(2,"0")}</b><i>/</i>06</div>
        <button className="introBackBtn" onClick={()=>{setScreenHistory((h:any[])=>h.filter((s:any)=>s!=="compare"));setScreenState("asis");}}>← {isIt?"Indietro":"Back"}</button>
        <button className="langMini" onClick={()=>setLanguage(language==="it"?"en":"it")}>{language==="it"?"EN":"IT"}</button>
      </header>
      <section className="compareBody">
        <h1>{isIt?"Scegli la strada":"Choose your path"}</h1>
        <p className="compareHint">{isIt?"Seleziona un'immagine per fare la tua scelta e proseguire.":"Select an image to make your choice and continue."}</p>
        <div className="compareGrid">
          {options.map(opt=>(
            <div key={opt.key} className="compareCardWrap">
              <article className={`compareCard ${opt.key}`} onClick={()=>handleDecision(opt.key)}>
                <div className="compareSolution">
                  <strong>{opt.title}</strong>
                  {opt.key==="positive"&&(opt as any).tag&&<span className="compareSolutionTag">{(opt as any).tag}</span>}
                </div>
                <div className="compareImg">
                  <img src={opt.img} alt={opt.title}/>
                  <div className="compareImgOverlay"><span>{isIt?"Scegli →":"Select →"}</span></div>
                </div>
                <div className="compareRowTop">
                  <p className="compareDetail">{opt.detail}</p>
                </div>
                <div className="compareDimTable" style={{padding:"8px 12px",borderTop:"1px solid rgba(255,255,255,.08)"}}>
                  {DIMS.map((dim,di)=>{
                    const score=DIM_SCORES[opt.key][di];
                    const color=score>=4?"#39efb4":score>=3?"#7dd3fc":"#9ca3af";
                    return <div key={di} style={{display:"flex",justifyContent:"space-between",alignItems:"center",fontSize:"11px",padding:"3px 0",borderBottom:"1px solid rgba(255,255,255,.04)"}}>
                      <span style={{color:"#aac8be"}}>{isIt?dim.it:dim.en}</span>
                      <span style={{color,fontWeight:700,fontFamily:"var(--font-geist-mono,monospace)",letterSpacing:".05em"}}>{"●".repeat(score)}{"○".repeat(5-score)}</span>
                    </div>;
                  })}
                </div>
              </article>
            </div>
          ))}
        </div>
      </section>
    </main>
  );
}
