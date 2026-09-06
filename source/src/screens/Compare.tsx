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
  const options=[
    {key:"critical" as Outcome,title:active.optionC,detail:active.optionCDetail,img:MISSION_IMGS.critical[selectedMission],
      solutionTag:m0?(isIt?"IBM Envizi Servizio Gestito":"IBM Envizi Managed Service"):undefined,
      solutionDetail:m0?(isIt?"Sperimenta con un nostro partner la gestione dei dati ESG.":"Experience ESG data management with one of our partners."):undefined},
    {key:"warning" as Outcome,title:active.optionB,detail:active.optionBDetail,img:MISSION_IMGS.warning[selectedMission],
      solutionTag:m0?(isIt?"IBM Envizi Standard":"IBM Envizi Standard"):undefined,
      solutionDetail:m0?(isIt?"Modulo Data Foundation. Semplicità e velocità pronti per evolvere con i tuoi bisogni.":"Data Foundation Module. Simplicity and speed, ready to evolve with your needs."):undefined},
    {key:"positive" as Outcome,title:active.optionA,tag:(active as any).optionATag as string|undefined,detail:active.optionADetail,img:MISSION_IMGS.positive[selectedMission],
      solutionTag:m0?(isIt?"IBM Envizi Premium":"IBM Envizi Premium"):undefined,
      solutionDetail:m0?(isIt?"Modulo Data Foundation e Connettori. Automazione e Affidabilità a portata di mano.":"Data Foundation Module and Connectors. Automation and Reliability at your fingertips."):undefined},
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
        <div className="introNavRight">
          <button className="langMini" onClick={()=>setLanguage(language==="it"?"en":"it")}>{language==="it"?"EN":"IT"}</button>
        </div>
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
              </article>
            </div>
          ))}
        </div>
      </section>
      <button className="secondaryAction" style={{position:"fixed",bottom:"24px",left:"24px",zIndex:9998}} onClick={()=>{setScreenHistory((h:any[])=>h.filter((s:any)=>s!=="compare"));setScreenState("asis");}}>← {isIt?"Indietro":"Back"}</button>
    </main>
  );
}
