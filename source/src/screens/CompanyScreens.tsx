import React, { useState, useEffect } from "react";
import type { Market, SectorKey, EsgReadiness } from "../types";
import type { CommonProps } from "./types";
import { SECTORS, SECTOR_KEYS, ESG_READINESS_IT, ESG_READINESS_EN } from "../constants";


type SiteGeoKey="italia"|"europa"|"uk"|"nordamerica"|"sudamerica"|"asia"|"africa"|"australia";
type SiteRowKey="uffici"|"ops"|"datacenter"|"altro";
type SiteTable=Record<SiteRowKey,Record<SiteGeoKey,number>>;

// ── CsSiteMap ──────────────────────────────────────────────────────────────
// Planisfero SVG semplificato con icone sedi per area geografica
const GEO_ANCHORS: Record<SiteGeoKey,{cx:number,cy:number}> = {
  italia:     {cx:52,  cy:38},
  europa:     {cx:49,  cy:33},
  uk:         {cx:44,  cy:28},
  nordamerica:{cx:19,  cy:36},
  sudamerica: {cx:28,  cy:63},
  asia:       {cx:72,  cy:37},
  africa:     {cx:50,  cy:58},
  australia:  {cx:80,  cy:67},
};

function IconUffici({x,y,size=14}:{x:number,y:number,size?:number}){
  const h=size,w=size*0.7;
  return <g transform={`translate(${x-w/2},${y-h})`}>
    <rect x={0} y={h*0.25} width={w} height={h*0.75} fill="#c8e6f5" stroke="#4a90b8" strokeWidth={0.8} rx={1}/>
    <rect x={w*0.1} y={0} width={w*0.8} height={h*0.3} fill="#a0cfe8" stroke="#4a90b8" strokeWidth={0.7} rx={1}/>
    <rect x={w*0.3} y={h*0.5} width={w*0.4} height={h*0.5} fill="#7ab8d8" rx={0.5}/>
    <rect x={w*0.05} y={h*0.35} width={w*0.22} height={h*0.22} fill="#7ab8d8" rx={0.5}/>
    <rect x={w*0.73} y={h*0.35} width={w*0.22} height={h*0.22} fill="#7ab8d8" rx={0.5}/>
  </g>;
}
function IconOps({x,y,size=14}:{x:number,y:number,size?:number}){
  const h=size,w=size*0.9;
  return <g transform={`translate(${x-w/2},${y-h})`}>
    <rect x={0} y={h*0.35} width={w} height={h*0.65} fill="#c8f0dd" stroke="#3a9e6a" strokeWidth={0.8} rx={1}/>
    <polygon points={`0,${h*0.35} ${w/2},0 ${w},${h*0.35}`} fill="#a0dfc0" stroke="#3a9e6a" strokeWidth={0.7}/>
    <rect x={w*0.15} y={h*0.55} width={w*0.22} height={h*0.45} fill="#3a9e6a" rx={0.5}/>
    <rect x={w*0.63} y={h*0.55} width={w*0.22} height={h*0.45} fill="#3a9e6a" rx={0.5}/>
    <rect x={w*0.35} y={h*0.15} width={w*0.3} height={h*0.2} fill="#3a9e6a" rx={1}/>
  </g>;
}
function IconDatacenter({x,y,size=14}:{x:number,y:number,size?:number}){
  const h=size,w=size*0.75;
  return <g transform={`translate(${x-w/2},${y-h})`}>
    <rect x={0} y={0} width={w} height={h} fill="#e8d8f8" stroke="#7b50c8" strokeWidth={0.8} rx={1.5}/>
    {[0.15,0.38,0.61].map((fy,i)=><g key={i}>
      <rect x={w*0.08} y={h*fy} width={w*0.84} height={h*0.18} fill="#c8a8f0" rx={0.5}/>
      <circle cx={w*0.8} cy={h*(fy+0.09)} r={2} fill="#7b50c8"/>
    </g>)}
  </g>;
}
function IconAltro({x,y,size=13}:{x:number,y:number,size?:number}){
  return <g>
    <circle cx={x} cy={y-size*0.5} r={size*0.45} fill="#f5e8c8" stroke="#c8922a" strokeWidth={0.8}/>
    <line x1={x} y1={y-size*0.05} x2={x} y2={y} stroke="#c8922a" strokeWidth={1.2}/>
  </g>;
}

const ICON_MAP:{[K in SiteRowKey]:(props:{x:number,y:number})=>JSX.Element}={
  uffici:(p)=><IconUffici {...p}/>,
  ops:(p)=><IconOps {...p}/>,
  datacenter:(p)=><IconDatacenter {...p}/>,
  altro:(p)=><IconAltro {...p}/>,
};

function CsSiteMap({siteTable,siteRowDefs,isIt}:{
  siteTable:SiteTable,
  siteRowDefs:{key:SiteRowKey,label:{it:string,en:string}}[],
  isIt:boolean,
}){
  // Per ogni area geo, raccoglie i tipi di sede presenti (count>0)
  const activeByGeo:(SiteGeoKey)[]=(Object.keys(GEO_ANCHORS) as SiteGeoKey[]).filter(g=>
    (["uffici","ops","datacenter","altro"] as SiteRowKey[]).some(r=>(siteTable[r][g]??0)>0)
  );
  const rowsWithData=(["uffici","ops","datacenter","altro"] as SiteRowKey[]).filter(r=>
    (Object.keys(GEO_ANCHORS) as SiteGeoKey[]).some(g=>(siteTable[r][g]??0)>0)
  );
  // Offset orizzontale per impilare icone diverse sulla stessa area
  const iconOffset=10;
  return (
    <div className="csSiteMapWrap">
      <svg viewBox="0 0 110 80" className="csSiteMapSvg" xmlns="http://www.w3.org/2000/svg">
        {/* Oceani */}
        <rect x={0} y={0} width={110} height={80} fill="#d4eaf7" rx={3}/>
        {/* Continenti — path semplificati */}
        {/* Europa */}
        <path d="M44,22 L52,20 L56,24 L54,30 L50,32 L46,30 L43,26 Z" fill="#dde8c8" stroke="#a8c080" strokeWidth={0.4}/>
        {/* Africa */}
        <path d="M44,34 L52,32 L56,36 L55,50 L50,58 L44,56 L40,48 L41,38 Z" fill="#e8ddc8" stroke="#c0a870" strokeWidth={0.4}/>
        {/* Asia */}
        <path d="M56,18 L80,16 L88,22 L86,38 L78,44 L64,42 L56,36 L54,28 Z" fill="#d8e8c0" stroke="#90b870" strokeWidth={0.4}/>
        {/* Australia */}
        <path d="M74,58 L86,56 L88,62 L84,68 L76,70 L72,65 Z" fill="#e8d8c0" stroke="#b8a070" strokeWidth={0.4}/>
        {/* Nord America */}
        <path d="M6,16 L26,14 L30,22 L28,36 L22,42 L12,40 L6,32 Z" fill="#c8d8e8" stroke="#80a0c0" strokeWidth={0.4}/>
        {/* Sud America */}
        <path d="M20,44 L32,42 L36,50 L34,64 L28,70 L20,68 L16,58 Z" fill="#d0e0c8" stroke="#90b080" strokeWidth={0.4}/>
        {/* Groenlandia/isole */}
        <ellipse cx={38} cy={14} rx={5} ry={3} fill="#e4eef8" stroke="#b0c8d8" strokeWidth={0.3}/>
        {/* Linea equatore */}
        <line x1={0} y1={44} x2={110} y2={44} stroke="#b8d0c0" strokeWidth={0.25} strokeDasharray="2,2"/>
        {/* Griglia leggera */}
        {[20,40,60,80,100].map(x=><line key={x} x1={x} y1={0} x2={x} y2={80} stroke="#c0d8e8" strokeWidth={0.2} strokeDasharray="1,3"/>)}
        {[20,40,60].map(y=><line key={y} x1={0} y1={y} x2={110} y2={y} stroke="#c0d8e8" strokeWidth={0.2} strokeDasharray="1,3"/>)}
        {/* Icone sedi per geo-area */}
        {(Object.keys(GEO_ANCHORS) as SiteGeoKey[]).map(g=>{
          const rows=(["uffici","ops","datacenter","altro"] as SiteRowKey[]).filter(r=>(siteTable[r][g]??0)>0);
          if(rows.length===0)return null;
          const {cx,cy}=GEO_ANCHORS[g];
          const total=rows.length;
          return rows.map((r,i)=>{
            const ox=(i-(total-1)/2)*iconOffset;
            const Icon=ICON_MAP[r];
            const count=siteTable[r][g]??0;
            return <g key={`${g}-${r}`}>
              <Icon x={cx+ox} y={cy}/>
              <text x={cx+ox} y={cy+3} textAnchor="middle" fontSize={4} fill="#1a3a2a" fontWeight="700">{count}</text>
            </g>;
          });
        })}
        {/* Legenda */}
        {rowsWithData.length>0&&<g>
          {rowsWithData.map((r,i)=>{
            const label=isIt?siteRowDefs.find(d=>d.key===r)!.label.it:siteRowDefs.find(d=>d.key===r)!.label.en;
            const Icon=ICON_MAP[r];
            return <g key={r} transform={`translate(2,${66+i*5})`}>
              <Icon x={4} y={4}/>
              <text x={10} y={3.5} fontSize={3.5} fill="#2a4a3a">{label}</text>
            </g>;
          })}
        </g>}
      </svg>
      {activeByGeo.length===0&&<p className="csSiteMapEmpty">{isIt?"Inserisci sedi nella tabella per visualizzare la mappa":"Enter locations in the table to display the map"}</p>}
    </div>
  );
}

