import type { Screen, Priority } from "../types";
import type { CommonProps } from "./types";
import { missionCatalog } from "../constants";

interface NeedLike {
  id: string;
  priority?: Priority;
  label: string;
}

interface CapabilityMap {
  [id: string]: { it: string; en: string };
}

interface Props extends CommonProps {
  /** 0-based index into missionOrder for missions 2-6; fixed 0 for mission 1 */
  missionIndex: number;
  /** card number shown on display: 01, 02, ... */
  cardNum: number;
  /** screen to go back to */
  backScreen: Screen;
  /** the raw needs already filtered for this mission */
  needs: NeedLike[];
  priorities: Priority[];
  needRelevance: Record<string, number>;
  needCriticality: Record<string, number>;
  needIdToCapability: CapabilityMap;
  setSelectedMission: (n: number) => void;
}

export function MissionCardScreen({
  language,setLanguage,setScreen,reset,renderTrustBar,
  missionIndex,cardNum,backScreen,needs,
  priorities,needRelevance,needCriticality,needIdToCapability,
  setSelectedMission,
}:Props){
  const isIt=language==="it";
  const m=missionCatalog[missionIndex];

  const renderNeedsTable=(arr:NeedLike[])=>(
    <table style={{width:"100%",borderCollapse:"collapse",fontSize:"29px"}}>
      <thead>
        <tr>
          {[isIt?"Esigenza":"Need",isIt?"Rile. / Crit.":"Rel. / Crit.",isIt?"Capacità Envizi":"Envizi capability"].map(h=>(
            <th key={h} style={{textAlign:"left",padding:"6px 10px",color:"#f2fff9",fontWeight:700,letterSpacing:".08em",borderBottom:"1px solid rgba(57,239,180,.35)",whiteSpace:"nowrap"}}>{h}</th>
          ))}
        </tr>
      </thead>
      <tbody>
        {arr.map(n=>{
          const prioIdx=priorities.indexOf((n as any).priority);
          const relMax=prioIdx===0?10:prioIdx===1?8:prioIdx===2?6:4;
          const rel=Math.min(needRelevance[n.id]??Math.round(relMax/2),relMax);
          const relNorm=Math.round((rel/relMax)*10);
          const crit=needCriticality[n.id]??5;
          const cap=needIdToCapability[n.id];
          const capLabel=cap?(isIt?cap.it:cap.en):null;
          const isF=n.id==="__foundation__";
          const tier=isF?"green":relNorm>7&&crit>7?"red":relNorm>4||crit>4?"yellow":"green";
          const tc=tier==="red"?"#ff4d4d":tier==="yellow"?"#7dd3fc":"#39efb4";
          return(
            <tr key={n.id} style={{borderBottom:"1px solid rgba(255,255,255,.08)"}}>
              <td style={{padding:"8px 10px",color:tc,lineHeight:1.35,fontWeight:500,overflow:"hidden",WebkitLineClamp:2,WebkitBoxOrient:"vertical" as "vertical",display:"-webkit-box" as any}}>⬡ {n.label}</td>
              <td style={{padding:"8px 10px",color:tc,whiteSpace:"nowrap",fontFamily:"var(--font-geist-mono)",fontSize:"27px",fontWeight:700}}>{isF?"—":`R:${relNorm} C:${crit}`}</td>
              <td style={{padding:"8px 10px",color:tc,lineHeight:1.35,overflow:"hidden",WebkitLineClamp:2,WebkitBoxOrient:"vertical" as "vertical",display:"-webkit-box" as any}}>{capLabel||"—"}</td>
            </tr>
          );
        })}
      </tbody>
    </table>
  );

  return(
    <main className="missionMenuScreen">
      <header className="missionNav missionNavTrust" style={{position:"fixed",top:0,left:0,right:0}}>
        <button className="brand brandButton" onClick={reset}><span className="brandMark">e·</span><span>Envizi<br/>Impact Quest</span></button>
        <div className="missionProgress"><span className="activeDot"/> SFIDE</div>
        {renderTrustBar()}
        <button className="langMini" onClick={()=>setLanguage(language==="it"?"en":"it")}>{language==="it"?"EN":"IT"}</button>
      </header>
      <section className="missionCards roadmapCards" style={{paddingTop:"80px",paddingBottom:"100px",display:"flex",justifyContent:"center",alignItems:"flex-start",minHeight:"100vh",overflowY:"auto"}}>
        <article className="missionCard" style={{maxWidth:"960px",width:"100%",pointerEvents:"none"}}>
          <div className="missionCardChallengeBox">
            <div className="missionCardTop"><span>{String(cardNum).padStart(2,"0")}</span><i>{m.icon}</i></div>
            <h2>{isIt?m.it:m.en}</h2>
          </div>
          <div className="missionCardNeedsBox">{needs.length>0?renderNeedsTable(needs):<span className="missionCardNeed">—</span>}</div>
        </article>
      </section>
      <div style={{position:"fixed",bottom:"32px",left:0,right:0,display:"flex",justifyContent:"center",gap:"12px"}}>
        <button className="secondaryAction" onClick={()=>setScreen(backScreen)}>← {isIt?"Indietro":"Back"}</button>
        <button className="actionButton" style={{width:"auto",marginTop:0,padding:"12px 24px"}} onClick={()=>{setSelectedMission(missionIndex);localStorage.setItem("envizi-quest-mission",String(missionIndex+1));setScreen("briefing");}}>{isIt?"Avanti →":"Next →"}</button>
      </div>
    </main>
  );
}