interface CompanySetupProps extends CommonProps {
  companyName: string;
  setCompanyName: (v: string) => void;
  questName: string;
  companySector: SectorKey;
  setCompanySector: (v: SectorKey) => void;
  companyMarket: Market;
  setCompanyMarket: (v: Market) => void;
  esgReadiness: EsgReadiness;
  setEsgReadiness: (v: EsgReadiness) => void;
  companyDims: [number,number,number,number,number];
  updateCompanyDim: (i: number, v: number) => void;
  siteTable: SiteTable;
  updateSiteCell: (row: SiteRowKey, geo: SiteGeoKey, val: number) => void;
  siteTotalAll: () => number;
  name: string;
  workshopDate: string;
  setWorkshopDate: (v: string) => void;
  consultantName: string;
  setConsultantName: (v: string) => void;
  companyLogo: string;
  setCompanyLogo: (v: string) => void;
  participantRole: string;
  setParticipantRole: (v: string) => void;
  participantCompany: string;
  setParticipantCompany: (v: string) => void;
  businessUnit: string;
  setBusinessUnit: (v: string) => void;
  revenueYear: number;
  setRevenueYear: (v: number) => void;
  reportingPath: 0|1|2|3|4|5;
  setReportingPath: (v: 0|1|2|3|4|5) => void;
}

export function CompanySetupScreen({
  language, profile, setLanguage, setScreen, reset,
  companyName, setCompanyName, questName, companySector, setCompanySector,
  companyMarket, setCompanyMarket, esgReadiness, setEsgReadiness,
  companyDims, updateCompanyDim, siteTable, updateSiteCell, siteTotalAll, name,
  workshopDate, setWorkshopDate, consultantName, setConsultantName,
  companyLogo, setCompanyLogo,
  participantRole, setParticipantRole, participantCompany, setParticipantCompany,
  businessUnit, setBusinessUnit,
  revenueYear, setRevenueYear,
  reportingPath, setReportingPath,
}: CompanySetupProps) {
  const isIt = language === "it";
  const sec = SECTORS[companySector];
  const readinessList = isIt ? ESG_READINESS_IT : ESG_READINESS_EN;
  const activeReadiness = readinessList.find(r => r.key === esgReadiness)!;
  const handleSectorChange = (sk: SectorKey) => { setCompanySector(sk); };
  const [zoomWarnOpen, setZoomWarnOpen] = useState(false);
  useEffect(() => {
    const handler = (e: KeyboardEvent) => {
      const mod = e.metaKey || e.ctrlKey;
      if (!mod) return;
      if (e.key === "+" || e.key === "=" || e.key === "-" || e.key === "0") {
        e.preventDefault();
        setZoomWarnOpen(true);
      }
    };
    window.addEventListener("keydown", handler);
    return () => window.removeEventListener("keydown", handler);
  }, []);
  const geoColKeys: SiteGeoKey[] = ["italia","europa","uk","nordamerica","sudamerica","asia","africa","australia"];
  const geoColLabels: Record<SiteGeoKey,{it:string,en:string}> = {
    italia:{it:"Italia",en:"Italy"}, europa:{it:"Europa",en:"Europe"}, uk:{it:"UK",en:"UK"},
    nordamerica:{it:"N. Amer.",en:"N. Amer."}, sudamerica:{it:"S. Amer.",en:"S. Amer."},
    asia:{it:"Asia",en:"Asia"}, africa:{it:"Africa",en:"Africa"},
    australia:{it:"Australia",en:"Australia"},
  };
  const siteRowDefs: {key:SiteRowKey,label:{it:string,en:string}}[] = [
    {key:"uffici",   label:{it:"Sedi uffici",en:"Office locations"}},
    {key:"ops",      label:{it:sec.opsUnit.it.charAt(0).toUpperCase()+sec.opsUnit.it.slice(1),en:sec.opsUnit.en.charAt(0).toUpperCase()+sec.opsUnit.en.slice(1)}},
    {key:"datacenter",label:{it:"Data center",en:"Data centres"}},
    {key:"altro",    label:{it:"Altro",en:"Other"}},
  ];
  const siteTotal = siteTotalAll();
  const dimLabelRevenue = sec.dimUnit;
  const dimLabelEmployees:{it:string,en:string}={it:"dipendenti",en:"employees"};
  return <main className="csScreen" style={{position:"relative"}}>
  {zoomWarnOpen&&<Portal><div style={{position:"fixed",inset:0,zIndex:9999,background:"rgba(7,18,15,.82)",display:"flex",alignItems:"center",justifyContent:"center"}} onClick={()=>setZoomWarnOpen(false)}>
    <div style={{background:"#0d1f19",border:"1px solid rgba(57,239,180,.3)",borderRadius:"14px",padding:"28px 32px",maxWidth:"380px",width:"90vw",textAlign:"center",boxShadow:"0 8px 40px rgba(0,0,0,.6)"}} onClick={e=>e.stopPropagation()}>
      <p style={{margin:"0 0 8px",fontSize:"13px",fontFamily:"var(--font-geist-mono,monospace)",letterSpacing:".14em",textTransform:"uppercase",color:"#39efb4"}}>{isIt?"Attenzione":"Warning"}</p>
      <p style={{margin:"0 0 20px",fontSize:"15px",color:"#e8f5ef",lineHeight:1.5}}>{isIt?"Il rapporto di visualizzazione è ottimizzato per questa schermata. Sei sicuro di voler cambiare lo zoom?":"The display ratio is optimised for this screen. Are you sure you want to change the zoom?"}</p>
      <div style={{display:"flex",gap:"10px",justifyContent:"center"}}>
        <button style={{padding:"8px 22px",borderRadius:"8px",border:"1px solid rgba(57,239,180,.35)",background:"transparent",color:"#39efb4",fontSize:"14px",cursor:"pointer",fontFamily:"inherit"}} onClick={()=>setZoomWarnOpen(false)}>{isIt?"Annulla":"Cancel"}</button>
        <button style={{padding:"8px 22px",borderRadius:"8px",border:"1px solid #c84040",background:"rgba(200,64,64,.12)",color:"#ff8080",fontSize:"14px",cursor:"pointer",fontFamily:"inherit"}} onClick={()=>setZoomWarnOpen(false)}>{isIt?"Continua comunque":"Continue anyway"}</button>
      </div>
    </div>
  </div></Portal>}
  <div className="welcomeBlueBar"/>
    <header className="missionNav"><button className="brand brandButton" onClick={reset}><span className="brandMark">e·</span><span>Envizi<br/>Impact Quest</span></button><div className="missionProgress"><span className="activeDot"/> {isIt?"LA TUA AZIENDA":"YOUR COMPANY"}</div><button className="langMini" onClick={()=>setLanguage(language==="it"?"en":"it")}>{language==="it"?"EN":"IT"}</button></header>
    <div className="csBody">
      <div className="csLeft"><img className="csProfileImg" src={`./characters/${profile}-neutral.png`} alt={name}/><div className="csProfileTag"><span className="statusDot"/><div><small>ESG MANAGER</small><strong>{name}</strong></div></div></div>
      <div className="csRight">
        <p className="eyebrow">{isIt?"RACCONTACI LA TUA AZIENDA":"TELL US ABOUT YOUR COMPANY"}</p>
        <h1 className="csTitle">{companyName||(isIt?"La tua azienda":"Your company")}</h1>
        <div className="csFormOneCol">
        <div className="csField csFieldName">
          <label>{isIt?"Nome Azienda":"Company Name"}<span className="csNameHint">{isIt?"· inserisci il nome della tua azienda":"· enter your company name"}</span></label>
          <input className="csInput csInputName" placeholder={isIt?"Es. Acme S.p.A.":"E.g. Acme Ltd"} value={companyName} onChange={e=>setCompanyName(e.target.value)}/>
          {questName&&<p style={{margin:"4px 0 0",fontSize:"12px",color:"#6a9a88",lineHeight:1.4}}>{isIt?"Sessione:":"Session:"} <span style={{color:"#9abfb0"}}>{questName}</span></p>}
        </div>
          <div className="csField">
            <label>{isIt?"Logo azienda (opzionale)":"Company logo (optional)"}</label>
            <div style={{display:"flex",alignItems:"center",gap:"10px",flexWrap:"wrap"}}>
              <label style={{cursor:"pointer",display:"inline-flex",alignItems:"center",gap:"6px",fontSize:"13px",padding:"6px 12px",border:"1px solid #3a6a50",borderRadius:"6px",background:"#f7faf8",color:"#0d3a2a"}}>
                📎 {isIt?"Carica immagine":"Upload image"}
                <input type="file" accept="image/*" style={{display:"none"}} onChange={e=>{const file=e.target.files?.[0];if(!file)return;const reader=new FileReader();reader.onload=ev=>{if(ev.target?.result)setCompanyLogo(ev.target.result as string);};reader.readAsDataURL(file);}}/>
              </label>
              {companyLogo&&(<><img src={companyLogo} alt="logo" style={{height:"36px",maxWidth:"120px",objectFit:"contain",borderRadius:"4px",border:"1px solid #d0e8d8"}}/><button onClick={()=>setCompanyLogo("")} style={{fontSize:"11px",padding:"3px 8px",border:"1px solid #c0d0c8",borderRadius:"4px",background:"#fff",cursor:"pointer",color:"#666"}}>✕ {isIt?"Rimuovi":"Remove"}</button></>)}
            </div>
          </div>
          <div className="csTwoCol">
            <div className="csField"><label>{isIt?"Presenza mercati":"Market presence"}</label>
              <select className="csSelect" value={companyMarket} onChange={e=>setCompanyMarket(e.target.value as Market)}>
                <option value="italia">{isIt?"Solo Italia":"Italy only"}</option>
                <option value="europa">{isIt?"Europa":"Europe"}</option>
                <option value="mondo">{isIt?"Mondo":"Global"}</option>
              </select>
            </div>
            <div className="csField"><label>{isIt?"Settore":"Sector"}</label>
              <select className="csSelect" value={companySector} onChange={e=>handleSectorChange(e.target.value as SectorKey)}>
                {SECTOR_KEYS.map(sk=><option key={sk} value={sk}>{isIt?SECTORS[sk].label.it:SECTORS[sk].label.en}</option>)}
              </select>
            </div>
          </div>
          {/* Dimensioni economiche e persone */}
          <div className="csField">
            <label>{isIt?"Dimensioni organizzazione":"Organisation size"}</label>
            <div className="csDimsGrid">
              <div className="csDimRow"><input className="csDimInput csDimInputYear" type="number" min={2000} max={2100} value={revenueYear} onChange={e=>setRevenueYear(parseInt(e.target.value)||revenueYear)}/><span className="csDimUnit">{isIt?"anno":"year"}</span><input className="csDimInput" type="number" min={0} value={companyDims[0]===0?"":companyDims[0]} onChange={e=>updateCompanyDim(0,parseFloat(e.target.value))}/><span className="csDimUnit">{isIt?dimLabelRevenue.it:dimLabelRevenue.en}</span><input className="csDimInput" type="number" min={0} value={companyDims[4]===0?"":companyDims[4]} onChange={e=>updateCompanyDim(4,parseFloat(e.target.value))}/><span className="csDimUnit">{isIt?dimLabelEmployees.it:dimLabelEmployees.en}</span></div>
            </div>
          </div>
          {/* Tabella sedi */}
          <div className="csField">
            <div className="csSiteTotal">{isIt?"Totale sedi":"Total locations"}: <strong>{siteTotal===0?"—":siteTotal}</strong></div>
            <div className="csSiteTableWrap">
              {(()=>{
                const hasData=(g:SiteGeoKey)=>siteRowDefs.some(row=>(siteTable[row.key][g]??0)>0);
                const sortedCols=[...geoColKeys].sort((a,b)=>{
                  const aD=hasData(a)?0:1;
                  const bD=hasData(b)?0:1;
                  return aD-bD || geoColKeys.indexOf(a)-geoColKeys.indexOf(b);
                });
                return (
                  <table className="csSiteTable">
                    <thead>
                      <tr>
                        <th className="csSiteThRow">{isIt?"Tipo sede":"Site type"}</th>
                        {sortedCols.map(g=><th key={g} className={`csSiteThGeo${hasData(g)?"":" csSiteThGeoEmpty"}`}>{isIt?geoColLabels[g].it:geoColLabels[g].en}</th>)}
                      </tr>
                    </thead>
                    <tbody>
                      {siteRowDefs.map(row=>(
                        <tr key={row.key}>
                          <td className="csSiteRowLabel">{isIt?row.label.it:row.label.en}</td>
                          {sortedCols.map(g=>(
                            <td key={g} className="csSiteCell">
                              <input className="csSiteInput" type="number" min={0}
                                value={(siteTable[row.key][g]??0)===0?"":(siteTable[row.key][g]??0)}
                                onChange={e=>updateSiteCell(row.key,g,parseInt(e.target.value))}/>
                            </td>
                          ))}
                        </tr>
                      ))}
                    </tbody>
                  </table>
                );
              })()}
            </div>
          </div>
          <div className="csFourCol">
            <div className="csField"><label>{isIt?"Data workshop":"Workshop date"}</label><input className="csInput" type="date" value={workshopDate} onChange={e=>setWorkshopDate(e.target.value)}/></div>
            <div className="csField"><label>{isIt?"Nome autore":"Author name"}</label><input className="csInput" type="text" placeholder={isIt?"Es. Mario Rossi":"E.g. John Smith"} value={consultantName} onChange={e=>setConsultantName(e.target.value)}/></div>
            <div className="csField"><label>{isIt?"Ruolo":"Role"}</label><input className="csInput" type="text" placeholder={isIt?"Es. ESG Manager":"E.g. ESG Manager"} value={participantRole} onChange={e=>setParticipantRole(e.target.value)}/></div>
            <div className="csField"><label>Business Unit</label><input className="csInput" type="text" placeholder={isIt?"Es. Operations":"E.g. Operations"} value={businessUnit} onChange={e=>setBusinessUnit(e.target.value)}/></div>
          </div>
          <div style={{display:"flex",justifyContent:"flex-end",marginTop:"auto"}}>
            <button className="actionButton csConfirmBtn" onClick={()=>setScreen("company")}>{isIt?"Avanti":"Next"}<b>→</b></button>
          </div>
        </div>
      </div>
    </div>
  <div className="welcomeBlueBar" style={{background:"#39efb4"}}/></main>;
}

interface CompanyScreenProps extends CommonProps {
  companyName: string;
  companySector: SectorKey;
  companyMarket: Market;
  esgReadiness: EsgReadiness;
  companyDims: [number,number,number,number,number];
  updateCompanyDim: (i: number, v: number) => void;
  geoDistrib: Record<string,number>;
  siteTable: SiteTable;
  displayCompanyName: string;
  csrdConfirmStep: 0|1|2;
  setCsrdConfirmStep: (v: 0|1|2) => void;
  csrdPendingChoice: boolean;
  setCsrdPendingChoice: (v: boolean) => void;
  csrdNote: string;
  setCsrdNote: (v: string) => void;
  csrdNoteOpen: boolean;
  setCsrdNoteOpen: (v: boolean) => void;
  csrdNoteDraft: string;
  setCsrdNoteDraft: (v: string) => void;
  renderTrustBar: () => JSX.Element;
  t: Record<string,any>;
  name: string;
  companyLogo?: string;
  reportingPath: 0|1|2|3|4|5;
  setReportingPath: (v: 0|1|2|3|4|5) => void;
  questName: string;
  onSave: (name: string) => void;
  renderSaveBtn: (isIt: boolean) => JSX.Element;
  nextScreen?: string;
  showGeo?: boolean;
  frameworkChecks?: Record<string,{inUso:boolean,diInteresse:boolean}>;
  toggleFw?: (id:string,col:"inUso"|"diInteresse")=>void;
  fwOpen?: boolean;
  setFwOpen?: (v:boolean)=>void;
  rptOpen?: boolean;
  setRptOpen?: (v:boolean)=>void;
  sustainabilityReportSince?: number|"mai";
  setSustainabilityReportSince?: (v:number|"mai")=>void;
  setEsgReadiness?: (v: EsgReadiness) => void;
}

export function CompanyScreen({
  language, profile, setLanguage, setScreen, reset, renderTrustBar,
  companySector, companyMarket, esgReadiness, companyDims, updateCompanyDim,
  geoDistrib, siteTable, displayCompanyName,
  csrdConfirmStep, setCsrdConfirmStep, csrdPendingChoice, setCsrdPendingChoice,
  csrdNote, setCsrdNote, csrdNoteOpen, setCsrdNoteOpen, csrdNoteDraft, setCsrdNoteDraft,
  t, name, companyLogo, reportingPath, setReportingPath,
  questName, onSave, renderSaveBtn,
  nextScreen = "priorities",
  showGeo = false,
  frameworkChecks,
  toggleFw,
  fwOpen: fwOpenProp = false,
  setFwOpen: setFwOpenProp,
  rptOpen: rptOpenProp = false,
  setRptOpen: setRptOpenProp,
  sustainabilityReportSince = 2024,
  setSustainabilityReportSince,
  setEsgReadiness,
}: CompanyScreenProps) {
  const isIt = language === "it";
  const sec = SECTORS[companySector];
  const readinessList = isIt ? ESG_READINESS_IT : ESG_READINESS_EN;
  const activeReadiness = readinessList.find(r => r.key === esgReadiness)!;
  const sectorLabel = isIt ? sec.label.it : sec.label.en;
  const dimVal = companyDims[0]; const peopleVal = companyDims[4];
  const dimUnit = isIt ? sec.dimUnit.it : sec.dimUnit.en;
  const isMld = sec.dimUnit.it.includes("mld");
  const revenueM = isMld ? dimVal * 1000 : dimVal;
  const csrdAlert = revenueM >= 450 && peopleVal >= 1000;
  const totalSedi = Object.values(geoDistrib).reduce((s,v)=>s+v,0);
  const sediUnit = isIt ? "sedi totali" : "total locations";
  const pepUnit = isIt ? "dipendenti" : "employees";
  const companyStoryLine1 = isIt
    ? `Un ${sectorLabel.toLowerCase()} da ${dimVal} ${dimUnit}, con ${totalSedi} sedi nel mondo e ${peopleVal.toLocaleString()} dipendenti.`
    : `A ${sectorLabel.toLowerCase()} with ${dimVal} ${dimUnit}, ${totalSedi} locations worldwide and ${peopleVal.toLocaleString()} employees.`;
  const companyStoryLine2 = isIt
    ? `Indicativamente ${csrdAlert?"soggetta":"non soggetta"} a CSRD (dipendenti ${csrdAlert?">":"<"} 1.000 e fatturato ${csrdAlert?">":"<"} €450M).`
    : `Indicatively ${csrdAlert?"subject to":"not subject to"} CSRD (employees ${csrdAlert?">":"<"} 1,000 and revenue ${csrdAlert?">":"<"} €450M).`;
  const companyStoryGen = companyStoryLine1;
  const evolvingGen = `${displayCompanyName} — ${activeReadiness.desc}`;
  // Posizioni anchor per area geografica sulla mappa (left/top %)
  type MapGeoKey = "italia"|"europa"|"nordamerica"|"sudamerica"|"asia"|"africa"|"australia";
  // left = (lon+180)/360*100, top = (90-lat)/180*100  — proiezione equirettangolare
  const GEO_POS: Record<MapGeoKey,{left:string,top:string}> = {
    italia:     {left:"49%", top:"37%"},  // pixel ~870,330
    europa:     {left:"49%", top:"22%"},  // lon=-4, lat=50
    nordamerica:{left:"22%", top:"28%"},  // lon=-100, lat=40
    sudamerica: {left:"18%", top:"67%"},  // pixel ~310,590
    asia:       {left:"75%", top:"31%"},  // lon=90, lat=35
    africa:     {left:"56%", top:"47%"},  // lon=20, lat=5
    australia:  {left:"87%", top:"64%"},  // lon=135, lat=-25
  };
  const SITE_ROWS: (keyof typeof siteTable)[] = ["uffici","ops","datacenter","altro"];
  // Colori e path SVG per tipo sede
  const SITE_ICONS: Record<string,{color:string,path:string}> = {
    uffici:     {color:"#7ab8d8", path:"M2,12 L2,20 L8,20 L8,14 L12,14 L12,20 L18,20 L18,12 L10,4 Z M4,8 L10,2 L16,8"},
    ops:        {color:"#72c4a0", path:"M1,19 L19,19 M3,19 L3,10 L17,10 L17,19 M7,19 L7,14 L13,14 L13,19 M1,10 L10,3 L19,10"},
    datacenter: {color:"#b08adc", path:"M2,4 L18,4 L18,8 L2,8 Z M2,10 L18,10 L18,14 L2,14 Z M2,16 L18,16 L18,20 L2,20 Z M15,6 L15,6.5 M15,12 L15,12.5 M15,18 L15,18.5"},
    altro:      {color:"#e8a84a", path:"M10,2 C6.13,2 3,5.13 3,9 C3,14.25 10,22 10,22 C10,22 17,14.25 17,9 C17,5.13 13.87,2 10,2 Z M10,11.5 C8.62,11.5 7.5,10.38 7.5,9 C7.5,7.62 8.62,6.5 10,6.5 C11.38,6.5 12.5,7.62 12.5,9 C12.5,10.38 11.38,11.5 10,11.5 Z"},
  };
  // fwOpen e rptOpen sollevati ad App per evitare reset al re-render causato da toggleFw
  const [rptOpenLocal,setRptOpenLocal]=useState(false);
  const [fwOpenLocal,setFwOpenLocal]=useState(false);
  const fwOpen = setFwOpenProp ? fwOpenProp : fwOpenLocal;
  const setFwOpen = setFwOpenProp ?? setFwOpenLocal;
  const rptOpen = setRptOpenProp ? rptOpenProp : rptOpenLocal;
  const setRptOpen = setRptOpenProp ?? setRptOpenLocal;
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
  const [copiedField,setCopiedField]=useState<string|null>(null);
  const copyField=(fieldName:string,value:string)=>{if(!value)return;navigator.clipboard.writeText(value).then(()=>{setCopiedField(fieldName);setTimeout(()=>setCopiedField(null),1500);});};
  const CopyChip=({fieldName,value,children}:{fieldName:string,value:string,children:React.ReactNode})=>{
    const copied=copiedField===fieldName;
    return <div style={{position:"relative",cursor:"copy"}} title={fieldName} onClick={()=>copyField(fieldName,value)}>
      {children}
      <span style={{position:"absolute",bottom:"calc(100% + 6px)",left:"50%",transform:"translateX(-50%)",background:copied?"#0e2e22":"#1a3328",color:copied?"#72f7ca":"#39efb4",font:"700 10px var(--font-geist-mono,monospace)",letterSpacing:".1em",padding:"3px 8px",borderRadius:"5px",border:"1px solid rgba(57,239,180,.3)",whiteSpace:"nowrap",pointerEvents:"none",opacity:0,transition:"opacity .12s",zIndex:50}} className="csFieldTooltip">
        {copied?(isIt?"copiato ✓":"copied ✓"):fieldName}
      </span>
    </div>;
  };
  // Copertura Envizi per framework
  type FwCov = {level:"alto"|"medio"|"limitato"; it:string; en:string};
  const FW_ENVIZI_COV: Record<string,FwCov> = {
    ghg:        {level:"alto",    it:"Calcolo Scope 1, 2 e principali categorie Scope 3 con fattori gestiti centralmente.",                         en:"Scope 1, 2 and key Scope 3 categories with centrally managed emission factors."},
    tcfd:       {level:"medio",   it:"Supporta la raccolta di dati climatici e la disclosure. Framework ampiamente adottato in passato; le sue raccomandazioni sono oggi incorporate in IFRS S1 e S2.", en:"Supports climate data collection and disclosure. Widely adopted in the past; its recommendations are now incorporated into IFRS S1 and S2."},
    cdp:        {level:"medio",   it:"Facilita la preparazione dei dati richiesti dal questionario CDP; la compilazione e l'invio restano manuali.",    en:"Helps prepare data for the CDP questionnaire; submission remains a manual step."},
    gri:        {level:"alto",    it:"Raccolta e aggregazione dei principali indicatori GRI con tracciabilità dalla fonte.",                            en:"Collection and aggregation of key GRI indicators with source traceability."},
    sasb:       {level:"medio",   it:"Supporta la raccolta degli indicatori settoriali SASB; la mappatura ai topic standard è a carico dell'utente.",   en:"Supports collection of SASB sector indicators; mapping to standard topics is the user's responsibility."},
    sdg:        {level:"limitato",it:"Può fornire dati di base utili al reporting SDG, ma non offre una mappatura strutturata agli obiettivi ONU.",     en:"Can provide basic data useful for SDG reporting, but does not offer structured mapping to UN goals."},
    ifrs_s1:    {level:"medio",   it:"Supporta la raccolta di dati su rischi e opportunità ESG richiesti da IFRS S1; la narrativa resta all'azienda.", en:"Supports collection of ESG risk and opportunity data required by IFRS S1; narrative disclosure remains with the organisation."},
    ifrs_s2:    {level:"medio",   it:"Facilita la raccolta di metriche climatiche allineate a IFRS S2; l'analisi degli scenari è esterna al sistema.", en:"Facilitates collection of climate metrics aligned with IFRS S2; scenario analysis sits outside the system."},
    sfdr:       {level:"limitato",it:"Può fornire dati ambientali e sociali utili agli indicatori PAI; la struttura SFDR richiede integrazione esterna.",en:"Can supply environmental and social data useful for PAI indicators; SFDR structure requires external integration."},
    gresb:      {level:"medio",   it:"Supporta la raccolta di dati energetici e di emissione per immobili e infrastrutture richiesti da GRESB.",        en:"Supports collection of energy and emission data for real estate and infrastructure assets required by GRESB."},
    secr:       {level:"alto",    it:"Calcolo e reportistica di energia e carbonio per le entità soggette al regime SECR nel Regno Unito.",             en:"Energy and carbon calculation and reporting for entities subject to the UK SECR regime."},
    energystar: {level:"medio",   it:"Raccolta e aggregazione dei dati energetici necessari; la certificazione ENERGY STAR avviene tramite EPA Portfolio Manager.", en:"Collection and aggregation of required energy data; ENERGY STAR certification occurs via EPA Portfolio Manager."},
    nabers:     {level:"medio",   it:"Supporta la raccolta dei dati energetici per gli edifici; la valutazione NABERS è effettuata da un assessor esterno.", en:"Supports energy data collection for buildings; NABERS rating is carried out by an external assessor."},
  };

  // Dati dei modal — definiti qui (scope componente) perché i modal sono figli diretti del <main>
  type RptPath = {num:1|2|3|4|5;label:{it:string;en:string};desc:{it:string;en:string};for:{it:string;en:string}};
  const rptPaths:RptPath[]=[
    {num:1,label:{it:"Standard VSME",en:"VSME Standard"},desc:{it:"Rendicontazione volontaria semplificata con dati ESG essenziali e moduli progressivi. Costi e complessità contenuti.",en:"Simplified voluntary reporting with essential ESG data and progressive modules. Contained costs and complexity."},for:{it:"L'azienda è una PMI che intende rispondere alle richieste di banche, clienti e imprese capofiliera.",en:"The company is an SME seeking to respond to requests from banks, clients and lead firms in the supply chain."}},
    {num:2,label:{it:'Report volontario "CSRD-aligned"',en:'"CSRD-aligned" voluntary report'},desc:{it:"Selezione degli ESRS rilevanti, doppia materialità semplificata e indicazione trasparente delle parti non applicate.",en:"Selection of relevant ESRS, simplified double materiality and transparent disclosure of parts not applied."},for:{it:"L'azienda è un'impresa medio-grande, un fornitore strategico, un'organizzazione in crescita che intende avvicinarsi gradualmente ai requisiti CSRD.",en:"The company is a mid-large enterprise, a strategic supplier or a growing organisation aiming to gradually align with CSRD requirements."}},
    {num:3,label:{it:"Adozione integrale volontaria di CSRD/ESRS",en:"Full voluntary adoption of CSRD/ESRS"},desc:{it:"Applicazione completa degli ESRS, doppia materialità, catena del valore, controlli interni ed eventuale assurance volontaria.",en:"Full application of ESRS, double materiality, value chain, internal controls and optional voluntary assurance."},for:{it:"L'azienda non è ancora soggetta alla CSRD, ma è vicina alle soglie, valuta una quotazione o riceve rilevanti richieste ESG dagli stakeholder.",en:"The company is not yet subject to CSRD but is close to the thresholds, considering a listing, or receiving significant ESG requests from stakeholders."}},
    {num:4,label:{it:"CSRD obbligatoria",en:"Mandatory CSRD"},desc:{it:"Rendicontazione conforme alla normativa, inclusa nella relazione sulla gestione, redatta secondo gli ESRS applicabili e sottoposta a limited assurance.",en:"Regulatory-compliant reporting, included in the management report, prepared under applicable ESRS and subject to limited assurance."},for:{it:"L'organizzazione supera le soglie previste dalla normativa ed è pertanto soggetta agli obblighi della CSRD.",en:"The company or group exceeds the regulatory thresholds and is therefore subject to CSRD obligations."}},
    {num:5,label:{it:"Rendicontazione libera",en:"Free-form reporting"},desc:{it:"Rendicontazione volontaria definita autonomamente dall'azienda, senza adottare integralmente VSME, ESRS o CSRD. Contenuti, indicatori, periodicità e formato sono scelti in funzione degli obiettivi aziendali.",en:"Voluntary reporting defined autonomously by the company, without fully adopting VSME, ESRS or CSRD. Contents, indicators, frequency and format are chosen based on company objectives."},for:{it:"L'azienda intende comunicare liberamente le proprie iniziative e prestazioni di sostenibilità.",en:"The company does not fall within the previous options and intends to freely communicate its sustainability initiatives and performance."}},
  ];
  type FwRow = {id:string;label:string;area:string;legacy?:boolean};
  const fwGroups:{cat:{it:string;en:string};rows:FwRow[]}[]=[
    {cat:{it:"GHG & Clima",en:"GHG & Climate"},rows:[
      {id:"ghg",   label:"GHG Protocol – Scope 1, 2, 3",area:isIt?"Globale":"Global"},
      {id:"tcfd",  label:"TCFD",                         area:isIt?"Globale":"Global", legacy:true},
      {id:"cdp",   label:"CDP",                          area:isIt?"Globale":"Global"},
    ]},
    {cat:{it:"Standard internazionali e framework volontari o adottati dalle giurisdizioni",en:"International standards and voluntary or jurisdiction-adopted frameworks"},rows:[
      {id:"gri",     label:"GRI Standards",                   area:isIt?"Globale":"Global"},
      {id:"sasb",    label:"SASB Standards",                   area:isIt?"Globale":"Global"},
      {id:"sdg",     label:"UN Sustainable Development Goals", area:isIt?"Globale":"Global"},
      {id:"ifrs_s1", label:"IFRS S1",                          area:isIt?"Globale":"Global"},
      {id:"ifrs_s2", label:"IFRS S2",                          area:isIt?"Globale":"Global"},
    ]},
    {cat:{it:"Finanza & Mercati",en:"Finance & Markets"},rows:[
      {id:"sfdr",  label:"SFDR",  area:isIt?"UE – Servizi finanziari":"EU – Financial services"},
      {id:"gresb", label:"GRESB", area:isIt?"Globale – Real estate e infrastrutture":"Global – Real estate & infrastructure"},
    ]},
    {cat:{it:"Regionali & Settoriali",en:"Regional & Sector"},rows:[
      {id:"secr",       label:"SECR",        area:isIt?"Regno Unito":"United Kingdom"},
      {id:"energystar", label:"ENERGY STAR", area:isIt?"Nord America":"North America"},
      {id:"nabers",     label:"NABERS",      area:isIt?"Australia":"Australia"},
    ]},
  ];
  return <main className="companyScreen">
  {zoomWarnOpen&&<div style={{position:"absolute",inset:0,zIndex:9999,background:"rgba(7,18,15,.82)",display:"flex",alignItems:"center",justifyContent:"center"}} onClick={()=>setZoomWarnOpen(false)}>
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
    <header className="missionNav missionNavTrust"><button className="brand brandButton" onClick={reset}><span className="brandMark">e·</span><span>Envizi<br/>Impact Quest</span></button><div className="missionProgress"><span className="activeDot"/> COMPANY PROFILE</div>{renderTrustBar()}<div style={{display:"flex",alignItems:"center",gap:"8px",marginRight:"8px"}}><img src={`./characters/${profile}-neutral.png`} alt={name} style={{width:"36px",height:"36px",borderRadius:"50%",objectFit:"cover",border:"2px solid rgba(57,239,180,.35)",flexShrink:0}}/><div style={{display:"flex",flexDirection:"column",lineHeight:1.2}}><small style={{font:"700 8px var(--font-geist-mono,monospace)",letterSpacing:".12em",textTransform:"uppercase",color:"#39efb4"}}>ESG MANAGER</small><strong style={{fontSize:"12px",color:"#f2fff9",fontWeight:700}}>{name}</strong></div></div><button className="langMini" onClick={()=>setLanguage(language==="it"?"en":"it")}>{language==="it"?"EN":"IT"}</button></header>
    {showGeo ? (
    <section className="geoMapsSection" style={{position:"relative",flex:1,minHeight:0}} aria-label={`${displayCompanyName} footprint`}>
      {(()=>{
        type GeoMeta = {currency:string; energy:string; volume:string; mass:string; system:string};
        const GEO_META: Record<SiteGeoKey, GeoMeta> = {
          italia:      {currency:"EUR",          energy:"kWh",  volume:"m³ / L",   mass:"kg / t",     system:"SI"},
          europa:      {currency:"EUR / locale", energy:"kWh",  volume:"m³ / L",   mass:"kg / t",     system:"SI"},
          uk:          {currency:"GBP",          energy:"kWh",  volume:"ft³ / gal",mass:"lb / ton",   system:"Imperial"},
          nordamerica: {currency:"USD / CAD",    energy:"kWh",  volume:"ft³ / gal",mass:"lb / ton",   system:"Imperial"},
          sudamerica:  {currency:"BRL / ARS / locale", energy:"kWh", volume:"m³ / L", mass:"kg / t", system:"SI"},
          asia:        {currency:"CNY / JPY / locale", energy:"kWh", volume:"m³ / L", mass:"kg / t", system:"SI"},
          africa:      {currency:"ZAR / NGN / locale", energy:"kWh", volume:"m³ / L", mass:"kg / t", system:"SI"},
          australia:   {currency:"AUD / NZD",    energy:"kWh",  volume:"m³ / L",   mass:"kg / t",     system:"SI"},
        };
        const GEO_KEYS: SiteGeoKey[] = ["italia","europa","uk","nordamerica","sudamerica","asia","africa","australia"];
        const GEO_LABELS: Record<SiteGeoKey,{it:string,en:string}> = {
          italia:{it:"Italia",en:"Italy"},europa:{it:"Europa",en:"Europe"},uk:{it:"UK",en:"UK"},
          nordamerica:{it:"Nord America",en:"North America"},sudamerica:{it:"Sud America",en:"South America"},
          asia:{it:"Asia",en:"Asia"},africa:{it:"Africa",en:"Africa"},australia:{it:"Australia",en:"Australia"},
        };
        const GEO_IMGS: Record<SiteGeoKey,string> = {
          italia:"./mappe/italia.png",europa:"./mappe/europa.png",uk:"./mappe/uk.png",
          nordamerica:"./mappe/nordamerica.png",sudamerica:"./mappe/sudamerica.png",
          asia:"./mappe/asia.png",africa:"./mappe/africa.png",australia:"./mappe/australia.png",
        };
        const opsLabelIt = sec.opsUnit.it.charAt(0).toUpperCase()+sec.opsUnit.it.slice(1);
        const opsLabelEn = sec.opsUnit.en.charAt(0).toUpperCase()+sec.opsUnit.en.slice(1);
        const siteRowDefs2:{key:SiteRowKey,label:{it:string,en:string},color:string}[] = [
          {key:"uffici",    label:{it:"Uffici",en:"Offices"},            color:"#7ab8d8"},
          {key:"ops",       label:{it:opsLabelIt,en:opsLabelEn},         color:"#72c4a0"},
          {key:"datacenter",label:{it:"Data center",en:"Data centres"},  color:"#b08adc"},
          {key:"altro",     label:{it:"Altro",en:"Other"},               color:"#e8a84a"},
        ];
        const GEO_ICON_PATH: Record<SiteRowKey, JSX.Element> = {
          uffici: (<svg viewBox="0 0 20 20" width="18" height="18"><rect x="3" y="7" width="14" height="11" fill="currentColor" opacity=".25" rx="1"/><rect x="3" y="7" width="14" height="11" fill="none" stroke="currentColor" strokeWidth="1.4" rx="1"/><polygon points="1,8 10,1 19,8" fill="none" stroke="currentColor" strokeWidth="1.4" strokeLinejoin="round"/><rect x="8" y="12" width="4" height="6" fill="currentColor" opacity=".5"/><rect x="4.5" y="9.5" width="3" height="2.5" fill="currentColor" opacity=".6" rx=".3"/><rect x="12.5" y="9.5" width="3" height="2.5" fill="currentColor" opacity=".6" rx=".3"/></svg>),
          ops:    (<svg viewBox="0 0 20 20" width="18" height="18"><rect x="2" y="9" width="16" height="9" fill="currentColor" opacity=".2" rx="1"/><rect x="2" y="9" width="16" height="9" fill="none" stroke="currentColor" strokeWidth="1.4" rx="1"/><path d="M2,9 L10,3 L18,9" fill="none" stroke="currentColor" strokeWidth="1.4" strokeLinejoin="round"/><rect x="4" y="12" width="3.5" height="6" fill="currentColor" opacity=".5" rx=".5"/><rect x="12.5" y="12" width="3.5" height="6" fill="currentColor" opacity=".5" rx=".5"/><rect x="8.5" y="4" width="3" height="2" fill="currentColor" opacity=".5" rx=".3"/><rect x="14" y="6" width="2" height="4" fill="currentColor" opacity=".6" rx=".3"/></svg>),
          datacenter: (<svg viewBox="0 0 20 20" width="18" height="18"><rect x="3" y="2" width="14" height="16" fill="currentColor" opacity=".15" rx="1.5"/><rect x="3" y="2" width="14" height="16" fill="none" stroke="currentColor" strokeWidth="1.4" rx="1.5"/><rect x="4.5" y="4" width="11" height="3" fill="currentColor" opacity=".35" rx=".5"/><rect x="4.5" y="8.5" width="11" height="3" fill="currentColor" opacity=".35" rx=".5"/><rect x="4.5" y="13" width="11" height="3" fill="currentColor" opacity=".35" rx=".5"/><circle cx="14" cy="5.5" r="1" fill="currentColor" opacity=".8"/><circle cx="14" cy="10" r="1" fill="currentColor" opacity=".8"/><circle cx="14" cy="14.5" r="1" fill="currentColor" opacity=".8"/></svg>),
          altro:  (<svg viewBox="0 0 20 20" width="18" height="18"><path d="M10,2 C6.69,2 4,4.69 4,8 C4,12.5 10,18 10,18 C10,18 16,12.5 16,8 C16,4.69 13.31,2 10,2 Z" fill="currentColor" opacity=".25"/><path d="M10,2 C6.69,2 4,4.69 4,8 C4,12.5 10,18 10,18 C10,18 16,12.5 16,8 C16,4.69 13.31,2 10,2 Z" fill="none" stroke="currentColor" strokeWidth="1.4"/><circle cx="10" cy="8" r="2.5" fill="currentColor" opacity=".7"/></svg>),
        };
        const hasAnySedes = GEO_KEYS.some(g=>(["uffici","ops","datacenter","altro"] as SiteRowKey[]).some(r=>(siteTable[r][g]??0)>0));
        const extraGeos = GEO_KEYS.slice(4).filter(g=>(["uffici","ops","datacenter","altro"] as SiteRowKey[]).some(r=>(siteTable[r][g]??0)>0));
        const visibleGeos = [...GEO_KEYS.slice(0,4), ...extraGeos];
        const activePop = GEO_KEYS.filter(g=>(["uffici","ops","datacenter","altro"] as SiteRowKey[]).some(r=>(siteTable[r][g]??0)>0));
        const diffUnits = activePop.filter(g=>GEO_META[g].system !== "SI");
        const diffCurr  = activePop.filter(g=>!GEO_META[g].currency.startsWith("EUR"));
        const diffTotal = new Set([...diffUnits,...diffCurr]).size;
        const complexity = diffTotal === 0 ? null : diffTotal <= 1 ? "low" : diffTotal <= 3 ? "medium" : "high";
        const complexLabel:{[k:string]:{it:string,en:string,color:string}} = {
          low:    {it:"bassa",   en:"low",    color:"#39efb4"},
          medium: {it:"media",   en:"medium", color:"#ffc07c"},
          high:   {it:"alta",    en:"high",   color:"#ff7777"},
        };
        return (
          <>
          <div className="geoMapsHeader">
            <div style={{display:"flex",alignItems:"center",gap:"14px",minWidth:0}}>
              <h1 className="geoMapsTitle">
                {isIt
                  ? <>{`Introduzione alla strategia ESG di `}<span className="geoMapsTitleName">{displayCompanyName}</span></>
                  : <>{`Introduction to `}<span className="geoMapsTitleName">{displayCompanyName}</span>{`'s ESG strategy`}</>
                }
              </h1>
              {companyLogo && <img src={companyLogo} alt="logo" style={{height:"40px",maxWidth:"120px",objectFit:"contain",borderRadius:"6px",border:"1px solid #d0e8d8",background:"#fff",padding:"3px",flexShrink:0}}/>}
            </div>
            {complexity && (
              <div className="geoMapsComplexBadge" style={{borderColor:complexLabel[complexity].color,color:complexLabel[complexity].color}}>
                <span className="geoMapsComplexBadgeLabel">{isIt?"Complessità mercati":"Market complexity"}</span>
                <strong>{isIt?complexLabel[complexity].it:complexLabel[complexity].en}</strong>
              </div>
            )}
          </div>
          <div className="geoMapsWithPanel">
          <div style={{display:"flex",flexDirection:"column",gap:"14px",flex:1,minWidth:0,overflow:"hidden"}}>
            <div className="geoMapsGrid">
              {visibleGeos.map(g=>{
                const activeRows = siteRowDefs2.filter(d=>(siteTable[d.key][g]??0)>0);
                return (
                  <div key={g} className="geoMapCard">
                    <div className="geoMapImgWrap" style={{position:"relative"}}>
                      <img className="geoMapSvg" src={GEO_IMGS[g]} alt={GEO_LABELS[g].it}/>
                      <div style={{position:"absolute",inset:0,display:"flex",alignItems:"center",justifyContent:"flex-start",padding:"0 0 0 6px",pointerEvents:"none"}}>
                        <div style={{display:"flex",flexDirection:"column",gap:"3px",background:"rgba(7,17,14,.72)",borderRadius:"8px",padding:"5px 5px",border:"1px solid rgba(255,255,255,.12)",boxShadow:"0 2px 10px rgba(0,0,0,.5)"}}>
                          {activeRows.map(d=>(
                            <div key={d.key} style={{display:"flex",flexDirection:"row",alignItems:"center",gap:"4px",color:d.color}}>
                              {GEO_ICON_PATH[d.key]}
                              <span style={{fontSize:"11px",fontWeight:700,lineHeight:1,fontFamily:"var(--font-geist-mono,monospace)",letterSpacing:".04em",minWidth:"12px"}}>{siteTable[d.key][g]}</span>
                            </div>
                          ))}
                        </div>
                      </div>
                    </div>
                    <div className="geoMapLabel">{isIt?GEO_LABELS[g].it:GEO_LABELS[g].en}</div>
                    <div className="geoMapIcons">{siteRowDefs2.map(d=>{
                      const val=siteTable[d.key][g]??0;
                      return <span key={d.key} className="geoMapIconChip" style={{borderColor:d.color,color:d.color,opacity:val===0?0.35:1}}>{isIt?d.label.it:d.label.en} · {val}</span>;
                    })}</div>
                    <div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:"3px 6px",marginTop:"4px"}}>
                      {[
                        {label:isIt?"Valuta":"Currency",   value:GEO_META[g].currency,  color:"#f5c855"},
                        {label:isIt?"Energia":"Energy",    value:GEO_META[g].energy,    color:"#7dd3fc"},
                        {label:isIt?"Volume":"Volume",     value:GEO_META[g].volume,    color:"#86efac"},
                        {label:isIt?"Massa":"Mass",        value:GEO_META[g].mass,      color:"#c4b5fd"},
                        {label:isIt?"Sistema":"System",    value:GEO_META[g].system,    color:GEO_META[g].system==="SI"?"#39efb4":"#fca5a5"},
                      ].map(({label,value,color})=>(
                        <div key={label} style={{background:"rgba(0,0,0,.18)",borderRadius:"5px",padding:"3px 6px",borderLeft:`2px solid ${color}`}}>
                          <div style={{fontSize:"9px",fontWeight:700,color:"#6a9a88",letterSpacing:".08em",textTransform:"uppercase",lineHeight:1.2}}>{label}</div>
                          <div style={{fontSize:"11px",fontWeight:600,color,lineHeight:1.3,whiteSpace:"nowrap",overflow:"hidden",textOverflow:"ellipsis"}}>{value}</div>
                        </div>
                      ))}
                    </div>
                  </div>
                );
              })}
            </div>
            {complexity&&<div className="geoComplexTextCard" style={{display:"flex",flexDirection:"column",gap:"8px",padding:"10px 16px",border:"1px solid rgba(57,239,180,.15)",borderRadius:"12px",background:"rgba(57,239,180,.04)"}}>
              <div className="geoMapIcons" style={{flexWrap:"nowrap",whiteSpace:"nowrap"}}>{siteRowDefs2.map(d=>{
                const tot=(["italia","europa","uk","nordamerica","sudamerica","asia","africa","australia"] as SiteGeoKey[]).reduce((s,g)=>s+(siteTable[d.key][g]??0),0);
                if(tot===0) return null;
                return <span key={d.key} className="geoMapIconChip" style={{borderColor:d.color,color:d.color,flexShrink:0}}>{isIt?d.label.it:d.label.en} · {tot}</span>;
              })}</div>
              <p className="geoComplexText" style={{whiteSpace:"nowrap",margin:0}}>
                {isIt
                  ? <>{displayCompanyName} ha la necessità di convertire <strong>unità di misura</strong> e <strong>valute</strong> nel proprio reporting ESG, con un livello di complessità <span style={{color:complexLabel[complexity].color,fontWeight:700}}>{complexLabel[complexity].it}</span>.</>
                  : <>{displayCompanyName} needs to convert <strong>measurement units</strong> and <strong>currencies</strong> in its ESG reporting, with a <span style={{color:complexLabel[complexity].color,fontWeight:700}}>{complexLabel[complexity].en}</span> level of complexity.</>
                }
              </p>
              <p style={{margin:0,fontSize:"clamp(10px,0.85vw,12px)",color:"#7a9a90",lineHeight:1.5,borderTop:"1px solid rgba(57,239,180,.1)",paddingTop:"8px"}}>
                {isIt
                  ? <>⚠ <strong style={{color:"#b5c9c1"}}>Normalizzazione richiesta.</strong> Sistemi Imperial e locali richiedono conversione in SI prima dell'aggregazione. Valute non-EUR richiedono tassi di cambio storici per il confronto. Envizi gestisce automaticamente conversioni di unità, tassi di cambio e normalizzazione per intensità.</>
                  : <>⚠ <strong style={{color:"#b5c9c1"}}>Normalisation required.</strong> Imperial and local systems must be converted to SI before aggregation. Non-EUR currencies require historical exchange rates for comparison. Envizi automatically handles unit conversions, exchange rates and intensity normalisation.</>
                }
              </p>
            </div>}
          </div>{/* end left column */}
            <div className="geoComplexPanel">
              {!hasAnySedes ? (
                <p className="geoComplexEmpty">{isIt?"Inserisci sedi per vedere l'analisi di complessità.":"Add locations to see complexity analysis."}</p>
              ) : complexity === null ? (
                <p className="geoComplexEmpty">{isIt?"Tutte le sedi sono nell'area Euro — nessuna conversione necessaria.":"All locations are in the Euro area — no conversion needed."}</p>
              ) : (
                <>
                  <div className="geoComplexBadge" style={{borderColor:complexLabel[complexity].color,color:complexLabel[complexity].color}}>
                    {isIt?"Complessità":"Complexity"}: <strong>{isIt?complexLabel[complexity].it:complexLabel[complexity].en}</strong>
                  </div>
                  <div className="geoComplexDetail">
                    {diffUnits.length>0&&<span>{isIt?"Unità diverse":"Different units"}: {diffUnits.map(g=>GEO_LABELS[g][isIt?"it":"en"]).join(", ")}</span>}
                    {diffCurr.length>0&&<span>{isIt?"Valute diverse":"Different currencies"}: {diffCurr.map(g=>GEO_LABELS[g][isIt?"it":"en"]).join(", ")}</span>}
                  </div>
                </>
              )}
              <button className="actionButton" style={{marginTop:"16px",width:"auto",alignSelf:"flex-end"}} onClick={()=>setScreen(nextScreen as any)}>{t.explore}<b>→</b></button>
            </div>
          </div>
          </>
        );
      })()}
      <div className="geoMapLegend">
        {(()=>{
          const GEO_KEYS: SiteGeoKey[] = ["italia","europa","uk","nordamerica","sudamerica","asia","africa","australia"];
          const opsLabelIt2 = sec.opsUnit.it.charAt(0).toUpperCase()+sec.opsUnit.it.slice(1);
          const opsLabelEn2 = sec.opsUnit.en.charAt(0).toUpperCase()+sec.opsUnit.en.slice(1);
          return [
            {key:"uffici"    as SiteRowKey, label:{it:"Uffici",en:"Offices"},          color:"#7ab8d8"},
            {key:"ops"       as SiteRowKey, label:{it:opsLabelIt2,en:opsLabelEn2},     color:"#72c4a0"},
            {key:"datacenter"as SiteRowKey, label:{it:"Data center",en:"Data centres"},color:"#b08adc"},
            {key:"altro"     as SiteRowKey, label:{it:"Altro",en:"Other"},             color:"#e8a84a"},
          ].filter(d=>GEO_KEYS.some(g=>(siteTable[d.key][g]??0)>0))
          .map(d=>(
            <span key={d.key} className="geoMapLegendItem" style={{color:d.color}}>
              <svg width={12} height={12} viewBox="0 0 12 12" style={{flexShrink:0}}><circle cx={6} cy={6} r={5} fill={d.color} opacity={.25}/><circle cx={6} cy={6} r={5} fill="none" stroke={d.color} strokeWidth={1.2}/></svg>
              {isIt?d.label.it:d.label.en}
            </span>
          ));
        })()}
      </div>
    </section>
    ) : (
    <section className="companyCopy">
      <div style={{display:"flex",alignItems:"center",gap:"14px",marginBottom:"8px"}}>
        <h1 style={{margin:0,flex:1,minWidth:0}}>{isIt?`Introduzione alla strategia ESG di ${displayCompanyName}`:`Introduction to ${displayCompanyName}'s ESG strategy`}</h1>
        {companyLogo && <img src={companyLogo} alt="logo" style={{height:"48px",maxWidth:"140px",objectFit:"contain",borderRadius:"6px",border:"1px solid #d0e8d8",background:"#fff",padding:"4px",flexShrink:0}}/>}
      </div>
      <div className="priorityPersona">
        <img src={`./characters/${profile}-neutral.png`} alt={name}/>
        <div><strong>{name}</strong><small>ESG MANAGER</small></div>
      </div>
      <p className="companyLead" style={{margin:"1.5vh 0 0"}}>{companyStoryLine1}</p>
      <p className="companyLead" style={{margin:"4px 0 4px",color:csrdAlert?"#f5c855":"#7ab3a5"}}>{companyStoryLine2}</p>
      <p style={{margin:"0 0 1.5vh",fontSize:"clamp(10px,0.9vw,13px)",color:"#5a8a78",lineHeight:1.4}}>
        {isIt
          ? <>⚠ Pre-screening indicativo — la valutazione definitiva dipende da struttura di gruppo, localizzazione delle entità e recepimento nazionale della direttiva.{" "}
              <a href="https://www.consilium.europa.eu/en/press/press-releases/2026/02/24/council-signs-off-simplification-of-sustainability-reporting-and-due-diligence-requirements-to-boost-eu-competitiveness/" target="_blank" rel="noopener noreferrer" style={{color:"#7dd3fc",textDecoration:"underline"}}>Consiglio dell'UE</a></>
          : <>⚠ Indicative pre-screening — the final assessment depends on group structure, entity location and national transposition of the directive.{" "}
              <a href="https://www.consilium.europa.eu/en/press/press-releases/2026/02/24/council-signs-off-simplification-of-sustainability-reporting-and-due-diligence-requirements-to-boost-eu-competitiveness/" target="_blank" rel="noopener noreferrer" style={{color:"#7dd3fc",textDecoration:"underline"}}>EU Council</a></>
        }
      </p>
      {setSustainabilityReportSince&&<div className="srRow">
        <span className="srSentence">
          {sustainabilityReportSince==="mai"
            ? (isIt?<>{displayCompanyName} <strong>non ha pubblicato</strong> un bilancio di sostenibilità.{" "}<button className={`srMaiBtn srMaiBtnOn`} onClick={()=>setSustainabilityReportSince(2024)}>Mai</button></>:<>{displayCompanyName} has <strong>not published</strong> a sustainability report.{" "}<button className={`srMaiBtn srMaiBtnOn`} onClick={()=>setSustainabilityReportSince(2024)}>Never</button></>)
            : (isIt
                ? <>{displayCompanyName} redige il bilancio di sostenibilità dall'anno{" "}<span className="srInlineYear"><button className="srBtn" onClick={()=>setSustainabilityReportSince(sustainabilityReportSince-1)}>▼</button><strong>{sustainabilityReportSince}</strong><button className="srBtn" onClick={()=>setSustainabilityReportSince(sustainabilityReportSince+1)}>▲</button><button className={`srMaiBtn${sustainabilityReportSince==="mai"?" srMaiBtnOn":""}`} onClick={()=>setSustainabilityReportSince(sustainabilityReportSince==="mai"?2024:"mai")}>{isIt?"Mai":"Never"}</button></span>.</>
                : <>{displayCompanyName} has been publishing a sustainability report since{" "}<span className="srInlineYear"><button className="srBtn" onClick={()=>setSustainabilityReportSince(sustainabilityReportSince-1)}>▼</button><strong>{sustainabilityReportSince}</strong><button className="srBtn" onClick={()=>setSustainabilityReportSince(sustainabilityReportSince+1)}>▲</button><button className={`srMaiBtn${sustainabilityReportSince==="mai"?" srMaiBtnOn":""}`} onClick={()=>setSustainabilityReportSince(sustainabilityReportSince==="mai"?2024:"mai")}>{isIt?"Mai":"Never"}</button></span>.</>
              )
          }
        </span>
      </div>}
      {setEsgReadiness&&<div className="csField" style={{marginTop:"12px"}}>
        <label style={{fontSize:"13px",fontWeight:600,color:"#7ab3a5",letterSpacing:".05em"}}>{isIt?"Seleziona il tuo stato attuale dati ESG":"Select your current ESG data status"}</label>
        <select className="csSelect" value={esgReadiness} onChange={e=>setEsgReadiness(e.target.value as EsgReadiness)}>
          {readinessList.map(r=><option key={r.key} value={r.key}>{r.label}</option>)}
        </select>
        <p className="csReadinessDesc">{activeReadiness.desc}</p>
      </div>}
      {(()=>{
        const chosen = rptPaths.find(p=>p.num===reportingPath);
        return <>
          <button className="companyRptTrigger" onClick={()=>setRptOpen(true)}>
            {chosen
              ? <><span className="companyRptTriggerChosen">{isIt?`L'azienda ha deciso di adottare ${chosen.label.it}`:`The company has decided to adopt ${chosen.label.en}`}</span><span className="companyRptTriggerEdit">✎ {isIt?"modifica":"edit"}</span></>
              : <span className="companyRptTriggerPrompt">{isIt?"✎ Seleziona il percorso di rendicontazione ESG più adatto per l'azienda":"✎ Select the most appropriate ESG reporting path for the company"}</span>
            }
          </button>
          {chosen&&<p className="companyRptDecision"><span>{isIt?"Motivo: ":"Reason: "}</span>{isIt?chosen.for.it:chosen.for.en}</p>}
          {frameworkChecks&&toggleFw&&(()=>{
            const allRows = fwGroups.flatMap(g=>g.rows);
            const selected = allRows.filter(({id})=>frameworkChecks[id]?.inUso||frameworkChecks[id]?.diInteresse);
            return <>
              {/* Trigger + Avanti sulla stessa riga */}
              <div style={{display:"flex",alignItems:"center",justifyContent:"space-between",gap:"12px"}}>
                <button className="fwTrigger" onClick={()=>setFwOpen(true)}>
                  <span className="fwTriggerLabel">{isIt?`Altri framework di interesse di ${displayCompanyName}`:`Other frameworks of interest for ${displayCompanyName}`}</span>
                  <span className="fwTriggerEdit">✎ {isIt?"seleziona":"select"}</span>
                </button>
                <button className="actionButton" style={{flexShrink:0,marginTop:0,width:"auto"}} onClick={()=>setScreen(nextScreen as any)}>{t.explore}<b>→</b></button>
              </div>
              {/* Summary: selected list or fallback */}
              {selected.length>0
                ? <div className="fwSummary">{selected.map(({id,label})=>{
                    const c=frameworkChecks[id];
                    return <span key={id} className="fwSummaryChip">
                      {label}
                      {c?.inUso&&<span className="fwSummaryTag fwSummaryTagUso">{isIt?"in uso":"in use"}</span>}
                      {c?.diInteresse&&<span className="fwSummaryTag fwSummaryTagInt">{isIt?"di interesse":"of interest"}</span>}
                    </span>;
                  })}</div>
                : <p className="fwSummaryEmpty">{isIt?"Nessun altro framework previsto.":"No other frameworks planned."}</p>
              }
            </>;
          })()}
        </>;
      })()}
    </section>
    )}
    {/* ── Modal fwOpen: figlio diretto di <main> per evitare clip da overflow:auto della section ── */}
    {fwOpen&&frameworkChecks&&toggleFw&&<div className="companyRptOverlay" onClick={e=>{if(e.target===e.currentTarget)setFwOpen(false)}}>
      <div className="companyRptModal" style={{maxWidth:"1560px",width:"90vw"}} onClick={e=>e.stopPropagation()}>
        <div className="companyRptModalHead">
          <p className="companyRptModalTitle">{isIt?`Altri framework di interesse di ${displayCompanyName}`:`Other frameworks of interest for ${displayCompanyName}`}</p>
          <button className="companyRptModalClose" onClick={()=>setFwOpen(false)}>✕</button>
        </div>
        <table className="fwTable">
          <thead>
            <tr>
              <th className="fwThLabel">{isIt?"Framework / requisito":"Framework / requirement"}</th>
              <th className="fwThArea">Area</th>
              <th className="fwThEnvizi">{isIt?"Copertura Envizi":"Envizi Coverage"}</th>
              <th className="fwThCheck">{isIt?"In uso":"In use"}</th>
              <th className="fwThCheck">{isIt?"Di interesse":"Of interest"}</th>
            </tr>
          </thead>
          <tbody>
            {fwGroups.map(group=>(
              <React.Fragment key={group.cat.it}>
                <tr style={{background:"transparent"}}>
                  <td colSpan={5} style={{padding:"10px 0 4px",fontSize:"11px",fontWeight:700,letterSpacing:".12em",textTransform:"uppercase",color:"#39efb4",borderTop:"1px solid rgba(57,239,180,.12)",background:"transparent"}}>{isIt?group.cat.it:group.cat.en}</td>
                </tr>
                {group.rows.map(({id,label,area,legacy})=>{
                  const cov = FW_ENVIZI_COV[id];
                  const lvlColor = cov?.level==="alto"?"#39efb4":cov?.level==="medio"?"#fbbf24":"#9ca3af";
                  const lvlLabel = cov ? (isIt
                    ? cov.level==="alto"?"Alto":cov.level==="medio"?"Medio":"Limitato"
                    : cov.level==="alto"?"High":cov.level==="medio"?"Medium":"Limited"
                  ) : "—";
                  return (
                  <tr key={id} className="fwRow">
                    <td className="fwTdLabel">
                      {label}
                      {legacy&&<span style={{marginLeft:"7px",padding:"1px 6px",borderRadius:"3px",border:"1px solid #6b7280",color:"#9ca3af",fontSize:"clamp(9px,.78vw,11px)",fontFamily:"var(--font-geist-mono,monospace)",fontWeight:700,letterSpacing:".08em",textTransform:"uppercase",verticalAlign:"middle"}}>legacy</span>}
                    </td>
                    <td className="fwTdArea">{area}</td>
                    <td className="fwTdEnvizi">
                      {cov&&<span className="fwEnviziLevel" style={{color:lvlColor,borderColor:lvlColor}}>{lvlLabel}</span>}
                      {cov&&<span className="fwEnviziDesc">{isIt?cov.it:cov.en}</span>}
                    </td>
                    <td className="fwTdCheck"><button className={`fwCheck${frameworkChecks[id]?.inUso?" fwCheckOn":""}`} onClick={e=>{e.stopPropagation();toggleFw(id,"inUso");}}>{frameworkChecks[id]?.inUso?"☑":"☐"}</button></td>
                    <td className="fwTdCheck"><button className={`fwCheck${frameworkChecks[id]?.diInteresse?" fwCheckOn":""}`} onClick={e=>{e.stopPropagation();toggleFw(id,"diInteresse");}}>{frameworkChecks[id]?.diInteresse?"☑":"☐"}</button></td>
                  </tr>
                  );
                })}
              </React.Fragment>
            ))}
          </tbody>
        </table>
        <div style={{display:"flex",justifyContent:"flex-end",marginTop:"20px"}}>
          <button className="actionButton" onClick={()=>setFwOpen(false)}>{isIt?"Chiudi":"Close"}</button>
        </div>
      </div>
    </div>}
    {/* ── Modal rptOpen: figlio diretto di <main> per evitare clip da overflow:auto della section ── */}
    {rptOpen&&<div className="companyRptOverlay" onClick={e=>{if(e.target===e.currentTarget)setRptOpen(false)}}>
      <div className="companyRptModal">
        <div className="companyRptModalHead">
          <p className="companyRptModalTitle">{isIt?"Seleziona il percorso di rendicontazione ESG più adatto:":"Select the most appropriate ESG reporting path:"}</p>
          <button className="companyRptModalClose" onClick={()=>setRptOpen(false)}>✕</button>
        </div>
        <div className="companyRptModalCards">
          {rptPaths.map(p=>(
            <button key={p.num} className={`companyRptModalCard${reportingPath===p.num?" companyRptModalCardActive":""}`} onClick={()=>{setReportingPath(p.num);setRptOpen(false);}}>
              <div className="csReportingCardNum">{p.num}</div>
              <div className="csReportingCardBody">
                <strong className="csReportingCardLabel">{isIt?p.label.it:p.label.en}</strong>
                <p className="csReportingCardDesc">{isIt?p.desc.it:p.desc.en}</p>
                <p className="csReportingCardFor"><span>{isIt?"Motivo: ":"Reason: "}</span>{isIt?p.for.it:p.for.en}</p>
              </div>
            </button>
          ))}
        </div>
      </div>
    </div>}
    <div className="welcomeBlueBar" style={{background:"#39efb4"}}/>
  </main>;
}
