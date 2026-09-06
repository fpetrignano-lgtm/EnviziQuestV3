"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import * as ReactDOM from "react-dom/client";
import { SummarySlideViewer } from "./screens/SummarySlideViewer";
import { generateTemplatePptx, generateTemplatePptxBuffer } from "./generateTemplatePptx";
import type { Language, Profile, Screen, Market, EsgReadiness, SectorKey, Priority, Outcome, DFRating } from "./types";
import { copy } from "./copy";
import { energyModule, supplyChainModule, reportingModule, planningModule, frameworkModule } from "./modules";
import { defaultPriorities, missionCatalog, imageFor, SECTORS, SECTOR_KEYS, DF_REQUIREMENTS, RF_REQUIREMENTS, EF_REQUIREMENTS, SC_REQUIREMENTS, PL_REQUIREMENTS, FR_REQUIREMENTS, ESG_READINESS_IT, ESG_READINESS_EN } from "./constants";
import { ChapterMap } from "./screens/ChapterMap";
import { QuestIntro } from "./screens/QuestIntro";
import { Blank1, IlTuoReport } from "./screens/Blank1";
import { P10Slideshow } from "./screens/P10Slideshow";
import { ApproachIntro, ApproachReport } from "./screens/ApproachScreens";
import { ChallengeSeparator1, ChallengeSeparator2, ChallengeSeparator3, ChallengeSeparator4, ChallengeSeparator5, ChallengeSeparator6, ChallengeComplete1, ChallengeComplete2, ChallengeComplete3, ChallengeComplete4, ChallengeComplete5, ChallengeComplete6, SectionIntroSlide } from "./screens/ChallengeScreens";
import { MissionCardScreen } from "./screens/MissionCard";
import { Compare } from "./screens/Compare";
import { CompanySetupScreen, CompanyScreen } from "./screens/CompanyScreens";
import { DataFoundationScreen, DFConclusionScreen, EnergyFoundationScreen, EnergyConclusionScreen, SupplyFoundationScreen, SupplyConclusionScreen, ReportingFoundationScreen, ReportingConclusionScreen, PlanningFoundationScreen, PlanningConclusionScreen, FrameworkFoundationScreen, FrameworkConclusionScreen } from "./screens/FoundationScreens";
import { SummaryScreen, NextStepScreen, ThankYouScreen, MilestoneScreen } from "./screens/SummaryScreens";
import { ReportSlideshow } from "./screens/ReportSlideshow";
import type { ReportData } from "./screens/ReportSlideshow";
import { ApproachDataCopyScreen, PrioritiesScreen, PriorityDataScreen, PriorityMatrixScreen } from "./screens/PriorityScreens";
import { MissionFlowScreen } from "./screens/MissionFlowScreens";

const ALL_SCREENS:Screen[]=["cover","welcome","onboarding","approach","chapterMap","sectionIntro1","questIntro","blank1","p10Slideshow","approachIntro","approachReport","intro","separatorNext","approachStepsCopy","sectionIntro2","companySetup","company","company2","sectionIntro3","priorities","approachDataCopy","priorityData","priorityMatrix","ilTuoReport","reportSlideshow","reportSlideshowPng","chapterOneSummary","esgStrategist","challengeSeparator1","missionCard1","introCopy","bridge","missions","briefing","missionIntro","introCopy2","asis","compare","trust","tobe","negative","success","milestone","dataFoundation","dfConclusion","challengeComplete1","challengeSeparator2","missionCard2","energyFoundation","energyConclusion","challengeComplete2","challengeSeparator3","missionCard3","supplyFoundation","supplyConclusion","challengeComplete3","challengeSeparator4","missionCard4","planningFoundation","planningConclusion","challengeComplete4","challengeSeparator5","missionCard5","frameworkFoundation","frameworkConclusion","challengeComplete5","challengeSeparator6","missionCard6","reportingFoundation","reportingConclusion","challengeComplete6","summary","sectionOutro","nextStep","thankYou"];

export default function Home(){
  const [language,setLanguage]=useState<Language>("it"); const [profile,setProfile]=useState<Profile|null>(null); const [screen,setScreenState]=useState<Screen>("cover"); const [screenHistory,setScreenHistory]=useState<Screen[]>([]); const [priorities,setPriorities]=useState<Priority[]>(defaultPriorities); const [selectedMission,setSelectedMission]=useState(0); const [negativeChoice,setNegativeChoice]=useState<"form"|"postpone">("form"); const [pendingOutcome,setPendingOutcome]=useState<Outcome>("positive"); const [missionParameters,setMissionParameters]=useState<Record<number,string[]>>({}); const [missionOutcomes,setMissionOutcomes]=useState<Record<number,Outcome>>({}); const [missionOrder,setMissionOrder]=useState<number[]>([0,3,5,2,1,4]); const [trustScore,setTrustScore]=useState(30); const [approachBiz,setApproachBiz]=useState(""); const [approachData,setApproachData]=useState(""); const [contactEmail,setContactEmail]=useState(""); const [asIsRatings,setAsIsRatings]=useState<Record<number,("alto"|"medio"|"basso")[]>>({});
  const [companyName,setCompanyName]=useState("");
  const [workshopDate,setWorkshopDate]=useState(()=>new Date().toISOString().slice(0,10));
  const [consultantName,setConsultantName]=useState("");
  const [participantRole,setParticipantRole]=useState("");
  const [participantCompany,setParticipantCompany]=useState("");
  const [businessUnit,setBusinessUnit]=useState("");
  const [revenueYear,setRevenueYear]=useState(2025);
  const [welcomeZoomWarn,setWelcomeZoomWarn]=useState(false);
  const [coverZoomWarn,setCoverZoomWarn]=useState(false);
  const [onboardingZoomWarn,setOnboardingZoomWarn]=useState(false);
  const [approachZoomWarn,setApproachZoomWarn]=useState(false);
  const [introZoomWarn,setIntroZoomWarn]=useState(false);
  const [separatorNextZoomWarn,setSeparatorNextZoomWarn]=useState(false);
  const [approachStepsCopyZoomWarn,setApproachStepsCopyZoomWarn]=useState(false);
  const [esgStrategistZoomWarn,setEsgStrategistZoomWarn]=useState(false);
  const [approachDataCopySeen,setApproachDataCopySeen]=useState(false);
  const [journeyOpen,setJourneyOpen]=useState(false);
  const zoomDismissedRef=useRef(false);
  useEffect(()=>{zoomDismissedRef.current=false;},[screen]);
  const dismissZoom=()=>{zoomDismissedRef.current=true;setWelcomeZoomWarn(false);setCoverZoomWarn(false);setOnboardingZoomWarn(false);setApproachZoomWarn(false);setIntroZoomWarn(false);setSeparatorNextZoomWarn(false);setApproachStepsCopyZoomWarn(false);setEsgStrategistZoomWarn(false);};
  useEffect(()=>{
    if(screen!=="welcome"&&screen!=="cover"&&screen!=="onboarding"&&screen!=="approach"&&screen!=="intro"&&screen!=="separatorNext"&&screen!=="approachStepsCopy"&&screen!=="esgStrategist")return;
    const handler=(e:KeyboardEvent)=>{
      const mod=e.metaKey||e.ctrlKey;
      if(!mod)return;
      if(e.key==="+"||e.key==="="||e.key==="-"||e.key==="0"){
        if(zoomDismissedRef.current)return;
        e.preventDefault();
        if(screen==="welcome")setWelcomeZoomWarn(true);
        if(screen==="cover")setCoverZoomWarn(true);
        if(screen==="onboarding")setOnboardingZoomWarn(true);
        if(screen==="approach")setApproachZoomWarn(true);
        if(screen==="intro")setIntroZoomWarn(true);
        if(screen==="separatorNext")setSeparatorNextZoomWarn(true);
        if(screen==="approachStepsCopy")setApproachStepsCopyZoomWarn(true);
        if(screen==="esgStrategist")setEsgStrategistZoomWarn(true);
      }
    };
    window.addEventListener("keydown",handler);
    return ()=>window.removeEventListener("keydown",handler);
  },[screen]);
  const [sustainabilityReportSince,setSustainabilityReportSince]=useState<number|"mai">(2024);
  const FW_IDS=["gresb","cdp","gri","sasb","tcfd","ghg","sdg","sfdr","secr","energystar","nabers","ifrs_s1","ifrs_s2"] as const;
  type FwId=typeof FW_IDS[number];
  const [frameworkChecks,setFrameworkChecks]=useState<Record<FwId,{inUso:boolean,diInteresse:boolean}>>(()=>Object.fromEntries(FW_IDS.map(id=>[id,{inUso:false,diInteresse:false}])) as Record<FwId,{inUso:boolean,diInteresse:boolean}>);
  const toggleFw=useCallback((id:FwId,col:"inUso"|"diInteresse")=>setFrameworkChecks(prev=>{const cur=prev[id]??{inUso:false,diInteresse:false};return{...prev,[id]:{...cur,[col]:!cur[col]}};}),[]); // prev[id] può essere undefined se il save è precedente all'aggiunta di ifrs_s1/s2
  const [fwOpen,setFwOpen]=useState(false);
  const [rptOpen,setRptOpen]=useState(false);
  const [companyLogo,setCompanyLogo]=useState<string>("");
  const [companySector,setCompanySector]=useState<SectorKey>("manifatturiero");
  const [companyMarket,setCompanyMarket]=useState<Market>("mondo");
  const [esgReadiness,setEsgReadiness]=useState<EsgReadiness>("primi");
  type SiteGeoKey="italia"|"europa"|"uk"|"nordamerica"|"sudamerica"|"asia"|"africa"|"australia";
  type SiteRowKey="uffici"|"ops"|"datacenter"|"altro";
  type SiteTable=Record<SiteRowKey,Record<SiteGeoKey,number>>;
  const emptyRow=():Record<SiteGeoKey,number>=>{return {italia:0,europa:0,uk:0,nordamerica:0,sudamerica:0,asia:0,africa:0,australia:0};};
  const [siteTable,setSiteTable]=useState<SiteTable>(()=>({uffici:emptyRow(),ops:emptyRow(),datacenter:emptyRow(),altro:emptyRow()}));
  const updateSiteCell=(row:SiteRowKey,geo:SiteGeoKey,val:number)=>setSiteTable(prev=>({...prev,[row]:{...prev[row],[geo]:isNaN(val)?0:Math.max(0,val)}}));
  const siteRowSum=(row:SiteRowKey)=>Object.values(siteTable[row]).reduce((s,v)=>s+v,0);
  const siteColSum=(geo:SiteGeoKey)=>(["uffici","ops","datacenter","altro"] as SiteRowKey[]).reduce((s,r)=>s+(siteTable[r][geo]??0),0);
  const siteTotalAll=()=>(["uffici","ops","datacenter","altro"] as SiteRowKey[]).reduce((s,r)=>s+siteRowSum(r),0);
  // companyDims[1..3] derivati da siteTable per compatibilità downstream
  const [companyDims,setCompanyDims]=useState<[number,number,number,number,number]>([0,0,0,0,0]);
  const updateCompanyDim=(i:number,v:number)=>{const next=[...companyDims] as [number,number,number,number,number];next[i]=v;setCompanyDims(next);};
  // geoDistrib derivato da siteTable per compatibilità downstream (mappa verso chiavi legacy)
  const geoDistrib:Record<string,number>={italia:siteColSum("italia"),europa:siteColSum("europa"),uk:siteColSum("uk"),nordamerica:siteColSum("nordamerica"),sudamerica:siteColSum("sudamerica"),asia:siteColSum("asia"),africa:siteColSum("africa"),australia:siteColSum("australia")};
  type DataNeedItem={id:string,priority:Priority,label:string};
  const buildDefaultDataNeeds=(lang:"it"|"en",prioOrder:Priority[]):DataNeedItem[]=>{
    const needs=copy[lang].priorityDataNeeds as Record<Priority,{id:string,label:string}[]>;
    return prioOrder.flatMap(p=>(needs[p]||[]).map(n=>({id:n.id,priority:p,label:n.label})));
  };
  const [dataNeeds,setDataNeeds]=useState<DataNeedItem[]>(()=>buildDefaultDataNeeds("it",defaultPriorities));
  const [topNNeeds,setTopNNeeds]=useState(10);
  const [needRelevance,setNeedRelevance]=useState<Record<string,number>>({});
  const [needCriticality,setNeedCriticality]=useState<Record<string,number>>({});
  const [focusMinR,setFocusMinR]=useState(1);
  const [focusMinC,setFocusMinC]=useState(1);
  const [hoveredPriority,setHoveredPriority]=useState<Priority|null>(null);
  const [pmMissionFilter,setPmMissionFilter]=useState<number|null>(null);
  const [pmFromBriefing,setPmFromBriefing]=useState(false);
  const [pmSelected,setPmSelected]=useState<{id:string,label:string,rel:number,crit:number,color:string}|null>(null);
  const [dfRatings,setDfRatings]=useState<Record<string,DFRating>>(()=>Object.fromEntries(DF_REQUIREMENTS.map(r=>[r.id,"low" as DFRating])));
  const setDfRating=(id:string,val:DFRating)=>setDfRatings(prev=>({...prev,[id]:val}));
  const [rfRatings,setRfRatings]=useState<Record<string,DFRating>>(()=>Object.fromEntries(RF_REQUIREMENTS.map(r=>[r.id,"low" as DFRating])));
  const setRfRating=(id:string,val:DFRating)=>setRfRatings(prev=>({...prev,[id]:val}));
  const [efRatings,setEfRatings]=useState<Record<string,DFRating>>(()=>Object.fromEntries(EF_REQUIREMENTS.map(r=>[r.id,"low" as DFRating])));
  const setEfRating=(id:string,val:DFRating)=>setEfRatings(prev=>({...prev,[id]:val}));
  const [scRatings,setScRatings]=useState<Record<string,DFRating>>(()=>Object.fromEntries(SC_REQUIREMENTS.map(r=>[r.id,"low" as DFRating])));
  const setScRating=(id:string,val:DFRating)=>setScRatings(prev=>({...prev,[id]:val}));
  const [plRatings,setPlRatings]=useState<Record<string,DFRating>>(()=>Object.fromEntries(PL_REQUIREMENTS.map(r=>[r.id,"low" as DFRating])));
  const setPlRating=(id:string,val:DFRating)=>setPlRatings(prev=>({...prev,[id]:val}));
  const [frRatings,setFrRatings]=useState<Record<string,DFRating>>(()=>Object.fromEntries(FR_REQUIREMENTS.map(r=>[r.id,"low" as DFRating])));
  const setFrRating=(id:string,val:DFRating)=>setFrRatings(prev=>({...prev,[id]:val}));
  const [needIncluded,setNeedIncluded]=useState<Record<string,boolean>>(()=>{
    const init:Record<string,boolean>={};
    buildDefaultDataNeeds("it",defaultPriorities).forEach((n)=>{init[n.id]=false;});
    return init;
  });
  const [pdHelpOpen,setPdHelpOpen]=useState(false);
  const [pdCustomLabels,setPdCustomLabels]=useState<Record<string,string>>({});
  const [pdCustomMemos,setPdCustomMemos]=useState<Record<string,string>>({});
  const toggleNeedIncluded=(id:string)=>setNeedIncluded(prev=>({...prev,[id]:!prev[id]}));
  const isNeedIncluded=(id:string)=>needIncluded[id]??false;
  const [dfFocusId,setDfFocusId]=useState<string|null>(null);
  const [priorityIncluded,setPriorityIncluded]=useState<Record<Priority,boolean>>({credit:true,compliance:true,customers:true,efficiency:true,supply:true,reputation:true});
  const [esgStrategistUnlocked,setEsgStrategistUnlocked]=useState(false);
  const togglePriorityIncluded=(p:Priority)=>setPriorityIncluded(prev=>({...prev,[p]:!prev[p]}));
  const [prioExperience,setPrioExperience]=useState<Record<Priority,string>>({credit:"",compliance:"",customers:"",efficiency:"",supply:"",reputation:""});
  const [prioExpModal,setPrioExpModal]=useState<Priority|null>(null);
  const [prioExpSelected,setPrioExpSelected]=useState<Record<Priority,number>>({credit:-1,compliance:-1,customers:-1,efficiency:-1,supply:-1,reputation:-1});
  const prioDefaultExp:Record<Priority,Record<"it"|"en",[string,string,string]>>={
    credit:{
      it:[
        "Le banche ci chiedono sempre più spesso dati ESG strutturati per rinnovare le linee di credito. Negli ultimi 18 mesi abbiamo ricevuto richieste di rating ESG da 3 istituti diversi. Senza dati verificabili rischiamo condizioni peggiorative sui finanziamenti.",
        "Stiamo lavorando a un'emissione di green bond. Il lead arranger ci ha già richiesto un framework ESG verificabile con dati storici su emissioni ed energia. Non abbiamo ancora un sistema capace di produrre questo livello di evidenza.",
        "Il nostro rating ESG esterno è peggiorato nell'ultimo ciclo di valutazione. Gli analisti ci hanno segnalato la mancanza di dati Scope 2 disaggregati per sede e l'assenza di un processo di assurance. Questo impatta il costo del debito."
      ],
      en:[
        "Banks increasingly ask for structured ESG data to renew credit lines. In the last 18 months we received ESG rating requests from 3 different institutions. Without verifiable data we risk worse financing conditions.",
        "We are working on a green bond issuance. The lead arranger has already asked for a verifiable ESG framework with historical data on emissions and energy. We do not yet have a system capable of producing this level of evidence.",
        "Our external ESG rating worsened in the last assessment cycle. Analysts flagged the lack of disaggregated Scope 2 data by site and the absence of an assurance process. This is affecting our cost of debt."
      ]
    },
    compliance:{
      it:[
        "La CSRD ci tocca direttamente: siamo in scope dal 2026. Il team ESG oggi raccoglie dati manualmente da 8 sistemi diversi e impiega 14 settimane per chiudere il report annuale. Abbiamo bisogno di un sistema unico e auditabile.",
        "Abbiamo ricevuto i primi rilievi dall'auditor ESG: le catene di evidenza per i dati di Scope 1 e 2 non sono ricostruibili in modo indipendente. Se non risolviamo prima del prossimo ciclo rischiamo un'opinione con riserva.",
        "Il nostro settore è sotto osservazione da parte di ESMA per il rischio di greenwashing. Il Compliance Officer ha chiesto al team ESG di dimostrare che ogni dato pubblicato è tracciabile fino alla fonte primaria. Oggi non siamo in grado di farlo."
      ],
      en:[
        "CSRD applies to us directly: we're in scope from 2026. The ESG team today collects data manually from 8 different systems and takes 14 weeks to close the annual report. We need a single, auditable system.",
        "We received the first findings from the ESG auditor: the evidence chains for Scope 1 and 2 data cannot be independently reconstructed. If we don't resolve this before the next cycle we risk a qualified opinion.",
        "Our sector is under scrutiny from ESMA for greenwashing risk. The Compliance Officer has asked the ESG team to demonstrate that every published data point is traceable to its primary source. Today we cannot do that."
      ]
    },
    customers:{
      it:[
        "Tre dei nostri top-10 clienti ci hanno già inviato questionari ESG per la qualifica fornitori. Uno di essi ha inserito soglie minime di performance ambientale nei contratti 2024. Rischiamo di perdere gare se non dimostriamo dati credibili.",
        "Un grande retailer europeo ci ha notificato che dal 2025 tutti i fornitori dovranno dichiarare le emissioni Scope 3 cat. 1 con dati specifici per prodotto. Oggi lavoriamo con stime spend-based che non soddisfano questo requisito.",
        "Siamo entrati nella shortlist per una gara pubblica da €15M. Il capitolato prevede un punteggio tecnico ESG con peso del 20%. Non abbiamo documentazione strutturata per rispondere ai criteri ambientali richiesti."
      ],
      en:[
        "Three of our top-10 customers have already sent us ESG questionnaires for supplier qualification. One of them introduced minimum environmental performance thresholds in 2024 contracts. We risk losing tenders without credible data.",
        "A large European retailer has notified us that from 2025 all suppliers must declare Scope 3 cat. 1 emissions with product-specific data. Today we work with spend-based estimates that do not meet this requirement.",
        "We have been shortlisted for a €15M public tender. The specification includes a technical ESG score with a 20% weighting. We have no structured documentation to respond to the required environmental criteria."
      ]
    },
    efficiency:{
      it:[
        "I costi energetici rappresentano il 18% del costo di produzione. Nel 2023 abbiamo perso €2,1M per la volatilità dei prezzi dell'energia. Abbiamo avviato alcuni progetti di efficienza ma non riusciamo a misurarne il ritorno in modo sistematico.",
        "Abbiamo installato pannelli fotovoltaici e sostituito i compressori negli ultimi due anni. Non siamo però in grado di quantificare i risparmi reali stabilimento per stabilimento: i dati dei contatori non sono integrati in nessun sistema centrale.",
        "Il CFO ha chiesto un piano di decarbonizzazione con NPV e payback per ogni iniziativa. Non disponiamo di una baseline energetica affidabile per sito, né di un sistema che aggreghi consumi, costi e produzioni per calcolare l'intensità emissiva."
      ],
      en:[
        "Energy costs represent 18% of production cost. In 2023 we lost €2.1M due to energy price volatility. We have started some efficiency projects but cannot measure their return systematically.",
        "We have installed photovoltaic panels and replaced compressors over the last two years. However we cannot quantify the actual savings plant by plant: meter data is not integrated into any central system.",
        "The CFO has asked for a decarbonisation plan with NPV and payback for each initiative. We do not have a reliable energy baseline by site, nor a system that aggregates consumption, costs and production to calculate emission intensity."
      ]
    },
    supply:{
      it:[
        "Scope 3 cat. 1 e 2 valgono il 65% della nostra impronta totale. I principali fornitori non inviano dati strutturati: riceviamo PDF e allegati e-mail che non riusciamo a riconciliare. Un cliente chiave ci ha già chiesto un piano di riduzione Scope 3.",
        "Abbiamo 340 fornitori attivi. Per i 50 più rilevanti vorremmo raccogliere dati primari sulle emissioni, ma oggi mandiamo questionari in PDF via e-mail con un tasso di risposta inferiore al 40% e dati non confrontabili tra loro.",
        "Stiamo preparando il bilancio di sostenibilità per la prima volta. La sezione Scope 3 è la più critica: le categorie acquisti, trasporti e uso dei prodotti rappresentano oltre il 70% delle emissioni ma non abbiamo un processo strutturato per raccogliere questi dati."
      ],
      en:[
        "Scope 3 cat. 1 and 2 account for 65% of our total footprint. Key suppliers don't send structured data: we receive PDFs and email attachments we can't reconcile. A key customer has already asked us for a Scope 3 reduction plan.",
        "We have 340 active suppliers. For the 50 most relevant ones we want to collect primary emissions data, but today we send PDF questionnaires by email with a response rate below 40% and data that is not comparable across suppliers.",
        "We are preparing our first sustainability report. The Scope 3 section is the most critical: purchased goods, transport and product use categories account for over 70% of emissions but we have no structured process to collect this data."
      ]
    },
    reputation:{
      it:[
        "Il turnover dei profili ESG, sustainability e HSE è raddoppiato negli ultimi 2 anni. I candidati chiedono sistematicamente se disponiamo di strumenti professionali per la gestione della sostenibilità. La reputazione ESG è diventata un fattore di retention.",
        "Abbiamo perso tre candidati senior in favore di competitor che comunicano obiettivi di Net Zero con dati verificabili. Il nostro employer branding ESG è percepito come generico. I neolaureati STEM chiedono di vedere metriche reali prima di accettare un'offerta.",
        "Il CdA ha approvato un obiettivo pubblico di Net Zero al 2040. Non disponiamo però di un sistema che monitori l'avanzamento delle iniziative di decarbonizzazione e dimostri ai nostri stakeholder che stiamo rispettando il piano."
      ],
      en:[
        "Turnover of ESG, sustainability and HSE profiles has doubled in the last 2 years. Candidates systematically ask whether we have professional sustainability management tools. ESG reputation has become a retention factor.",
        "We have lost three senior candidates to competitors who communicate Net Zero targets with verifiable data. Our ESG employer branding is perceived as generic. STEM graduates ask to see real metrics before accepting an offer.",
        "The Board has approved a public Net Zero target for 2040. However we do not have a system that monitors progress on decarbonisation initiatives and demonstrates to our stakeholders that we are on track."
      ]
    }
  };
  const [userName,setUserName]=useState("");
  const [questName,setQuestName]=useState("");
  const getSavedQuestKeys=():string[]=>{const keys:string[]=[];for(let i=0;i<localStorage.length;i++){const k=localStorage.key(i);if(k?.startsWith("envizi-quest-save-"))keys.push(k.replace("envizi-quest-save-",""));}return keys.sort();};
  const saveQuest=(name:string)=>{if(!name.trim())return;const data={userName,language,profile,priorities,prioExperience,missionOrder,missionOutcomes,missionParameters,trustScore,companyName,companySector,companyDims,companyMarket,esgReadiness,asIsRatings,dataNeeds,needRelevance,needCriticality,needIncluded,screen,companyLogo,workshopDate,consultantName,participantRole,participantCompany,businessUnit,revenueYear,siteTable,frameworkChecks,sustainabilityReportSince,pdCustomLabels,pdCustomMemos};localStorage.setItem(`envizi-quest-save-${name.trim()}`,JSON.stringify(data));};
  const loadQuest=(name:string)=>{const raw=localStorage.getItem(`envizi-quest-save-${name}`);if(!raw)return;try{const d=JSON.parse(raw);if(d.userName)setUserName(d.userName);if(d.language)setLanguage(d.language);if(d.profile)setProfile(d.profile);if(d.priorities)setPriorities(d.priorities);if(d.prioExperience)setPrioExperience(d.prioExperience);if(d.missionOrder)setMissionOrder(d.missionOrder);if(d.missionOutcomes)setMissionOutcomes(d.missionOutcomes);if(d.missionParameters)setMissionParameters(d.missionParameters);if(d.trustScore!=null)setTrustScore(d.trustScore);if(d.companyName!=null)setCompanyName(d.companyName);if(d.companySector)setCompanySector(d.companySector);if(d.companyDims)setCompanyDims(d.companyDims);if(d.companyMarket)setCompanyMarket(d.companyMarket);if(d.siteTable)setSiteTable(d.siteTable);if(d.esgReadiness)setEsgReadiness(d.esgReadiness);if(d.asIsRatings)setAsIsRatings(d.asIsRatings);if(d.dataNeeds)setDataNeeds(d.dataNeeds);if(d.companyLogo!=null)setCompanyLogo(d.companyLogo);if(d.workshopDate)setWorkshopDate(d.workshopDate);if(d.consultantName)setConsultantName(d.consultantName);if(d.participantRole!=null)setParticipantRole(d.participantRole);if(d.participantCompany!=null)setParticipantCompany(d.participantCompany);if(d.businessUnit!=null)setBusinessUnit(d.businessUnit);if(d.revenueYear!=null)setRevenueYear(d.revenueYear);if(d.frameworkChecks)setFrameworkChecks(prev=>({...prev,...d.frameworkChecks}));if(d.sustainabilityReportSince!=null)setSustainabilityReportSince(d.sustainabilityReportSince);if(d.pdCustomLabels)setPdCustomLabels(d.pdCustomLabels);if(d.pdCustomMemos)setPdCustomMemos(d.pdCustomMemos);if(d.needRelevance)setNeedRelevance(d.needRelevance);if(d.needCriticality)setNeedCriticality(d.needCriticality);if(d.needIncluded)setNeedIncluded(d.needIncluded);setQuestName(name);if(d.screen)setScreenState(d.screen);}catch(e){}};
  const deleteQuest=(name:string)=>{localStorage.removeItem(`envizi-quest-save-${name}`);};
  const downloadQuest=(name:string)=>{
    const raw=localStorage.getItem(`envizi-quest-save-${name}`);
    if(!raw)return;
    const blob=new Blob([raw],{type:"application/json"});
    const filename=`${name}.envizi-quest`;
    const url=URL.createObjectURL(blob);
    const a=document.createElement("a");
    a.href=url;a.download=filename;a.click();
    URL.revokeObjectURL(url);
  };
  const uploadQuestFile=(file:File,overrideName?:string)=>{
    const reader=new FileReader();
    reader.onload=e=>{
      try{
        const d=JSON.parse(e.target?.result as string);
        const key=overrideName||(d.questName||file.name.replace(/\.envizi-quest$/,"").replace(/\.json$/,""));
        if(!key.trim())return;
        if(overrideName===undefined&&userName.trim())d.userName=userName.trim();
        localStorage.setItem(`envizi-quest-save-${key.trim()}`,JSON.stringify(d));
        setScreenState("cover");setTimeout(()=>setScreenState("welcome"),10);
      }catch(err){}
    };
    reader.readAsText(file);
  };
  const openUploadPicker=async()=>{
    // File System Access API — apre dialogo con scelta cartella
    if(typeof (window as any).showOpenFilePicker==="function"){
      try{
        const [handle]=await (window as any).showOpenFilePicker({
          types:[{description:"Envizi Quest",accept:{"application/json":[".envizi-quest",".json"]}}],
          multiple:false
        });
        const file=await handle.getFile();
        uploadQuestFile(file);
        return;
      }catch(e){/* annullato o non supportato */}
    }
    // Fallback: click sull'input nascosto
    document.getElementById("welcomeUploadInput")?.click();
  };
  useEffect(()=>{setDataNeeds(buildDefaultDataNeeds(language,priorities));},[language,priorities]);
  const moveNeed=(index:number,direction:-1|1)=>{const next=[...dataNeeds];const target=index+direction;if(target<0||target>=next.length)return;[next[index],next[target]]=[next[target],next[index]];setDataNeeds(next);};
  const rankNeed=(fromIdx:number,toRank:number)=>{const clamped=Math.max(1,Math.min(dataNeeds.length,toRank));const toIdx=clamped-1;if(toIdx===fromIdx)return;const next=[...dataNeeds];const [item]=next.splice(fromIdx,1);next.splice(toIdx,0,item);setDataNeeds(next);};
  // rank within a priority group: fromIdx is the global index, toRank is 1-based within the group
  const rankNeedInGroup=(id:string,priority:Priority,toRank:number)=>{
    const groupIds=dataNeeds.filter(n=>n.priority===priority).map(n=>n.id);
    const groupSize=groupIds.length;
    const clamped=Math.max(1,Math.min(groupSize,toRank));
    const fromPos=groupIds.indexOf(id);
    if(fromPos===-1||fromPos===clamped-1)return;
    // rebuild flat array: extract item from its current global position, insert at target global position
    const next=[...dataNeeds];
    const fromGlobal=next.findIndex(n=>n.id===id);
    const [item]=next.splice(fromGlobal,1);
    // after removal, find where the target slot is among the same-priority items
    const targetId=groupIds.filter(gid=>gid!==id)[clamped-1];
    const toGlobal=targetId?next.findIndex(n=>n.id===targetId):next.findIndex(n=>n.priority===priority&&next.indexOf(n)>=0);
    const insertAt=toGlobal!==-1?toGlobal+(fromPos<clamped-1?1:0):next.length;
    next.splice(insertAt,0,item);
    setDataNeeds(next);
  };
  const rankPriority=(fromIdx:number,toRank:number)=>{const clamped=Math.max(1,Math.min(priorities.length,toRank));const toIdx=clamped-1;if(toIdx===fromIdx)return;const next=[...priorities];const [item]=next.splice(fromIdx,1);next.splice(toIdx,0,item);setPriorities(next);};
  const needIdToMission:Record<string,number>={
    // M0 — Data Foundation
    "credit-3":0, "compliance-4":0, "compliance-6":0, "compliance-7":0, "reputation-2":0,
    "customers-6":0, "customers-7":0, "reputation-5":0, "reputation-6":0,
    // M1 — Energia
    "efficiency-1":1, "efficiency-2":1, "efficiency-3":1, "efficiency-4":1, "efficiency-6":1,
    // M2 — Supply Chain
    "supply-1":2, "supply-2":2, "supply-3":2, "supply-4":2, "supply-5":2, "supply-6":2, "supply-7":2,
    "customers-1":2, "customers-2":2, "customers-3":2,
    // M3 — Reporting e performance
    "credit-1":3, "credit-2":3, "compliance-1":3, "reputation-3":3,
    "customers-4":3, "customers-5":3,
    // M4 — Net Zero
    "credit-6":4, "credit-7":4, "efficiency-5":4, "efficiency-7":4, "reputation-4":4, "reputation-7":4,
    // M5 — Framework ESG e disclosure
    "compliance-2":5, "compliance-3":5, "compliance-5":5, "credit-4":5, "credit-5":5,
    "reputation-1":5,
  };
  const needIdToCapability:Record<string,{it:string,en:string}>={
    // M0
    "credit-3":    {it:"Sistema di record centralizzato, record di dettaglio e audit trail Envizi",                                         en:"Centralised system of record, detail records and Envizi audit trail"},
    "compliance-4":{it:"Audit History, record di dettaglio, note e allegati Envizi",                                                        en:"Envizi Audit History, detail records, notes and attachments"},
    "compliance-6":{it:"Data Health Check, Monthly Data Summary, regole di validazione e alert",                                            en:"Data Health Check, Monthly Data Summary, validation rules and alerts"},
    "compliance-7":{it:"Audit report, allegati, report di dettaglio e accesso controllato in Envizi",                                       en:"Audit reports, attachments, detail reports and controlled access in Envizi"},
    "reputation-2":{it:"Social Metrics Account Styles, form e Surveys + Assessments",                                                       en:"Social Metrics Account Styles, forms and Surveys + Assessments"},
    "reputation-6":{it:"Surveys + Assessments con template, scoring, allegati e workflow",                                                  en:"Surveys + Assessments with templates, scoring, attachments and workflow"},
    // M1
    "efficiency-1":{it:"Interval Meter Analytics",                                                                                          en:"Interval Meter Analytics"},
    "efficiency-2":{it:"Utility Bill Analytics",                                                                                            en:"Utility Bill Analytics"},
    "efficiency-3":{it:"Regression modeling e KPI normalization di Utility Bill e Interval Meter Analytics",                                en:"Regression modelling and KPI normalisation in Utility Bill and Interval Meter Analytics"},
    "efficiency-4":{it:"Meter-based alerts di Interval Meter Analytics",                                                                    en:"Meter-based alerts in Interval Meter Analytics"},
    "efficiency-6":{it:"Utility performance management e analisi di intensità di Interval Meter Analytics",                                 en:"Utility performance management and intensity analytics in Interval Meter Analytics"},
    // M2
    "supply-1":    {it:"Supply Chain Intelligence per cat. 1; Scope 3 GHG Accounting per cat. 4",                                          en:"Supply Chain Intelligence for cat. 1; Scope 3 GHG Accounting for cat. 4"},
    "supply-2":    {it:"Surveys + Assessments e supplier engagement portal",                                                                en:"Surveys + Assessments and supplier engagement portal"},
    "supply-3":    {it:"Automated data capture di Supply Chain Intelligence da sistemi ERP e finanziari",                                   en:"Supply Chain Intelligence automated data capture from ERP and financial systems"},
    "supply-4":    {it:"Surveys + Assessments e dati ESG/risk insight raccolti con Supply Chain Intelligence",                              en:"Surveys + Assessments and ESG/risk insight data gathered via Supply Chain Intelligence"},
    "supply-5":    {it:"Workflow e Issues Management di Surveys + Assessments; piani da configurare",                                       en:"Workflow and Issues Management in Surveys + Assessments; plans to configure"},
    "supply-6":    {it:"Dashboard di supplier engagement e controlli di data quality di Supply Chain Intelligence",                         en:"Supplier engagement dashboards and data quality controls in Supply Chain Intelligence"},
    "supply-7":    {it:"Gerarchia dei metodi di calcolo e raccolta di emissioni corporate e PCF in Supply Chain Intelligence",              en:"Calculation method hierarchy and collection of corporate emissions and PCFs in Supply Chain Intelligence"},
    "customers-1": {it:"Scope 3 GHG Accounting; Supply Chain Intelligence per categorie 1 e 2",                                            en:"Scope 3 GHG Accounting; Supply Chain Intelligence for categories 1 and 2"},
    "customers-2": {it:"Surveys + Assessments e supplier engagement di Supply Chain Intelligence",                                          en:"Surveys + Assessments and supplier engagement in Supply Chain Intelligence"},
    "customers-3": {it:"Raccolta e gestione di PCF tramite Supply Chain Intelligence",                                                      en:"PCF collection and management via Supply Chain Intelligence"},
    "customers-4": {it:"PowerReports configurabili con filtri per gruppo, sede, periodo e indicatore",                                      en:"Configurable PowerReports with filters by group, site, period and indicator"},
    "customers-5": {it:"Scope 1 & 2 GHG Accounting con metodo location-based e market-based",                                             en:"Scope 1 & 2 GHG Accounting with location-based and market-based method"},
    "customers-6": {it:"Surveys & Assessments con campi, scoring, allegati, scadenze e workflow",                                          en:"Surveys & Assessments with fields, scoring, attachments, deadlines and workflow"},
    "customers-7": {it:"Data Foundation: record, fattori, note, allegati e audit history centralizzati",                                   en:"Data Foundation: centralised records, factors, notes, attachments and audit history"},
    // M3
    "credit-1":    {it:"Scope 1 & 2 e Scope 3 GHG Accounting + Reporting, alimentati dalla Data Foundation",                              en:"Scope 1 & 2 and Scope 3 GHG Accounting + Reporting, fed by the Data Foundation"},
    "credit-2":    {it:"PowerReports preconfigurati e dashboard personalizzabili",                                                          en:"Pre-configured PowerReports and customisable dashboards"},
    "compliance-1":{it:"Scope 1 & 2 e Scope 3 GHG Accounting + Reporting",                                                                en:"Scope 1 & 2 and Scope 3 GHG Accounting + Reporting"},
    "reputation-3":{it:"PowerReports, dashboard e analisi multi-periodo e multi-sede",                                                      en:"PowerReports, dashboards and multi-period and multi-site analytics"},
    // M4
    "credit-4":    {it:"Envizi Sustainability Reporting Manager con framework ESRS e standard internazionali",                             en:"Envizi Sustainability Reporting Manager with ESRS and international frameworks"},
    "credit-6":    {it:"Scenario Modeler e Envizi Planning Analytics AddOn",                                                               en:"Scenario Modeler and Envizi Planning Analytics AddOn"},
    "credit-7":    {it:"Sustainability Program Tracking con impatto finanziario, IRR, NPV e risparmi attesi",                               en:"Sustainability Program Tracking with financial impact, IRR, NPV and expected savings"},
    "efficiency-5":{it:"Target Setting + Tracking, dashboard e PowerReports",                                                              en:"Target Setting + Tracking, dashboards and PowerReports"},
    "efficiency-7":{it:"Sustainability Program Tracking e Scenario Modeler per costi, risparmi ed emissioni",                              en:"Sustainability Program Tracking and Scenario Modeler for costs, savings and emissions"},
    // M5
    "compliance-2":{it:"Sustainability Reporting Manager",                                                                                  en:"Sustainability Reporting Manager"},
    "compliance-3":{it:"Framework Library di Sustainability Reporting Manager",                                                             en:"Sustainability Reporting Manager Framework Library"},
    "compliance-5":{it:"Materiality e gap tags in Sustainability Reporting Manager; valutazione non automatica",                            en:"Materiality and gap tags in Sustainability Reporting Manager; assessment not automated"},
    "credit-5":    {it:"Framework Library e workflow di Sustainability Reporting Manager",                                                  en:"Sustainability Reporting Manager Framework Library and workflow"},
    "reputation-1":{it:"Sustainability Reporting Manager + PowerReports personalizzabili",                                                  en:"Sustainability Reporting Manager + customisable PowerReports"},
    "reputation-4":{it:"Target Setting & Tracking, Sustainability Program Tracking e PowerReports",                                        en:"Target Setting & Tracking, Sustainability Program Tracking and PowerReports"},
    "reputation-5":{it:"Surveys & Assessments su utenti interni con scoring, allegati e workflow",                                         en:"Surveys & Assessments for internal users with scoring, attachments and workflow"},
    "reputation-7":{it:"Target Setting & Tracking; Social Metrics e PowerReports per confronto target/risultati",                          en:"Target Setting & Tracking; Social Metrics and PowerReports for target/results comparison"},
  };
  const missionBadgeLabel=["M0","M1","M2","M3","M4","M5"];
  const topNeeds=dataNeeds.filter(n=>isNeedIncluded(n.id)).map((n,i)=>({...n,rank:i+1}));
  const needsByMissionHub:[number,typeof topNeeds][]=[0,1,2,3,4,5].map(mi=>[mi,topNeeds.filter(n=>(needIdToMission[n.id]??0)===mi)]);
  const focusedNeeds=topNeeds.filter(n=>{const rel=Math.min(needRelevance[n.id]??5,10);const relNorm=rel;const crit=needCriticality[n.id]??5;return relNorm>=focusMinR&&crit>=focusMinC;});
  const needsByMissionHubFocused:[number,typeof topNeeds][]=[0,1,2,3,4,5].map(mi=>[mi,focusedNeeds.filter(n=>(needIdToMission[n.id]??0)===mi)]);
  const t={...copy[language],successText:copy[language].successTextUpdated,negativeTitle:copy[language].formTitleUpdated,negativeText:copy[language].formTextUpdated,postponeTitle:copy[language].asIsTitleUpdated,postponeText:copy[language].asIsTextUpdated,impact:copy[language].impactUpdated}; const name=profile==="marco"?"Marco Rossi":"Luisa Bianchi";
  const displayCompanyName=companyName.trim()||( language==="it"?"La tua azienda":"Your company");
  const sec=SECTORS[companySector];
  const dimVal=companyDims[0]; const opsVal=companyDims[1]; const peopleVal=companyDims[4];
  const dimUnit=language==="it"?sec.dimUnit.it:sec.dimUnit.en;
  const opsUnit=language==="it"?sec.opsUnit.it:sec.opsUnit.en;
  const sectorLabel=language==="it"?sec.label.it:sec.label.en;
  const dynamicCompanyFacts=`${sectorLabel} · ${dimVal} ${dimUnit} · ${opsVal} ${opsUnit} · ${peopleVal.toLocaleString()} ${language==="it"?"dipendenti":"employees"}`;
  useEffect(()=>{localStorage.removeItem("envizi-quest-roadmap");localStorage.removeItem("envizi-quest-mission-order");localStorage.removeItem("envizi-quest-mission-parameters");localStorage.removeItem("envizi-quest-trust-score");localStorage.removeItem("envizi-quest-priorities");localStorage.removeItem("envizi-quest-profile");localStorage.removeItem("envizi-quest-mission");},[]);
  const setScreen=(next:Screen)=>{if(next===screen)return;setScreenHistory(history=>[...history,screen]);setScreenState(next)};
  const goBack=()=>{if(!screenHistory.length)return;setScreenState(screenHistory[screenHistory.length-1]);setScreenHistory(screenHistory.slice(0,-1))};
  const start=()=>{if(!profile)return;localStorage.setItem("envizi-quest-profile",JSON.stringify({language,profile}));setScreen("chapterMap")};
  const reset=()=>{setScreenState("onboarding");setScreenHistory([]);setProfile(null);setTrustScore(30);localStorage.removeItem("envizi-quest-trust-score")};
  useEffect(()=>{let button=document.getElementById("envizi-global-back") as HTMLButtonElement|null;if(!button){button=document.createElement("button");button.id="envizi-global-back";button.className="globalBack";button.type="button";document.body.appendChild(button)}button.innerHTML=`← <span>${language==="it"?"Indietro":"Back"}</span>`;button.disabled=!screenHistory.length;button.setAttribute("aria-label",language==="it"?"Torna alla pagina precedente":"Go back one page");const handleBack=()=>goBack();button.addEventListener("click",handleBack);return()=>button?.removeEventListener("click",handleBack)},[language,screenHistory]);
  useEffect(()=>()=>{document.getElementById("envizi-global-back")?.remove()},[]);
  const currentPageNum=ALL_SCREENS.indexOf(screen)+1||1;
  useEffect(()=>{let el=document.getElementById("envizi-page-num");if(!el){el=document.createElement("div");el.id="envizi-page-num";el.className="pageNum";document.body.appendChild(el)}el.textContent=`${String(currentPageNum).padStart(2,"0")} · ${screen}`;el.style.display="flex";},[screen,currentPageNum]);
  useEffect(()=>()=>{document.getElementById("envizi-page-num")?.remove()},[]);

  // autosave silenzioso a ogni cambio di screen (solo se la quest ha un nome)
  useEffect(()=>{if(questName.trim())saveQuest(questName.trim());},[screen]);

  const [saveBtnOpen,setSaveBtnOpen]=useState(false);
  const [p10SlideIdx,setP10SlideIdx]=useState(0);
  const P10_SLIDES_IT=["./p10-slide-1.png","./p10-slide-2.png","./p10-slide-3.png","./p10-slide-4.png","./p10-slide-5.png","./p10-slide-6.png","./p10-slide-7.png"];
  const P10_SLIDES_EN=["./p10-slide-en-1.png","./p10-slide-en-2.png","./p10-slide-en-3.png","./p10-slide-en-4.png","./p10-slide-en-5.png","./p10-slide-en-6.png","./p10-slide-en-7.png"];
  const P10_SLIDES=language==="it"?P10_SLIDES_IT:P10_SLIDES_EN;
  const [reportSlideIdx,setReportSlideIdx]=useState(0);
  const [pngCacheBust,setPngCacheBust]=useState(()=>Date.now());
  const [reportSlideCount,setReportSlideCount]=useState(7);
  const REPORT_SLIDES=Array.from({length:reportSlideCount},(_,i)=>`./report-slide-${i+1}.png`);
  const REPORT_SLIDES_BUSTED=REPORT_SLIDES.map(s=>`${s}?v=${pngCacheBust}`);
  // 0 = mostra Sì/No iniziale  1 = mostra Sicuro?  2 = confermato definitivamente
  const [reportingPath,setReportingPath]=useState<0|1|2|3|4|5>(0);
  const [csrdConfirmStep,setCsrdConfirmStep]=useState<0|1|2>(0);
  const [csrdPendingChoice,setCsrdPendingChoice]=useState<boolean>(false); // true=soggetta, false=non soggetta
  const [csrdNote,setCsrdNote]=useState("");
  const [csrdNoteOpen,setCsrdNoteOpen]=useState(false);
  const [csrdNoteDraft,setCsrdNoteDraft]=useState("");
  const [prioExpMode,setPrioExpMode]=useState<"scratch"|"scenario">("scratch");
  const [saveBtnName,setSaveBtnName]=useState(questName);
  // Sincronizza il nome con questName ogni volta che questName cambia (es. dopo load)
  useEffect(()=>{ setSaveBtnName(questName); },[questName]);
  const renderSaveBtn=(_isIt:boolean)=>null; // mantenuto per compatibilità — l'overlay è globale

  // Overlay globale save — div fisso su document.body, fuori dal root scalato
  // Viene montato/aggiornato via useEffect ogni volta che lo stato cambia
  useEffect(()=>{
    if(!profile) return;
    let container=document.getElementById("envizi-save-overlay");
    if(!container){
      container=document.createElement("div");
      container.id="envizi-save-overlay";
      document.body.appendChild(container);
    }
    const root=(container as any).__saveRoot||(()=>{
      const r=ReactDOM.createRoot(container!);
      (container as any).__saveRoot=r;
      return r;
    })();
    root.render(
      <div className="globalSaveOverlay">
        {!saveBtnOpen
          ? <button className="globalSaveTrigger" onClick={()=>{setSaveBtnName(questName||"");setSaveBtnOpen(true);}}>Save</button>
          : <div className="globalSaveBox">
              <input
                className="globalSaveInput"
                type="text"
                maxLength={20}
                size={8}
                value={saveBtnName}
                onChange={e=>setSaveBtnName(e.target.value.slice(0,20))}
                onKeyDown={e=>{if(e.key==="Enter"&&saveBtnName.trim()){saveQuest(saveBtnName);setQuestName(saveBtnName);setSaveBtnOpen(false);}if(e.key==="Escape")setSaveBtnOpen(false);}}
                autoFocus
              />
              <button className="globalSaveConfirm" disabled={!saveBtnName.trim()} onClick={()=>{saveQuest(saveBtnName);setQuestName(saveBtnName);setSaveBtnOpen(false);}}>Save</button>
              <button className="globalSaveCancel" onClick={()=>setSaveBtnOpen(false)}>✕</button>
            </div>
        }
      </div>
    );
    return ()=>{};
  },[profile,saveBtnOpen,saveBtnName,questName]);

  // Journey panel — ref stabili per evitare closure stale nel root separato
  const journeyActionsRef=useRef({setJourneyOpen,setScreenState});
  useEffect(()=>{journeyActionsRef.current={setJourneyOpen,setScreenState};},[setJourneyOpen,setScreenState]);

  useEffect(()=>{
    let container=document.getElementById("envizi-journey-panel");
    if(!container){
      container=document.createElement("div");
      container.id="envizi-journey-panel";
      document.body.appendChild(container);
    }
    const root=(container as any).__journeyRoot||(()=>{
      const r=ReactDOM.createRoot(container!);
      (container as any).__journeyRoot=r;
      return r;
    })();
    if(!journeyOpen){root.render(<></>);return;}
    const close=()=>journeyActionsRef.current.setJourneyOpen(false);
    const go=(s:Screen)=>{journeyActionsRef.current.setJourneyOpen(false);journeyActionsRef.current.setScreenState(s);};
    root.render(
      <div style={{position:"fixed",inset:0,zIndex:199998,background:"rgba(7,18,15,.88)",display:"flex",alignItems:"flex-start",justifyContent:"flex-end"}} onClick={close}>
        <div style={{background:"#0d1f19",border:"1px solid rgba(57,239,180,.22)",borderRadius:"0 0 0 14px",padding:"16px 0",width:"320px",height:"100vh",overflowY:"auto",boxShadow:"-8px 0 40px rgba(0,0,0,.5)"}} onClick={e=>e.stopPropagation()}>
          <div style={{display:"flex",justifyContent:"space-between",alignItems:"center",padding:"0 18px 8px"}}>
            <span style={{fontSize:"11px",fontFamily:"var(--font-geist-mono,monospace)",letterSpacing:".14em",textTransform:"uppercase",color:"#39efb4",opacity:.7}}>Journey</span>
            <button style={{background:"none",border:"none",color:"#39efb4",cursor:"pointer",fontSize:"16px"}} onClick={close}>✕</button>
          </div>
          {ALL_SCREENS.map((s,i)=>(
            <button key={s} onClick={()=>go(s)} style={{display:"flex",alignItems:"center",gap:"10px",width:"100%",padding:"7px 18px",background:"none",border:"none",cursor:"pointer",textAlign:"left",color:s===screen?"#39efb4":"#b5c9c1",fontFamily:"var(--font-geist-mono,monospace)",fontSize:"12px",letterSpacing:".04em",borderLeft:s===screen?"3px solid #39efb4":"3px solid transparent",transition:".1s"}}>
              <span style={{opacity:.5,minWidth:"22px"}}>{String(i+1).padStart(2,"0")}</span>
              <span>{s}</span>
            </button>
          ))}
        </div>
      </div>
    );
  },[journeyOpen,screen]);

  // Rimuovi overlay quando il profilo viene rimosso (reset)
  useEffect(()=>{
    if(!profile){
      const c=document.getElementById("envizi-save-overlay");
      if(c){(c as any).__saveRoot?.unmount?.();c.remove();}
    }
  },[profile]);
  const move=(index:number,direction:-1|1)=>{const next=[...priorities];const target=index+direction;if(target<0||target>=next.length)return;[next[index],next[target]]=[next[target],next[index]];setPriorities(next)};
  const saveOutcome=(outcome:Outcome)=>{const next={...missionOutcomes,[selectedMission]:outcome};setMissionOutcomes(next);localStorage.setItem("envizi-quest-roadmap",JSON.stringify(next))};
  const moveMission=(position:number,direction:-1|1)=>{const target=position+direction;if(target<0||target>=missionOrder.length)return;const next=[...missionOrder];[next[position],next[target]]=[next[target],next[position]];setMissionOrder(next);localStorage.setItem("envizi-quest-mission-order",JSON.stringify(next))};
  // Ricalcola missionOrder quando si entra in roadmapPreview:
  // Data Foundation (0) sempre prima, le altre 5 ordinate per somma R+C decrescente
  useEffect(()=>{
    if(screen!=="roadmapPreview") return;
    const scoreByMission:Record<number,number>={};
    [1,2,3,4,5].forEach(mi=>{
      const needs=dataNeeds.filter(n=>isNeedIncluded(n.id)&&(needIdToMission[n.id]??0)===mi);
      scoreByMission[mi]=needs.reduce((sum,n)=>{
        const rel=Math.min(needRelevance[n.id]??5,10);
        const crit=needCriticality[n.id]??5;
        return sum+rel+crit;
      },0);
    });
    const sorted=[1,2,3,4,5].sort((a,b)=>scoreByMission[b]-scoreByMission[a]);
    const next=[0,...sorted];
    setMissionOrder(next);
    localStorage.setItem("envizi-quest-mission-order",JSON.stringify(next));
  },[screen]);
  const updateParameter=(index:number,value:string)=>{const values=[...(missionParameters[selectedMission]||["","","",""])];values[index]=value;const next={...missionParameters,[selectedMission]:values};setMissionParameters(next);localStorage.setItem("envizi-quest-mission-parameters",JSON.stringify(next))};
  const extractMetricDefault=(metric:string):string=>{const m=metric.replace(/[€,]/g,"").match(/[\d]+(?:[.,]\d+)?/);return m?m[0].replace(",","."):"";};
  useEffect(()=>{if(screen==="asis"&&!missionParameters[selectedMission]?.some(v=>v)){const items=active.asIsItems;const defaults=items.map(item=>extractMetricDefault(item.metric));const next={...missionParameters,[selectedMission]:defaults};setMissionParameters(next);}},[screen,selectedMission]);
  const trustGainByOutcome=(outcome:Outcome,missionIndex?:number)=>{if(missionIndex===0&&outcome==="positive")return 25;return outcome==="positive"?15:outcome==="warning"?7:0;};
  const calculatedTrustScore=Object.entries(missionOutcomes).reduce((total,[mi,o])=>total+trustGainByOutcome(o as Outcome,Number(mi)),30);
  const trustColor=trustScore>=50?"#39efb4":trustScore>=20?"#ffc07c":"#ff7777";
  const renderTrustBar=()=><div className="trustBar"><span className="trustBarLabel">{t.trustLabel}</span><div className="trustBarTrack"><div className="trustBarFill" style={{width:`${trustScore}%`,background:trustColor}}/></div><span className="trustBarValue" style={{color:trustColor}}>{trustScore}<small>/100</small></span></div>;
  const handleDecision=(outcome:Outcome)=>{const nextOutcomes={...missionOutcomes,[selectedMission]:outcome};saveOutcome(outcome);const nextTrust=Math.min(100,Object.entries(nextOutcomes).reduce((total,[mi,o])=>total+trustGainByOutcome(o as Outcome,Number(mi)),30));setTrustScore(nextTrust);localStorage.setItem("envizi-quest-trust-score",String(nextTrust));if(outcome!=="positive")setNegativeChoice(outcome==="warning"?"form":"postpone");setPendingOutcome(outcome);setScreenHistory(["compare"]);setScreenState("trust")};
  const energy=energyModule[language];
  const supply=supplyChainModule[language];
  const reporting=reportingModule[language];
  const planning=planningModule[language];
  const framework=frameworkModule[language];
  const scenario=selectedMission===1?energy:selectedMission===2?supply:selectedMission===3?reporting:selectedMission===4?planning:selectedMission===5?framework:null;
  const active={briefing:scenario?.briefing||t.briefing,objectiveText:scenario?.objectiveText||t.objectiveText,asIsTitle:scenario?.asIsTitle||t.asIsTitle,asIsIntro:scenario?.asIsIntro||t.asIsIntro,asIsItems:scenario?.asIsItems||t.asIsItems,decisionIntro:scenario?.decisionIntro||t.decisionIntro,optionA:scenario?.optionA||t.optionA,optionADetail:scenario?.optionADetail||t.optionADetail,optionB:scenario?.optionB||t.optionB,optionBDetail:scenario?.optionBDetail||t.optionBDetail,optionC:scenario?.optionC||t.optionC,optionCDetail:scenario?.optionCDetail||t.optionCDetail,successTitle:scenario?.successTitle||t.successTitle,successText:scenario?.successText||t.successText,warningTitle:scenario?.warningTitle||t.negativeTitle,warningText:scenario?.warningText||t.negativeText,criticalTitle:scenario?.criticalTitle||t.postponeTitle,criticalText:scenario?.criticalText||t.postponeText,metricLabels:scenario?.metricLabels||[t.dataQuality,t.reportingTime,t.confidence],enviziValue:selectedMission===1?(language==="it"?"VALORE ENVIZI SBLOCCATO · ENERGY ANALYTICS":"ENVIZI VALUE UNLOCKED · ENERGY ANALYTICS"):selectedMission===2?supply.enviziValue:selectedMission===3?reporting.enviziValue:selectedMission===4?planning.enviziValue:selectedMission===5?framework.enviziValue:t.enviziValue};
  const defaultUnits=language==="it"?["fonti","ore/mese","% errori","settimane"]:["sources","hrs/month","% errors","weeks"];
  const parameterUnits=scenario?.units||defaultUnits;
  const resultValues=scenario?(screen==="success"?scenario.positiveValues:negativeChoice==="form"?scenario.warningValues:scenario.criticalValues):screen==="success"?["+34%","−62%","92/100"]:negativeChoice==="form"?["+8%","−12%","58/100"]:language==="it"?["INVARIATA","INVARIATO","BASSA · INVARIATA"]:["UNCHANGED","UNCHANGED","LOW · UNCHANGED"];
  const decisionLabel=(missionIndex:number,outcome:Outcome)=>missionIndex===1?energy.decisionLabels[outcome]:missionIndex===2?supply.decisionLabels[outcome]:missionIndex===3?reporting.decisionLabels[outcome]:missionIndex===4?planning.decisionLabels[outcome]:missionIndex===5?framework.decisionLabels[outcome]:t.decisionLabels[outcome];
  const outcomeLabel=(missionIndex:number,outcome:Outcome)=>missionIndex===1?energy.outcomeLabels[outcome]:missionIndex===2?supply.outcomeLabels[outcome]:missionIndex===3?reporting.outcomeLabels[outcome]:missionIndex===4?planning.outcomeLabels[outcome]:missionIndex===5?framework.outcomeLabels[outcome]:t.outcomeLabels[outcome];
  const missionItems=(missionIndex:number)=>missionIndex===1?energy.asIsItems:missionIndex===2?supply.asIsItems:missionIndex===3?reporting.asIsItems:missionIndex===4?planning.asIsItems:missionIndex===5?framework.asIsItems:t.asIsItems;
  const missionUnits=(missionIndex:number)=>missionIndex===1?energy.units:missionIndex===2?supply.units:missionIndex===3?reporting.units:missionIndex===4?planning.units:missionIndex===5?framework.units:defaultUnits;
  type TrustIntroEntry={it:string,en:string,sources?:{label:string,url:string}[]};
  const trustIntroByMission:Record<number,TrustIntroEntry>={
    0:{it:"Una base dati auditabile è il fondamento della credibilità ESG. Il CdA e i finanziatori valutano la solidità del dato prima ancora dei numeri: un sistema verificabile trasforma le dichiarazioni in evidenza.",en:"An auditable data foundation is the bedrock of ESG credibility. The Board and financiers assess data integrity before the numbers themselves: a verifiable system turns declarations into evidence."},
    1:{it:"L'energy management è la prova tangibile che l'azienda sta investendo attivamente nella decarbonizzazione. Per il CdA, i dati energetici strutturati dimostrano al contempo impegno climatico e disciplina sui costi operativi.",en:"Energy management is tangible proof that the company is actively investing in decarbonisation. For the Board, structured energy data simultaneously demonstrates climate commitment and operational cost discipline."},
    2:{it:"La copertura dello Scope 3 e il coinvolgimento della supply chain sono oggi indicatori chiave per investitori e clienti. Un inventario credibile della catena del valore segnala governance responsabile e riduce il rischio reputazionale.",en:"Scope 3 coverage and supply-chain engagement are now key indicators for investors and customers. A credible value-chain inventory signals responsible governance and reduces reputational risk."},
    3:{
      it:"Un inventario GHG coerente, trasparente e tracciabile aumenta la fiducia nei dati presentati a CdA, banche, clienti e auditor. La possibilità di confrontare Scope 1, 2 e 3 nel tempo, individuare gli hotspot emissivi e risalire dalle dashboard ai dati e alle metodologie sottostanti rende le performance ESG più comprensibili e difendibili.\n\nAl contrario, report ricostruiti manualmente, KPI non confrontabili e viste diverse tra i vari stakeholder generano dubbi sulla qualità delle informazioni e sulla capacità dell'azienda di governare concretamente i propri obiettivi climatici.",
      en:"A consistent, transparent and traceable GHG inventory increases confidence in the data presented to the Board, banks, clients and auditors. The ability to compare Scope 1, 2 and 3 over time, identify emission hotspots and trace back from dashboards to the underlying data and methodologies makes ESG performance more understandable and defensible.\n\nConversely, manually reconstructed reports, non-comparable KPIs and different views for different stakeholders raise doubts about data quality and the company's ability to concretely govern its climate objectives.",
      sources:[
        {label:"GHG Protocol — Corporate Standard",url:"https://ghgprotocol.org/corporate-standard"},
        {label:"GHG Protocol — Corporate Value Chain Scope 3 Standard",url:"https://ghgprotocol.org/scope-3-standard"}
      ]
    },
    4:{it:"La pianificazione della decarbonizzazione dimostra che l'azienda non si limita a misurare le emissioni, ma lavora per ridurle nel tempo. Scenari quantificati e programmi verificabili sono la prova concreta dell'impegno verso Net Zero.",en:"Decarbonisation planning demonstrates that the company is not merely measuring emissions but working to reduce them over time. Quantified scenarios and verifiable programmes are concrete proof of the commitment to Net Zero."},
    5:{it:"Allineare la disclosure ai framework normativi — CSRD, ESRS, GRI, SASB, CDP — è oggi un requisito di mercato oltre che legale. Un processo governato e tracciabile dimostra che l'azienda non si limita a dichiarare la propria sostenibilità, ma la documenta in modo verificabile.",en:"Aligning disclosure with regulatory frameworks — CSRD, ESRS, GRI, SASB, CDP — is today both a market and legal requirement. A governed, traceable process demonstrates that the company does not merely declare its sustainability but documents it in a verifiable way."}
  };
  const activeTrustEntry=trustIntroByMission[selectedMission]??{it:t.trustIntro,en:t.trustIntro};
  const activeTrustIntro=activeTrustEntry[language];
  const activeTrustSources=activeTrustEntry.sources;
  const TRUST_BAR_W=52,TRUST_BAR_GAP=14,TRUST_CHART_H=110,TRUST_LABEL_H=36,TRUST_SVG_PAD_X=8;
  const trustSteps=([
    {label:'BASE',val:30,isCurrent:false,fill:'#293f38',stroke:'#3d6052',strokeW:'1'},
    ...missionOrder.map((mi,pos)=>{
      const outcome=missionOutcomes[mi]??null;
      const isCurrent=mi===selectedMission;
      let cum=30;for(let p=0;p<=pos;p++){const o=missionOutcomes[missionOrder[p]];if(o)cum=Math.min(100,cum+trustGainByOutcome(o,missionOrder[p]));}
      const chartLabels:{it:string,en:string}[]=[{it:"Fabbrica\ndati",en:"Data\nfactory"},{it:"Energia",en:"Energy"},{it:"Supply\nchain",en:"Supply\nchain"},{it:"Reporting",en:"Reporting"},{it:"Net\nZero",en:"Net\nZero"},{it:"Framework\nESG",en:"ESG\nFramework"}];
      const lbl=language==='it'?chartLabels[mi].it:chartLabels[mi].en;
      const fill=outcome===null?'none':outcome==='positive'?'#39efb4':outcome==='warning'?'#ffc07c':'#ff7777';
      const stroke=outcome===null?'#2e4d41':isCurrent?(outcome==='positive'?'#8affda':outcome==='warning'?'#ffd09c':'#ff9b9b'):(outcome==='positive'?'#39efb4':outcome==='warning'?'#ffc07c':'#ff7777');
      return{label:lbl,val:(outcome!==null?cum:null),isCurrent,fill,stroke,strokeW:isCurrent?'2':'1'};
    })
  ]);
  const trustTotalW=trustSteps.length*(TRUST_BAR_W+TRUST_BAR_GAP)-TRUST_BAR_GAP+TRUST_SVG_PAD_X*2;

  if(screen==="intro"&&profile)return <main className="introScreen" style={{position:"relative"}}>{introZoomWarn&&<div style={{position:"fixed",inset:0,zIndex:99999,background:"rgba(7,18,15,.82)",display:"flex",alignItems:"center",justifyContent:"center"}} onClick={()=>setIntroZoomWarn(false)}><div style={{background:"#0d1f19",border:"1px solid rgba(57,239,180,.3)",borderRadius:"14px",padding:"28px 32px",maxWidth:"380px",width:"90vw",textAlign:"center",boxShadow:"0 8px 40px rgba(0,0,0,.6)"}} onClick={e=>e.stopPropagation()}><p style={{margin:"0 0 8px",fontSize:"13px",fontFamily:"var(--font-geist-mono,monospace)",letterSpacing:".14em",textTransform:"uppercase",color:"#39efb4"}}>{language==="it"?"Attenzione":"Warning"}</p><p style={{margin:"0 0 20px",fontSize:"15px",color:"#e8f5ef",lineHeight:1.5}}>{language==="it"?"Il rapporto di visualizzazione è ottimizzato per questa schermata. Sei sicuro di voler cambiare lo zoom?":"The display ratio is optimised for this screen. Are you sure you want to change the zoom?"}</p><div style={{display:"flex",gap:"10px",justifyContent:"center"}}><button style={{padding:"8px 22px",borderRadius:"8px",border:"1px solid rgba(57,239,180,.35)",background:"transparent",color:"#39efb4",fontSize:"14px",cursor:"pointer",fontFamily:"inherit"}} onClick={()=>setIntroZoomWarn(false)}>{language==="it"?"Annulla":"Cancel"}</button><button style={{padding:"8px 22px",borderRadius:"8px",border:"1px solid #c84040",background:"rgba(200,64,64,.12)",color:"#ff8080",fontSize:"14px",cursor:"pointer",fontFamily:"inherit"}} onClick={dismissZoom}>{language==="it"?"Continua comunque":"Continue anyway"}</button></div></div></div>}<div className="welcomeBlueBar"/><header className="missionNav"><button className="brand brandButton" onClick={reset}><span className="brandMark">e·</span><span>Envizi<br/>Impact Quest</span></button><div className="missionProgress"><span className="activeDot"/> YOUR CHALLENGE</div><div className="introNavRight"><button className="langMini" onClick={()=>setLanguage(language==="it"?"en":"it")}>{language==="it"?"EN":"IT"}</button></div></header><section className="characterStage"><img src={`./characters/${profile}-neutral.png`} alt={name}/><div className="characterTag characterTagRaised"><span className="statusDot"/><div><small>ESG MANAGER</small><strong>{name}</strong></div></div></section><section className="introBody"><p className="eyebrow">{t.introKicker}</p><h1>{t.introTitle}</h1><p className="storyText">{t.introBody}</p><div className="introTrustBox"><p className="introScoreLabel">{t.introScoreLabel}</p>{renderTrustBar()}</div><div style={{marginTop:"18px"}}><p className="eyebrow" style={{letterSpacing:".18em",fontSize:"11px",marginBottom:"8px"}}>{language==="it"?"BADGE SBLOCCATO":"BADGE UNLOCKED"}</p><img src="./immagine/badge/badge-esg-study.svg" alt="ESG Study badge" style={{maxWidth:"420px",width:"100%",height:"auto",display:"block",margin:0}}/></div><div className="introCtaRow"><button className="actionButton questLaunchBtn" onClick={()=>setScreen("separatorNext")}>{t.introStart}<b>→</b><span className="mouseDemo questMouse" aria-hidden="true"><img src="./hand-pointer.svg" alt=""/></span></button></div></section><div className="welcomeBlueBar" style={{background:"#39efb4"}}/></main>;

  if(screen==="approach")return <main className="approachScreen" style={{position:"relative"}}>{approachZoomWarn&&<div style={{position:"fixed",inset:0,zIndex:99999,background:"rgba(7,18,15,.82)",display:"flex",alignItems:"center",justifyContent:"center"}} onClick={()=>setApproachZoomWarn(false)}><div style={{background:"#0d1f19",border:"1px solid rgba(57,239,180,.3)",borderRadius:"14px",padding:"28px 32px",maxWidth:"380px",width:"90vw",textAlign:"center",boxShadow:"0 8px 40px rgba(0,0,0,.6)"}} onClick={e=>e.stopPropagation()}><p style={{margin:"0 0 8px",fontSize:"13px",fontFamily:"var(--font-geist-mono,monospace)",letterSpacing:".14em",textTransform:"uppercase",color:"#39efb4"}}>{language==="it"?"Attenzione":"Warning"}</p><p style={{margin:"0 0 20px",fontSize:"15px",color:"#e8f5ef",lineHeight:1.5}}>{language==="it"?"Il rapporto di visualizzazione è ottimizzato per questa schermata. Sei sicuro di voler cambiare lo zoom?":"The display ratio is optimised for this screen. Are you sure you want to change the zoom?"}</p><div style={{display:"flex",gap:"10px",justifyContent:"center"}}><button style={{padding:"8px 22px",borderRadius:"8px",border:"1px solid rgba(57,239,180,.35)",background:"transparent",color:"#39efb4",fontSize:"14px",cursor:"pointer",fontFamily:"inherit"}} onClick={()=>setApproachZoomWarn(false)}>{language==="it"?"Annulla":"Cancel"}</button><button style={{padding:"8px 22px",borderRadius:"8px",border:"1px solid #c84040",background:"rgba(200,64,64,.12)",color:"#ff8080",fontSize:"14px",cursor:"pointer",fontFamily:"inherit"}} onClick={dismissZoom}>{language==="it"?"Continua comunque":"Continue anyway"}</button></div></div></div>}<div className="welcomeBlueBar"/><header className="missionNav"><button className="brand brandButton" onClick={reset}><span className="brandMark">e·</span><span>Envizi<br/>Impact Quest</span></button><div className="missionProgress"><span className="activeDot"/> PEOPLE & DATA</div><div className="introNavRight"><button className="introBackBtn" onClick={()=>goBack()}>← {language==="it"?"Indietro":"Back"}</button><button className="langMini" onClick={()=>setLanguage(language==="it"?"en":"it")}>{language==="it"?"EN":"IT"}</button></div></header><section className="approachBody"><div className="approachTopTitle"><h1>{t.approachTitle}</h1></div><div className="approachLeft approachVisual"><div className="approachPeopleIntro"><small className="approachSectionLabel">{language==="it"?"FILONE 01 · PERSONE":"TRACK 01 · PEOPLE"}</small><h2>{language==="it"?"agire sul cambiamento con le persone: coinvolgimento, formazione, responsabilizzazione":"acting on change with people: engagement, training, accountability"}</h2></div><img className="approachTeamImage" src="./approach-team-scene.png" alt={language==="it"?"Team ESG che discute una dashboard di sostenibilità":"ESG team discussing a sustainability dashboard"}/></div><div className="approachRight"><div className="approachDataIntro"><small className="approachSectionLabel">{language==="it"?"FILONE 02 · DATI":"TRACK 02 · DATA"}</small><h2>{language==="it"?"agire sulla complessità di oltre 500 tipi di dati ESG, energia, gas, acqua, rifiuti, social...":"acting on the complexity of 500+ ESG data types: energy, gas, water, waste, social..."}</h2></div><img className="approachDataImage" src="./approach-data-scene.png" alt={language==="it"?"Dashboard e dati ESG":"ESG data dashboard"}/></div><div className="approachBottomAction"><p className="approachRoleTitle">{language==="it"?"Il ruolo di una piattaforma ESG reporting e performance management":"The role of an ESG reporting and performance management platform"}</p><div className="approachKeywordsRow"><div className="approachKwBox"><small className="approachSectionLabel">{language==="it"?"FILONE 01 · PERSONE":"TRACK 01 · PEOPLE"}</small><div className="approachKwList"><span>User Interface</span><span>AI User Assistant</span><span>Documentazione utente</span><span>Materiale Formazione</span></div></div><div className="approachKwBox"><small className="approachSectionLabel">{language==="it"?"FILONE 02 · DATI":"TRACK 02 · DATA"}</small><div className="approachKwList"><span>ESG Data Foundation</span><span>ESG Reporting</span><span>Tracciabilità del dato</span><span>Automazione e Integrazione</span><span>Analytics</span><span>Sicurezza</span><span>Aggiornamenti Compliance</span></div></div></div><button className="actionButton" onClick={()=>setScreen("approachIntro")}>{t.approachQuestCta}</button></div></section><div className="welcomeBlueBar" style={{background:"#39efb4"}}/></main>;

  const CHAPTER_MAP_ITEMS:{labelIt:string,labelEn:string,screen:Screen,icon:string}[]=[
    {labelIt:"① Introduzione",labelEn:"① Introduction",screen:"sectionIntro1",icon:"①"},
    {labelIt:"Introduzione al Quest",labelEn:"Introduction to the Quest",screen:"questIntro",icon:"01"},
    {labelIt:"La presentazione Envizi",labelEn:"Envizi Presentation",screen:"blank1",icon:"02"},
    {labelIt:"② Obiettivi azienda",labelEn:"② Company objectives",screen:"sectionIntro2",icon:"②"},
    {labelIt:"Dalle priorità alle decisioni",labelEn:"From priorities to decisions",screen:"approachIntro",icon:"03"},
    {labelIt:"Profilo azienda",labelEn:"Company profile",screen:"companySetup",icon:"04"},
    {labelIt:"Priorità ESG",labelEn:"ESG Priorities",screen:"priorities",icon:"05"},
    {labelIt:"③ Sfide di dati",labelEn:"③ Data challenges",screen:"sectionIntro3",icon:"③"},
    {labelIt:"Mappa dei dati",labelEn:"Data map",screen:"priorityData",icon:"06"},
    {labelIt:"Mission Hub",labelEn:"Mission Hub",screen:"roadmapPreview",icon:"07"},
    {labelIt:"Missione 01 · Data Foundation",labelEn:"Mission 01 · Data Foundation",screen:"challengeSeparator1",icon:"M1"},
    {labelIt:"Missione 02 · Energy",labelEn:"Mission 02 · Energy",screen:"challengeSeparator2",icon:"M2"},
    {labelIt:"Missione 03 · Supply Chain",labelEn:"Mission 03 · Supply Chain",screen:"challengeSeparator3",icon:"M3"},
    {labelIt:"Missione 04 · Reporting",labelEn:"Mission 04 · Reporting",screen:"challengeSeparator4",icon:"M4"},
    {labelIt:"Missione 05 · Net Zero",labelEn:"Mission 05 · Net Zero",screen:"challengeSeparator5",icon:"M5"},
    {labelIt:"Missione 06 · Frameworks",labelEn:"Mission 06 · Frameworks",screen:"challengeSeparator6",icon:"M6"},
    {labelIt:"✓ Prossimi passi",labelEn:"✓ Next steps",screen:"sectionOutro",icon:"✓"},
    {labelIt:"Riepilogo finale",labelEn:"Final summary",screen:"summary",icon:"≡"},
  ];
  if(screen==="chapterMap")return <ChapterMap language={language} profile={profile} setLanguage={setLanguage} setScreen={setScreen} reset={reset} goBack={goBack} renderTrustBar={renderTrustBar} name={name} missionOrder={missionOrder} missionOutcomes={missionOutcomes} trustScore={calculatedTrustScore}/>;

  // ── SLIDE DI TRANSIZIONE SEZIONI ──────────────────────────────────────────
  if(screen==="sectionIntro1"&&profile)return <SectionIntroSlide language={language} profile={profile} setLanguage={setLanguage} setScreen={setScreen} reset={reset} goBack={goBack} renderTrustBar={renderTrustBar} num={1} labelIt="Introduzione" labelEn="Introduction" titleIt="Il percorso Envizi Quest" titleEn="The Envizi Quest journey" subIt="Come funziona, cosa scoprirai e come costruire la tua roadmap ESG" subEn="How it works, what you'll discover and how to build your ESG roadmap" nextScreen="questIntro" frozen/>;

  if(screen==="sectionIntro2"&&profile)return <SectionIntroSlide language={language} profile={profile} setLanguage={setLanguage} setScreen={setScreen} reset={reset} goBack={goBack} renderTrustBar={renderTrustBar} num={2} labelIt="Obiettivi e dati" labelEn="Objectives and data" titleIt="Partiamo dagli obiettivi della tua azienda" titleEn="Let's start from your company's objectives" subIt="Priorità di business ESG e profilo aziendale" subEn="ESG business priorities and company profile" nextScreen="companySetup" frozen/>;

  if(screen==="sectionIntro3"&&profile)return <SectionIntroSlide language={language} profile={profile} setLanguage={setLanguage} setScreen={setScreen} reset={reset} goBack={goBack} renderTrustBar={renderTrustBar} num={3} labelIt="Sfide di dati" labelEn="Data challenges" titleIt="Il secondo filone è agire sulle sfide di dati" titleEn="The second track is acting on data challenges" subIt="Esigenze, criticità e matrice di priorità" subEn="Needs, criticalities and priority matrix" nextScreen="approachDataCopy"/>;

  if(screen==="sectionOutro"&&profile)return <SectionIntroSlide language={language} profile={profile} setLanguage={setLanguage} setScreen={setScreen} reset={reset} goBack={goBack} renderTrustBar={renderTrustBar} num={"✓" as any} labelIt="Prossimi passi" labelEn="Next steps" titleIt="Porta i tuoi risultati al livello successivo" titleEn="Take your results to the next level" subIt="Demo, Proof of Concept e Business Value Assessment" subEn="Demo, Proof of Concept and Business Value Assessment" nextScreen="nextStep"/>;

  if(screen==="questIntro"&&profile)return <QuestIntro language={language} profile={profile} setLanguage={setLanguage} setScreen={setScreen} reset={reset} goBack={goBack} renderTrustBar={renderTrustBar} name={name}/>;


  if(screen==="blank1")return <Blank1 language={language} profile={profile} setLanguage={setLanguage} setScreen={setScreen} reset={reset} goBack={goBack} renderTrustBar={renderTrustBar} p10SlideIdx={p10SlideIdx} setP10SlideIdx={setP10SlideIdx} P10_SLIDES={P10_SLIDES}/>;

  if(screen==="p10Slideshow"&&profile)return <P10Slideshow language={language} profile={profile} setLanguage={setLanguage} setScreen={setScreen} reset={reset} goBack={goBack} renderTrustBar={renderTrustBar} p10SlideIdx={p10SlideIdx} setP10SlideIdx={setP10SlideIdx} P10_SLIDES={P10_SLIDES}/>;


  if(screen==="approachIntro"&&profile)return <ApproachIntro language={language} profile={profile} setLanguage={setLanguage} setScreen={setScreen} reset={reset} goBack={goBack} renderTrustBar={renderTrustBar} t={t}/>;
  if(screen==="approachReport"&&profile)return <ApproachReport language={language} profile={profile} setLanguage={setLanguage} setScreen={setScreen} reset={reset} goBack={goBack} renderTrustBar={renderTrustBar} t={t}/>;
  if(screen==="separatorNext"&&profile)return <main className="questIntroScreen" style={{position:"relative"}}>{separatorNextZoomWarn&&<div style={{position:"fixed",inset:0,zIndex:99999,background:"rgba(7,18,15,.82)",display:"flex",alignItems:"center",justifyContent:"center"}} onClick={()=>setSeparatorNextZoomWarn(false)}><div style={{background:"#0d1f19",border:"1px solid rgba(57,239,180,.3)",borderRadius:"14px",padding:"28px 32px",maxWidth:"380px",width:"90vw",textAlign:"center",boxShadow:"0 8px 40px rgba(0,0,0,.6)"}} onClick={e=>e.stopPropagation()}><p style={{margin:"0 0 8px",fontSize:"13px",fontFamily:"var(--font-geist-mono,monospace)",letterSpacing:".14em",textTransform:"uppercase",color:"#39efb4"}}>{language==="it"?"Attenzione":"Warning"}</p><p style={{margin:"0 0 20px",fontSize:"15px",color:"#e8f5ef",lineHeight:1.5}}>{language==="it"?"Il rapporto di visualizzazione è ottimizzato per questa schermata. Sei sicuro di voler cambiare lo zoom?":"The display ratio is optimised for this screen. Are you sure you want to change the zoom?"}</p><div style={{display:"flex",gap:"10px",justifyContent:"center"}}><button style={{padding:"8px 22px",borderRadius:"8px",border:"1px solid rgba(57,239,180,.35)",background:"transparent",color:"#39efb4",fontSize:"14px",cursor:"pointer",fontFamily:"inherit"}} onClick={()=>setSeparatorNextZoomWarn(false)}>{language==="it"?"Annulla":"Cancel"}</button><button style={{padding:"8px 22px",borderRadius:"8px",border:"1px solid #c84040",background:"rgba(200,64,64,.12)",color:"#ff8080",fontSize:"14px",cursor:"pointer",fontFamily:"inherit"}} onClick={dismissZoom}>{language==="it"?"Continua comunque":"Continue anyway"}</button></div></div></div>}<div className="welcomeBlueBar"/><header className="missionNav missionNavTrust"><button className="brand brandButton" onClick={reset}><span className="brandMark">e·</span><span>Envizi<br/>Impact Quest</span></button><div className="missionProgress"><span className="activeDot"/> LA QUEST</div>{renderTrustBar()}<div className="introNavRight"><button className="langMini" onClick={()=>setLanguage(language==="it"?"en":"it")}>{language==="it"?"EN":"IT"}</button></div></header><section className="questIntroBody"><img src={`./characters/${profile}-neutral.png`} className="questIntroProfileImg" alt={name}/><h1 className="questIntroTitle">{language==="it"?"Partiamo dalla tua azienda":"Let's start from your company"}</h1><button className="actionButton questIntroCta" onClick={()=>setScreen("companySetup")}>{t.questIntroCta}<b>→</b></button></section><div className="welcomeBlueBar" style={{background:"#39efb4"}}/></main>;
  if(screen==="approachStepsCopy"&&profile)return <main className="approachIntroScreen" style={{position:"relative"}}>{approachStepsCopyZoomWarn&&<div style={{position:"fixed",inset:0,zIndex:99999,background:"rgba(7,18,15,.82)",display:"flex",alignItems:"center",justifyContent:"center"}} onClick={()=>setApproachStepsCopyZoomWarn(false)}><div style={{background:"#0d1f19",border:"1px solid rgba(57,239,180,.3)",borderRadius:"14px",padding:"28px 32px",maxWidth:"380px",width:"90vw",textAlign:"center",boxShadow:"0 8px 40px rgba(0,0,0,.6)"}} onClick={e=>e.stopPropagation()}><p style={{margin:"0 0 8px",fontSize:"13px",fontFamily:"var(--font-geist-mono,monospace)",letterSpacing:".14em",textTransform:"uppercase",color:"#39efb4"}}>{language==="it"?"Attenzione":"Warning"}</p><p style={{margin:"0 0 20px",fontSize:"15px",color:"#e8f5ef",lineHeight:1.5}}>{language==="it"?"Il rapporto di visualizzazione è ottimizzato per questa schermata. Sei sicuro di voler cambiare lo zoom?":"The display ratio is optimised for this screen. Are you sure you want to change the zoom?"}</p><div style={{display:"flex",gap:"10px",justifyContent:"center"}}><button style={{padding:"8px 22px",borderRadius:"8px",border:"1px solid rgba(57,239,180,.35)",background:"transparent",color:"#39efb4",fontSize:"14px",cursor:"pointer",fontFamily:"inherit"}} onClick={()=>setApproachStepsCopyZoomWarn(false)}>{language==="it"?"Annulla":"Cancel"}</button><button style={{padding:"8px 22px",borderRadius:"8px",border:"1px solid #c84040",background:"rgba(200,64,64,.12)",color:"#ff8080",fontSize:"14px",cursor:"pointer",fontFamily:"inherit"}} onClick={dismissZoom}>{language==="it"?"Continua comunque":"Continue anyway"}</button></div></div></div>}<div className="welcomeBlueBar"/><header className="missionNav"><button className="brand brandButton" onClick={reset}><span className="brandMark">e·</span><span>Envizi<br/>Impact Quest</span></button><div className="missionProgress"><span className="activeDot"/> IL PERCORSO</div><div className="introNavRight"><button className="introBackBtn" onClick={()=>goBack()}>← {language==="it"?"Indietro":"Back"}</button><button className="langMini" onClick={()=>setLanguage(language==="it"?"en":"it")}>{language==="it"?"EN":"IT"}</button></div></header><section className="approachIntroBody approachIntroBodyWithImg"><div className="approachIntroLeft"><h1 className="approachIntroTitle">{t.approachStepsTitle}</h1><div className="approachIntroText">{(t.approachStepsBody as string[]).map((para,i)=><p key={i}>{para}</p>)}</div></div><div className="approachIntroRight"><img src="./step-1.svg" className="approachIntroStepBadge" alt="Step 1"/><img src="./logica-obiettivi.png" className="approachIntroImg" alt="Obiettivi di business ESG"/><p className="approachIntroImgCaption approachIntroImgCaptionSm">{t.approachStepsExample as string}</p><button className="actionButton approachIntroCta" onClick={()=>setScreen("priorities")}>{t.approachStepsCta}<b>→</b></button></div></section><div className="welcomeBlueBar" style={{background:"#39efb4"}}/></main>;

  const renderMissionHub=(isPreview=false)=>{const completed=Object.keys(missionOutcomes).length;const foundationDone=!!missionOutcomes[0];const hubNeeds=isPreview?needsByMissionHubFocused:needsByMissionHub;return <main className="missionMenuScreen"><header className="missionNav missionNavTrust"><button className="brand brandButton" onClick={reset}><span className="brandMark">e·</span><span>Envizi<br/>Impact Quest</span></button><div className="missionProgress"><span className="activeDot"/> MISSION HUB</div>{renderTrustBar()}<button className="langMini" onClick={()=>setLanguage(language==="it"?"en":"it")}>{language==="it"?"EN":"IT"}</button></header><section className="missionMenuIntro"><div><p className="eyebrow">{t.roadmapKicker}</p><h1>{t.roadmapTitle}</h1><p>{t.roadmapIntro}</p><div className="roadmapProgress"><span style={{width:`${completed*(100/6)}%`}}/><b>{t.roadmapProgress}: {completed}/6</b></div>{isPreview&&<button className="actionButton rpPreviewCta" onClick={()=>setScreen("challengeSeparator1")}>{language==="it"?"Avanti →":"Next →"}</button>}{isPreview&&<div className="needsTierLegend"><span style={{color:"#ff4d4d"}}>⬡ {language==="it"?"Alta":"High"}</span><span style={{color:"#7dd3fc"}}>⬡ {language==="it"?"Media":"Medium"}</span><span style={{color:"#9ca3af"}}>⬡ {language==="it"?"Bassa":"Low"}</span></div>}{!isPreview&&<button className="actionButton rpPreviewCta" style={{marginTop:"12px"}} onClick={()=>setScreen("dataFoundation")}>{language==="it"?"Avanti →":"Next →"}</button>}{!isPreview&&completed===6&&<button className="summaryCta" onClick={()=>setScreen("summary")}>{t.summaryCta}<b>→</b></button>}</div><div className="priorityPersona"><img src={`./characters/${profile}-neutral.png`} alt={name}/><span>{name}<small>ESG MANAGER</small></span></div></section><section className="missionCards roadmapCards">{missionOrder.map((missionIndex,position)=>{const m=missionCatalog[missionIndex];const outcome=missionOutcomes[missionIndex];const isLocked=!isPreview&&(!foundationDone&&missionIndex!==0);const isStartHere=!isPreview&&!foundationDone&&missionIndex===0;return <article key={m.value} className={`missionCard ${missionIndex===0?"missionCardFoundation":""} ${outcome?`completed ${outcome}`:""}${isLocked?" missionCardLocked":""}`}><button className="missionCardOpen" disabled={isLocked||isPreview} onClick={()=>{if(isLocked||isPreview)return;setSelectedMission(missionIndex);localStorage.setItem("envizi-quest-mission",String(missionIndex+1));setScreen("briefing")}}>{(()=>{const raw=hubNeeds.find(([mi])=>mi===missionIndex)?.[1]||[];const needs=missionIndex===0?[{id:"__foundation__",label:language==="it"?"Una data foundation solida e tracciabile":"A solid and traceable data foundation"},...raw]:raw;const needsLabel=language==="it"?"Esigenze specifiche":"Specific needs";const legendHigh=language==="it"?"Alta":"High";const legendMid=language==="it"?"Media":"Medium";const legendLow=language==="it"?"Bassa":"Low";return <><div className="missionCardChallengeBox"><div className="missionCardTop"><span>{String(position+1).padStart(2,"0")}</span><i>{outcome?"✓":m.icon}</i></div><h2>{language==="it"?m.it:m.en}</h2></div><div className="missionCardNeedsBox"><small className="missionCardNeedsLabel">{needsLabel}</small>{needs.length>0?needs.map(n=>{const prioIdx=priorities.indexOf((n as any).priority);const relMax=prioIdx===0?10:prioIdx===1?8:prioIdx===2?6:4;const rel=Math.min(needRelevance[n.id]??Math.round(relMax/2),relMax);const relNorm=Math.round((rel/relMax)*10);const crit=needCriticality[n.id]??5;const cap=needIdToCapability[n.id];const capLabel=cap?(language==="it"?cap.it:cap.en):null;const tier=relNorm>7&&crit>7?"red":relNorm>4&&relNorm<=7&&crit>4&&crit<=7?"yellow":relNorm>4||crit>4?"yellow":"green";const tierColor=tier==="red"?"#ff4d4d":tier==="yellow"?"#7dd3fc":"#9ca3af";return <span key={n.id} className="missionCardNeed"><span className="missionCardNeedHeader"><b className="missionCardNeedRank" style={{color:tierColor}}>{("rank" in n)?String((n as any).rank).padStart(2,"0"):""}</b><b className="missionCardNeedName" style={{color:tierColor}}>⬡ {n.label}</b><span className="missionCardNeedRC" style={{color:tierColor}}>R:{relNorm} C:{crit}</span></span>{capLabel&&<span className="missionCardNeedCap" style={{color:tierColor,opacity:.8}}>{capLabel}</span>}</span>}):<span className="missionCardNeed">—</span>}</div></>;})()}{isLocked&&<div className="missionCardLockedOverlay"><span>⊘</span><small>{t.missionLocked}</small></div>}{isStartHere&&<div className="missionCardStartHere"><span>{t.missionStartHere}</span><b>→</b></div>}{outcome&&<div className="missionImpact"><div><small>{t.adoptedDecision}</small><strong>{decisionLabel(missionIndex,outcome)}</strong></div><div><small>{t.expectedImpact}</small><p>{outcomeLabel(missionIndex,outcome)}</p></div></div>}<div className="missionCardBottom"><small>{outcome?`${position+1}/5 · ROADMAP`:isLocked?"🔒":""}</small><b>{outcome?t.missionReview:""}</b></div>{isLocked&&<div style={{position:"absolute",inset:0,borderRadius:"inherit",background:"rgba(7,18,15,0.82)",display:"flex",flexDirection:"column",alignItems:"center",justifyContent:"center",gap:"8px",padding:"16px",textAlign:"center",pointerEvents:"none",zIndex:5}}><span style={{fontSize:"22px"}}>🔒</span><p style={{margin:0,fontSize:"clamp(11px,0.9vw,13px)",color:"#b5c9c1",lineHeight:1.4,fontWeight:500}}>{language==="it"?"Completa prima la sfida Data Foundation: è il prerequisito abilitante per tutte le missioni operative.":"Complete the Data Foundation challenge first: it is the enabling prerequisite for all operational missions."}</p></div>}</button></article>})}</section></main>};

  if(screen==="roadmapPreview"&&profile)return renderMissionHub(true);

  // ── buildPptxData — riutilizzato da ilTuoReport e chapterOneSummary ─────────
  const buildPptxData=(isIt:boolean)=>{
    const sec2=SECTORS[companySector];
    const sectorLabel2=isIt?sec2.label.it:sec2.label.en;
    const readinessList2=isIt?ESG_READINESS_IT:ESG_READINESS_EN;
    const activeReadiness2=readinessList2.find(r=>r.key===esgReadiness)!;
    const isCsrd2=companyDims[4]>=1000&&companyDims[0]>=450;
    const includedPrios2=priorities.filter(p=>priorityIncluded[p]);
    const top72=dataNeeds.filter(n=>isNeedIncluded(n.id)).map(n=>{
      const rel=needRelevance[n.id]??5;
      const crit=needCriticality[n.id]??5;
      const tier=rel>7&&crit>7?"high":rel>4||crit>4?"medium":"low";
      return{...n,rel,crit,score:rel+crit,tier};
    }).sort((a,b)=>b.score-a.score).slice(0,7);
    const prioDescIt2=(()=>{
      const names=includedPrios2.map(p=>(t.priorityNames as Record<Priority,string>)[p]);
      if(names.length===0)return"Non sono stati selezionati obiettivi per l'analisi.";
      const topName=names[0];const restNames=names.slice(1);const company=companyName.trim()||questName.trim()||displayCompanyName;
      const matLabel=activeReadiness2.label.split("—")[0].trim();
      let txt=`${company} ha definito ${names.length} obiettiv${names.length>1?"i":"o"} prioritari${names.length>1?"":"o"} per la propria strategia ESG. `;
      txt+=`In particolare, la priorità principale è <strong>${topName}</strong>`;
      if(restNames.length>0)txt+=`, seguita da ${restNames.slice(0,-1).join(", ")}${restNames.length>1?" e ":""}<strong>${restNames[restNames.length-1]}</strong>`;
      txt+=`. Il livello di maturità attuale — <em>${matLabel}</em> — indica che ${activeReadiness2.desc.charAt(0).toLowerCase()+activeReadiness2.desc.slice(1)}`;
      return txt;
    })();
    const prioDescEn2=(()=>{
      const names=includedPrios2.map(p=>(t.priorityNames as Record<Priority,string>)[p]);
      if(names.length===0)return"No objectives were selected for the analysis.";
      const topName=names[0];const restNames=names.slice(1);const company=companyName.trim()||questName.trim()||displayCompanyName;
      const matLabel=activeReadiness2.label.split("—")[0].trim().replace("–","—").split("—")[0].trim();
      let txt=`${company} has defined ${names.length} priority objective${names.length>1?"s":""} for its ESG strategy. `;
      txt+=`The main priority is <strong>${topName}</strong>`;
      if(restNames.length>0)txt+=`, followed by ${restNames.slice(0,-1).join(", ")}${restNames.length>1?" and ":""}<strong>${restNames[restNames.length-1]}</strong>`;
      txt+=`. The current maturity level — <em>${matLabel}</em> — means that ${activeReadiness2.desc.charAt(0).toLowerCase()+activeReadiness2.desc.slice(1)}`;
      return txt;
    })();
    return {
      companyName:companyName.trim()||questName.trim()||displayCompanyName,
      sectorLabel:sectorLabel2,
      marketLabel:isIt?(companyMarket==="italia"?"Solo Italia":companyMarket==="europa"?"Europa":"Globale"):(companyMarket==="italia"?"Italy only":companyMarket==="europa"?"Europe":"Global"),
      revenue:companyDims[0],dimUnit:isIt?sec2.dimUnit.it:sec2.dimUnit.en,
      employees:companyDims[4],plants:companyDims[1],offices:companyDims[2],dataCenters:companyDims[3],
      maturityTitle:activeReadiness2.label,maturityDesc:activeReadiness2.desc,
      csrdLabel:isCsrd2?(isIt?"Soggetta a CSRD":"Subject to CSRD"):(isIt?"Indicativamente non soggetta a CSRD":"Indicatively not subject to CSRD"),
      csrdSub:isCsrd2?(isIt?"Oltre 1.000 dipendenti e €450M di fatturato":"Over 1,000 employees and €450M revenue"):(isIt?"(dipendenti < 1.000 e fatturato < €450M)":"(employees < 1,000 and revenue < €450M)"),
      csrdNote:csrdNote||"",
      prioIntroText:isIt?prioDescIt2:prioDescEn2,
      prioItems:includedPrios2.map((p,i)=>({rank:i+1,name:(t.priorityNames as Record<Priority,string>)[p],detail:(t.priorityDetails as Record<Priority,string>)[p],note:prioExperience[p]||undefined})).sort((a,b)=>a.rank-b.rank),
      critItems:top72.map((n,i)=>({rank:i+1,label:n.label,priority:(t.priorityNames as Record<Priority,string>)[n.priority],rel:n.rel,crit:n.crit,tier:n.tier,needId:n.id})),
      isIt,geoDistrib,siteTable,workshopDate,consultantName,companyLogo,participantRole,participantCompany,businessUnit,reportingPath,
      needCapabilities:needIdToCapability,
      frameworkChecks,
      revenueYear,
      sustainabilityReportSince,
    };
  };

  if(screen==="reportSlideshow"&&profile){
    const rd:ReportData=buildPptxData(language==="it");
    return <ReportSlideshow language={language} profile={profile} setLanguage={setLanguage} setScreen={setScreen} reset={reset} goBack={goBack} renderTrustBar={renderTrustBar} data={rd}/>;
  }

  if(screen==="reportSlideshowPng"&&profile)return <P10Slideshow language={language} profile={profile} setLanguage={setLanguage} setScreen={setScreen} reset={reset} goBack={goBack} renderTrustBar={renderTrustBar} p10SlideIdx={reportSlideIdx} setP10SlideIdx={setReportSlideIdx} P10_SLIDES={REPORT_SLIDES_BUSTED} backScreen="ilTuoReport"/>;

  const refreshAndViewReport=async(lang:"it"|"en")=>{
    // In produzione (GitHub Pages) non c'è il backend soffice/pdftoppm —
    // apriamo direttamente lo slideshow con le slide statiche già presenti.
    const isProd=import.meta.env.PROD;
    if(isProd){setPngCacheBust(Date.now());setReportSlideIdx(0);return;}
    const buf=await generateTemplatePptxBuffer(buildPptxData(lang==="it"));
    // btoa(String.fromCharCode(...spread)) crasha con file >~1MB — usiamo chunks
    const bytes=new Uint8Array(buf);
    let b64="";
    const CHUNK=8192;
    for(let i=0;i<bytes.length;i+=CHUNK){
      b64+=String.fromCharCode(...bytes.subarray(i,i+CHUNK));
    }
    const pptxBase64=btoa(b64);
    const res=await fetch("/api/refresh-report",{method:"POST",headers:{"Content-Type":"application/json"},body:JSON.stringify({pptxBase64})});
    if(!res.ok){const j=await res.json().catch(()=>({}));throw new Error(j.error||"Server error");}
    const j=await res.json();
    // aggiorna conteggio slide, cache-buster e resetta indice
    if(j.count&&j.count>0)setReportSlideCount(j.count);
    setPngCacheBust(Date.now());
    setReportSlideIdx(0);
  };

  if(screen==="ilTuoReport"&&profile)return <IlTuoReport language={language} profile={profile} setLanguage={setLanguage} setScreen={setScreen} reset={reset} goBack={goBack} renderTrustBar={renderTrustBar} p10SlideIdx={p10SlideIdx} setP10SlideIdx={setP10SlideIdx} P10_SLIDES={P10_SLIDES} onDownloadPptx={(lang)=>generateTemplatePptx(buildPptxData(lang==="it"))} onRefreshAndView={refreshAndViewReport}/>;

  if(screen==="chapterOneSummary"&&profile){
    const isIt=language==="it";
    const pptxData=buildPptxData(isIt);
    return <main style={{display:"flex",flexDirection:"column",height:"1080px",background:"var(--bg)",overflow:"hidden",position:"relative"}}>
      <div style={{position:"absolute",top:0,left:0,right:0,height:"4px",background:"#3b82f4",zIndex:100}}/>
      <header className="missionNav">
        <button className="brand brandButton" onClick={reset}><span className="brandMark">e·</span><span>Envizi<br/>Impact Quest</span></button>
        <div className="missionProgress"><span className="activeDot"/> {isIt?"IL TUO REPORT INIZIALE":"YOUR INITIAL REPORT"}</div>
        <button className="langMini" onClick={()=>setLanguage(language==="it"?"en":"it")}>{language==="it"?"EN":"IT"}</button>
      </header>
      <section style={{display:"flex",flexDirection:"column",alignItems:"center",gap:"12px",padding:"12px 0 20px",width:"100%",flex:1,minHeight:0}}>
        <div style={{position:"relative",width:"100%",flex:1,minHeight:0,display:"flex",alignItems:"center",justifyContent:"center"}}>
          <img src="./logica-report-finale.png" alt={isIt?"Anteprima report":"Report preview"} style={{width:"100%",height:"100%",objectFit:"contain",display:"block"}}/>
        </div>
        <div style={{display:"flex",alignItems:"center",gap:"16px",marginTop:"4px",flexShrink:0}}>
          <button className="actionButton" onClick={()=>generateTemplatePptx(pptxData)}>↓ {isIt?"Scarica Report":"Download Report"}</button>
          <button className="actionButton" onClick={()=>setScreen("esgStrategist")}>{isIt?"Avanti →":"Next →"}</button>
        </div>
      </section>
      <div style={{position:"absolute",bottom:0,left:0,right:0,height:"4px",background:"#3b82f4",zIndex:100}}/>
    </main>;
  }

  if(screen==="esgStrategist"&&profile){
    const isIt=language==="it";
    // La matrice è stata compilata se almeno un need ha un valore di rilevanza o criticità impostato
    const matrixDone=Object.keys(needRelevance).length>0||Object.keys(needCriticality).length>0;
    // Al primo render con matrice compilata, sblocca e aggiungi +10 una sola volta
    if(matrixDone&&!esgStrategistUnlocked){
      setEsgStrategistUnlocked(true);
      const next=Math.min(100,trustScore+10);
      setTrustScore(next);
      localStorage.setItem("envizi-quest-trust-score",String(next));
    }
    const trustColor=trustScore>=50?"#39efb4":trustScore>=20?"#ffc07c":"#ff7777";
    return <main className="esgStrScreen" style={{position:"relative"}}>
      {esgStrategistZoomWarn&&<div style={{position:"fixed",inset:0,zIndex:99999,background:"rgba(7,18,15,.82)",display:"flex",alignItems:"center",justifyContent:"center"}} onClick={()=>setEsgStrategistZoomWarn(false)}><div style={{background:"#0d1f19",border:"1px solid rgba(57,239,180,.3)",borderRadius:"14px",padding:"28px 32px",maxWidth:"380px",width:"90vw",textAlign:"center",boxShadow:"0 8px 40px rgba(0,0,0,.6)"}} onClick={e=>e.stopPropagation()}><p style={{margin:"0 0 8px",fontSize:"13px",fontFamily:"var(--font-geist-mono,monospace)",letterSpacing:".14em",textTransform:"uppercase",color:"#39efb4"}}>{isIt?"Attenzione":"Warning"}</p><p style={{margin:"0 0 20px",fontSize:"15px",color:"#e8f5ef",lineHeight:1.5}}>{isIt?"Il rapporto di visualizzazione è ottimizzato per questa schermata. Sei sicuro di voler cambiare lo zoom?":"The display ratio is optimised for this screen. Are you sure you want to change the zoom?"}</p><div style={{display:"flex",gap:"10px",justifyContent:"center"}}><button style={{padding:"8px 22px",borderRadius:"8px",border:"1px solid rgba(57,239,180,.35)",background:"transparent",color:"#39efb4",fontSize:"14px",cursor:"pointer",fontFamily:"inherit"}} onClick={()=>setEsgStrategistZoomWarn(false)}>{isIt?"Annulla":"Cancel"}</button><button style={{padding:"8px 22px",borderRadius:"8px",border:"1px solid #c84040",background:"rgba(200,64,64,.12)",color:"#ff8080",fontSize:"14px",cursor:"pointer",fontFamily:"inherit"}} onClick={dismissZoom}>{isIt?"Continua comunque":"Continue anyway"}</button></div></div></div>}
      <div style={{position:"fixed",top:0,left:0,right:0,height:"4px",background:"#3b82f4",zIndex:9999,pointerEvents:"none"}}/>
      <div style={{position:"fixed",bottom:0,left:0,right:0,height:"4px",background:"#39efb4",zIndex:9999,pointerEvents:"none"}}/>
      <header className="missionNav missionNavTrust">
        <button className="brand brandButton" onClick={reset}><span className="brandMark">e·</span><span>Envizi<br/>Impact Quest</span></button>
        <div className="missionProgress"><span className="activeDot"/> ESG STRATEGIST</div>
        {renderTrustBar()}
        <button className="langMini" onClick={()=>setLanguage(language==="it"?"en":"it")}>{language==="it"?"EN":"IT"}</button>
      </header>
      <section className="esgStrBody">
        {/* colonna sinistra: foto profilo */}
        <div className="esgStrStage">
          <img src={`./characters/${profile}${matrixDone?"-success":"-neutral"}.png`} alt={name} className="esgStrProfileImg"/>
          <div className="esgStrPersonaTag">
            <span className="statusDot"/>
            <div><small>ESG MANAGER</small><strong>{name}</strong></div>
          </div>
        </div>
        {/* colonna destra: contenuto condizionale */}
        <div className="esgStrContent">
          {matrixDone?(
            <>
              <p className="eyebrow">{isIt?"LIVELLO SBLOCCATO":"LEVEL UNLOCKED"}</p>
              <img src="./immagine/badge/1.svg" alt="ESG Strategist badge" className="esgStrBadgeImg"/>
              <h1 className="esgStrTitle">{isIt?"Hai sbloccato il livello ESG Strategist!":"You've unlocked the ESG Strategist level!"}</h1>
              <p className="esgStrSub">{isIt?"Hai identificato le esigenze di dati chiave e costruito la tua matrice di priorità. Ora è il momento di trasformare l'analisi in sfide decisionali concrete.":"You have identified key data needs and built your priority matrix. Now it's time to turn the analysis into concrete decision challenges."}</p>
              <div className="esgStrTrustGain">
                <span className="esgStrTrustGainLabel">{isIt?"Punti fiducia":"Trust score"}</span>
                <div className="esgStrTrustBarWrap">
                  <div className="trustBar"><span className="trustBarLabel">{t.trustLabel}</span><div className="trustBarTrack"><div className="trustBarFill" style={{width:`${trustScore}%`,background:trustColor}}/></div><span className="trustBarValue" style={{color:trustColor}}>{trustScore}<small>/100</small></span></div>
                  <span className="esgStrTrustDelta">+10</span>
                </div>
              </div>
            </>
          ):(
            <>
              <p className="eyebrow">{isIt?"LIVELLO BLOCCATO":"LEVEL LOCKED"}</p>
              <div className="esgStrBadgeLocked">★ ESG STRATEGIST</div>
              <h1 className="esgStrTitle esgStrTitleLocked">{isIt?"Livello ESG Strategist non ancora sbloccato":"ESG Strategist level not yet unlocked"}</h1>
              <p className="esgStrSub">{isIt?"Per sbloccare il livello completa l'analisi nella sezione Priority Matrix.":"To unlock this level, complete the analysis in the Priority Matrix section."}</p>
              <div className="esgStrTrustGain">
                <span className="esgStrTrustGainLabel">{isIt?"Punti fiducia":"Trust score"}</span>
                <div className="esgStrTrustBarWrap">
                  <div className="trustBar"><span className="trustBarLabel">{t.trustLabel}</span><div className="trustBarTrack"><div className="trustBarFill" style={{width:`${trustScore}%`,background:trustColor}}/></div><span className="trustBarValue" style={{color:trustColor}}>{trustScore}<small>/100</small></span></div>
                </div>
              </div>
            </>
          )}
          <div className="esgStrActions">
            <button className="secondaryAction" onClick={()=>goBack()}>← {isIt?"Indietro":"Back"}</button>
            <button className="actionButton" onClick={()=>setScreen("roadmapPreview")}>{isIt?"Inizia le sfide →":"Start challenges →"}</button>
          </div>
          {renderSaveBtn(isIt)}
        </div>
      </section>
    </main>;
  }

  if(screen==="challengeSeparator1"&&profile)return <ChallengeSeparator1 language={language} profile={profile} setLanguage={setLanguage} setScreen={setScreen} reset={reset} goBack={goBack} renderTrustBar={renderTrustBar} missionIndex={missionOrder[0]}/>;

  if(screen==="missionCard1"&&profile)return <MissionCardScreen language={language} profile={profile} setLanguage={setLanguage} setScreen={setScreen} reset={reset} goBack={goBack} renderTrustBar={renderTrustBar} missionIndex={0} cardNum={1} backScreen="challengeSeparator1" needs={[...( needsByMissionHubFocused.find(([mi])=>mi===0)?.[1]||[]), {id:"__foundation__",label:language==="it"?"Una data foundation solida e tracciabile":"A solid and traceable data foundation"}]} priorities={priorities} needRelevance={needRelevance} needCriticality={needCriticality} needIdToCapability={needIdToCapability} setSelectedMission={setSelectedMission}/>;


  if(screen==="introCopy"&&profile)return <main className="introScreen"><header className="missionNav"><button className="brand brandButton" onClick={reset}><span className="brandMark">e·</span><span>Envizi<br/>Impact Quest</span></button><div className="missionProgress"><span className="activeDot"/> YOUR CHALLENGE</div><div className="introNavRight"><button className="introBackBtn" onClick={()=>goBack()}>← {language==="it"?"Indietro":"Back"}</button><button className="langMini" onClick={()=>setLanguage(language==="it"?"en":"it")}>{language==="it"?"EN":"IT"}</button></div></header><section className="characterStage"><img src={`./characters/${profile}-neutral.png`} alt={name}/><div className="characterTag characterTagRaised"><span className="statusDot"/><div><small>ESG MANAGER</small><strong>{name}</strong></div></div></section><section className="introBody"><p className="eyebrow">{t.introKicker}</p><h1>{t.introTitle}</h1><p className="storyText">{t.introBody}</p><div className="introTrustBar"><p className="introScoreLabel">{t.introScoreLabel}</p>{renderTrustBar()}</div><div className="introCtaRow"><button className="actionButton questLaunchBtn" onClick={()=>setScreen("roadmapPreview")}>{t.introStart}<b>→</b></button></div></section></main>;

  if(screen==="missions"&&profile){
    if(!!missionOutcomes[0])return renderMissionHub(false);
    const m0=missionCatalog[0];
    const questionBody=(t.mission0QuestionBody as string).replace("COMPANY_NAME",displayCompanyName);
    return <main className="mission0IntroScreen">
      <header className="missionNav missionNavTrust"><button className="brand brandButton" onClick={reset}><span className="brandMark">e·</span><span>Envizi<br/>Impact Quest</span></button><div className="missionProgress"><span className="activeDot"/> MISSION 01</div>{renderTrustBar()}<button className="langMini" onClick={()=>setLanguage(language==="it"?"en":"it")}>{language==="it"?"EN":"IT"}</button></header>
      <section className="m0iStage">
        <img src={`./characters/${profile}-neutral.png`} alt={name} className="m0iProfileImg"/>
        <div className="m0iPersonaTag"><span className="statusDot"/><div><small>ESG MANAGER</small><strong>{name}</strong></div></div>
      </section>
      <section className="m0iContent">
        <div className="m0iMissionBadge"><span>{m0.icon}</span><i>{language==="it"?"MISSIONE 01 · DATA FOUNDATION":"MISSION 01 · DATA FOUNDATION"}</i></div>
        <h1 className="m0iTitle">{language==="it"?m0.it:m0.en}</h1>
        <p className="m0iKicker">{t.mission0QuestionKicker}</p>
        <p className="m0iQuestion">{t.mission0Question}</p>
        <p className="m0iBody">{questionBody}</p>
        <button className="actionButton m0iCta" onClick={()=>{setSelectedMission(0);localStorage.setItem("envizi-quest-mission","1");setScreen("briefing");}}>{t.mission0Cta}<b>→</b></button>
      </section>
    </main>;
  }

  if(screen==="missionIntro"&&profile){const mid=t.missionIntroData[selectedMission]||t.missionIntroData[0];const mBody=(mid.body as string).replace("COMPANY_NAME",displayCompanyName);const activeMission=missionCatalog[selectedMission];return <main className="mission0IntroScreen"><header className="missionNav missionNavTrust"><button className="brand brandButton" onClick={reset}><span className="brandMark">e·</span><span>Envizi<br/>Impact Quest</span></button><div className="missionProgress"><span className="activeDot"/> {mid.eyebrow}</div>{renderTrustBar()}<div className="introNavRight"><button className="introBackBtn" onClick={()=>goBack()}>← {language==="it"?"Indietro":"Back"}</button><button className="langMini" onClick={()=>setLanguage(language==="it"?"en":"it")}>{language==="it"?"EN":"IT"}</button></div></header><section className="m0iStage"><img src={`./characters/${profile}-neutral.png`} alt={name} className="m0iProfileImg"/><div className="m0iPersonaTag"><span className="statusDot"/><div><small>ESG MANAGER</small><strong>{name}</strong></div></div></section><section className="m0iContent"><div className="m0iMissionBadge"><span>{activeMission.icon}</span><i>{mid.eyebrow}</i></div><h1 className="m0iTitle">{mid.title}</h1><p className="m0iKicker">{mid.kicker}</p><p className="m0iQuestion">{mid.question}</p><p className="m0iBody">{mBody}</p><button className="actionButton m0iCta" onClick={()=>setScreen("introCopy2")}>{mid.cta}<b>→</b></button></section></main>;}



  if(screen==="summary"&&profile)return <SummaryScreen language={language} setLanguage={setLanguage} setScreen={setScreen} reset={reset} goBack={goBack} renderTrustBar={renderTrustBar} priorities={priorities} priorityIncluded={priorityIncluded} missionOrder={missionOrder} missionOutcomes={missionOutcomes} needsByMissionHub={needsByMissionHub} calculatedTrustScore={calculatedTrustScore} decisionLabel={decisionLabel} outcomeLabel={outcomeLabel} t={t}/>;

  if(screen==="nextStep"&&profile)return <NextStepScreen language={language} profile={profile} setLanguage={setLanguage} setScreen={setScreen} reset={reset} goBack={goBack} renderTrustBar={renderTrustBar} priorities={priorities} missionOrder={missionOrder} missionOutcomes={missionOutcomes} missionParameters={missionParameters} trustScore={trustScore} contactEmail={contactEmail} setContactEmail={setContactEmail} approachBiz={approachBiz} approachData={approachData} decisionLabel={decisionLabel} missionItems={missionItems} missionUnits={missionUnits} renderSaveBtn={renderSaveBtn} t={t} name={name}/>;


  if(screen==="milestone"&&profile)return <MilestoneScreen language={language} profile={profile} setLanguage={setLanguage} setScreen={setScreen} reset={reset} goBack={goBack} renderTrustBar={renderTrustBar} missionOutcomes={missionOutcomes} renderSaveBtn={renderSaveBtn} name={name}/>;


  if(screen==="thankYou"&&profile)return <ThankYouScreen language={language} setLanguage={setLanguage} reset={reset} goBack={goBack} renderTrustBar={renderTrustBar} t={t}/>;



  // ── ENERGIA E DECARBONIZZAZIONE — Foundation + Conclusion ──────────────────
  if(screen==="challengeComplete1"&&profile)return <ChallengeComplete1 language={language} profile={profile} setLanguage={setLanguage} setScreen={setScreen} reset={reset} goBack={goBack} renderTrustBar={renderTrustBar}/>;
  // ── SEPARATORI E COMPLETAMENTI SFIDE 2-6 ──────────────────────────────────
  if(screen==="challengeSeparator2"&&profile)return <ChallengeSeparator2 language={language} profile={profile} setLanguage={setLanguage} setScreen={setScreen} reset={reset} goBack={goBack} renderTrustBar={renderTrustBar} missionIndex={missionOrder[1]}/>;
  if(screen==="missionCard2"&&profile)return <MissionCardScreen language={language} profile={profile} setLanguage={setLanguage} setScreen={setScreen} reset={reset} goBack={goBack} renderTrustBar={renderTrustBar} missionIndex={missionOrder[1]} cardNum={2} backScreen="challengeSeparator2" needs={needsByMissionHubFocused.find(([x])=>x===missionOrder[1])?.[1]||[]} priorities={priorities} needRelevance={needRelevance} needCriticality={needCriticality} needIdToCapability={needIdToCapability} setSelectedMission={setSelectedMission}/>;
  if(screen==="challengeComplete2"&&profile)return <ChallengeComplete2 language={language} profile={profile} setLanguage={setLanguage} setScreen={setScreen} reset={reset} goBack={goBack} renderTrustBar={renderTrustBar}/>;
  if(screen==="challengeSeparator3"&&profile)return <ChallengeSeparator3 language={language} profile={profile} setLanguage={setLanguage} setScreen={setScreen} reset={reset} goBack={goBack} renderTrustBar={renderTrustBar} missionIndex={missionOrder[2]}/>;
  if(screen==="missionCard3"&&profile)return <MissionCardScreen language={language} profile={profile} setLanguage={setLanguage} setScreen={setScreen} reset={reset} goBack={goBack} renderTrustBar={renderTrustBar} missionIndex={missionOrder[2]} cardNum={3} backScreen="challengeSeparator3" needs={needsByMissionHubFocused.find(([x])=>x===missionOrder[2])?.[1]||[]} priorities={priorities} needRelevance={needRelevance} needCriticality={needCriticality} needIdToCapability={needIdToCapability} setSelectedMission={setSelectedMission}/>;
  if(screen==="challengeComplete3"&&profile)return <ChallengeComplete3 language={language} profile={profile} setLanguage={setLanguage} setScreen={setScreen} reset={reset} goBack={goBack} renderTrustBar={renderTrustBar}/>;
  if(screen==="challengeSeparator4"&&profile)return <ChallengeSeparator4 language={language} profile={profile} setLanguage={setLanguage} setScreen={setScreen} reset={reset} goBack={goBack} renderTrustBar={renderTrustBar} missionIndex={missionOrder[3]}/>;
  if(screen==="missionCard4"&&profile)return <MissionCardScreen language={language} profile={profile} setLanguage={setLanguage} setScreen={setScreen} reset={reset} goBack={goBack} renderTrustBar={renderTrustBar} missionIndex={missionOrder[3]} cardNum={4} backScreen="challengeSeparator4" needs={needsByMissionHubFocused.find(([x])=>x===missionOrder[3])?.[1]||[]} priorities={priorities} needRelevance={needRelevance} needCriticality={needCriticality} needIdToCapability={needIdToCapability} setSelectedMission={setSelectedMission}/>;
  if(screen==="challengeComplete4"&&profile)return <ChallengeComplete4 language={language} profile={profile} setLanguage={setLanguage} setScreen={setScreen} reset={reset} goBack={goBack} renderTrustBar={renderTrustBar}/>;
  if(screen==="challengeSeparator5"&&profile)return <ChallengeSeparator5 language={language} profile={profile} setLanguage={setLanguage} setScreen={setScreen} reset={reset} goBack={goBack} renderTrustBar={renderTrustBar} missionIndex={missionOrder[4]}/>;
  if(screen==="missionCard5"&&profile)return <MissionCardScreen language={language} profile={profile} setLanguage={setLanguage} setScreen={setScreen} reset={reset} goBack={goBack} renderTrustBar={renderTrustBar} missionIndex={missionOrder[4]} cardNum={5} backScreen="challengeSeparator5" needs={needsByMissionHubFocused.find(([x])=>x===missionOrder[4])?.[1]||[]} priorities={priorities} needRelevance={needRelevance} needCriticality={needCriticality} needIdToCapability={needIdToCapability} setSelectedMission={setSelectedMission}/>;
  if(screen==="challengeComplete5"&&profile)return <ChallengeComplete5 language={language} profile={profile} setLanguage={setLanguage} setScreen={setScreen} reset={reset} goBack={goBack} renderTrustBar={renderTrustBar}/>;
  if(screen==="challengeSeparator6"&&profile)return <ChallengeSeparator6 language={language} profile={profile} setLanguage={setLanguage} setScreen={setScreen} reset={reset} goBack={goBack} renderTrustBar={renderTrustBar} missionIndex={missionOrder[5]}/>;
  if(screen==="missionCard6"&&profile)return <MissionCardScreen language={language} profile={profile} setLanguage={setLanguage} setScreen={setScreen} reset={reset} goBack={goBack} renderTrustBar={renderTrustBar} missionIndex={missionOrder[5]} cardNum={6} backScreen="challengeSeparator6" needs={needsByMissionHubFocused.find(([x])=>x===missionOrder[5])?.[1]||[]} priorities={priorities} needRelevance={needRelevance} needCriticality={needCriticality} needIdToCapability={needIdToCapability} setSelectedMission={setSelectedMission}/>;
  if(screen==="challengeComplete6"&&profile)return <ChallengeComplete6 language={language} profile={profile} setLanguage={setLanguage} setScreen={setScreen} reset={reset} goBack={goBack} renderTrustBar={renderTrustBar}/>;

  if(screen==="energyFoundation"&&profile)return <EnergyFoundationScreen language={language} profile={profile} setLanguage={setLanguage} setScreen={setScreen} reset={reset} goBack={goBack} renderTrustBar={renderTrustBar} efRatings={efRatings} setEfRating={setEfRating}/>;

  if(screen==="energyConclusion"&&profile)return <EnergyConclusionScreen language={language} profile={profile} setLanguage={setLanguage} setScreen={setScreen} reset={reset} goBack={goBack} renderTrustBar={renderTrustBar} efRatings={efRatings} missionOutcomes={missionOutcomes}/>;

  // ── COINVOLGIMENTO SUPPLY CHAIN — Foundation + Conclusion ───────────────────
  if(screen==="supplyFoundation"&&profile)return <SupplyFoundationScreen language={language} profile={profile} setLanguage={setLanguage} setScreen={setScreen} reset={reset} goBack={goBack} renderTrustBar={renderTrustBar} scRatings={scRatings} setScRating={setScRating}/>;

  if(screen==="supplyConclusion"&&profile)return <SupplyConclusionScreen language={language} profile={profile} setLanguage={setLanguage} setScreen={setScreen} reset={reset} goBack={goBack} renderTrustBar={renderTrustBar} scRatings={scRatings} missionOutcomes={missionOutcomes}/>;

  // ── ROTTA VERSO NET ZERO — Foundation + Conclusion ──────────────────────────
  if(screen==="planningFoundation"&&profile)return <PlanningFoundationScreen language={language} profile={profile} setLanguage={setLanguage} setScreen={setScreen} reset={reset} goBack={goBack} renderTrustBar={renderTrustBar} plRatings={plRatings} setPlRating={setPlRating}/>;

  if(screen==="planningConclusion"&&profile)return <PlanningConclusionScreen language={language} profile={profile} setLanguage={setLanguage} setScreen={setScreen} reset={reset} goBack={goBack} renderTrustBar={renderTrustBar} plRatings={plRatings} missionOutcomes={missionOutcomes}/>;

  // ── FRAMEWORK ESG E DISCLOSURE — Foundation + Conclusion ───────────────────
  if(screen==="frameworkFoundation"&&profile)return <FrameworkFoundationScreen language={language} profile={profile} setLanguage={setLanguage} setScreen={setScreen} reset={reset} goBack={goBack} renderTrustBar={renderTrustBar} frRatings={frRatings} setFrRating={setFrRating}/>;

  if(screen==="frameworkConclusion"&&profile)return <FrameworkConclusionScreen language={language} profile={profile} setLanguage={setLanguage} setScreen={setScreen} reset={reset} goBack={goBack} renderTrustBar={renderTrustBar} frRatings={frRatings} missionOutcomes={missionOutcomes}/>;


  if(screen==="reportingFoundation"&&profile)return <ReportingFoundationScreen language={language} profile={profile} setLanguage={setLanguage} setScreen={setScreen} reset={reset} goBack={goBack} renderTrustBar={renderTrustBar} rfRatings={rfRatings} setRfRating={setRfRating}/>;

  if(screen==="reportingConclusion"&&profile)return <ReportingConclusionScreen language={language} profile={profile} setLanguage={setLanguage} setScreen={setScreen} reset={reset} goBack={goBack} renderTrustBar={renderTrustBar} rfRatings={rfRatings} missionOutcomes={missionOutcomes}/>;


  if(screen==="dataFoundation"&&profile)return <DataFoundationScreen language={language} profile={profile} setLanguage={setLanguage} setScreen={setScreen} reset={reset} goBack={goBack} renderTrustBar={renderTrustBar} dfRatings={dfRatings} setDfRating={setDfRating}/>;


  if(screen==="dfConclusion"&&profile)return <DFConclusionScreen language={language} profile={profile} setLanguage={setLanguage} setScreen={setScreen} reset={reset} goBack={goBack} renderTrustBar={renderTrustBar} dfRatings={dfRatings} missionOutcomes={missionOutcomes} t={t}/>;






  if(screen==="companySetup"&&profile)return <CompanySetupScreen language={language} profile={profile} setLanguage={setLanguage} setScreen={setScreen} reset={reset} goBack={goBack} renderTrustBar={renderTrustBar} companyName={companyName} setCompanyName={setCompanyName} questName={questName} companySector={companySector} setCompanySector={setCompanySector} companyMarket={companyMarket} setCompanyMarket={setCompanyMarket} esgReadiness={esgReadiness} setEsgReadiness={setEsgReadiness} companyDims={companyDims} updateCompanyDim={updateCompanyDim} siteTable={siteTable} updateSiteCell={updateSiteCell} siteTotalAll={siteTotalAll} name={name} workshopDate={workshopDate} setWorkshopDate={setWorkshopDate} consultantName={consultantName} setConsultantName={setConsultantName} companyLogo={companyLogo} setCompanyLogo={setCompanyLogo} participantRole={participantRole} setParticipantRole={setParticipantRole} participantCompany={participantCompany} setParticipantCompany={setParticipantCompany} businessUnit={businessUnit} setBusinessUnit={setBusinessUnit} revenueYear={revenueYear} setRevenueYear={setRevenueYear} reportingPath={reportingPath} setReportingPath={setReportingPath}/>;


  if(screen==="company"&&profile)return <CompanyScreen language={language} profile={profile} setLanguage={setLanguage} setScreen={setScreen} reset={reset} goBack={goBack} renderTrustBar={renderTrustBar} companySector={companySector} companyMarket={companyMarket} esgReadiness={esgReadiness} companyDims={companyDims} updateCompanyDim={updateCompanyDim} geoDistrib={geoDistrib} siteTable={siteTable} displayCompanyName={displayCompanyName} csrdConfirmStep={csrdConfirmStep} setCsrdConfirmStep={setCsrdConfirmStep} csrdPendingChoice={csrdPendingChoice} setCsrdPendingChoice={setCsrdPendingChoice} csrdNote={csrdNote} setCsrdNote={setCsrdNote} csrdNoteOpen={csrdNoteOpen} setCsrdNoteOpen={setCsrdNoteOpen} csrdNoteDraft={csrdNoteDraft} setCsrdNoteDraft={setCsrdNoteDraft} t={t} name={name} companyName={companyName} companyLogo={companyLogo} reportingPath={reportingPath} setReportingPath={setReportingPath} questName={questName} onSave={(n)=>{saveQuest(n);setQuestName(n);}} renderSaveBtn={renderSaveBtn} nextScreen="company2" frameworkChecks={frameworkChecks} toggleFw={toggleFw} fwOpen={fwOpen} setFwOpen={setFwOpen} rptOpen={rptOpen} setRptOpen={setRptOpen} sustainabilityReportSince={sustainabilityReportSince} setSustainabilityReportSince={setSustainabilityReportSince} setEsgReadiness={setEsgReadiness}/>;
  if(screen==="company2"&&profile)return <CompanyScreen language={language} profile={profile} setLanguage={setLanguage} setScreen={setScreen} reset={reset} goBack={goBack} renderTrustBar={renderTrustBar} companySector={companySector} companyMarket={companyMarket} esgReadiness={esgReadiness} companyDims={companyDims} updateCompanyDim={updateCompanyDim} geoDistrib={geoDistrib} siteTable={siteTable} displayCompanyName={displayCompanyName} csrdConfirmStep={csrdConfirmStep} setCsrdConfirmStep={setCsrdConfirmStep} csrdPendingChoice={csrdPendingChoice} setCsrdPendingChoice={setCsrdPendingChoice} csrdNote={csrdNote} setCsrdNote={setCsrdNote} csrdNoteOpen={csrdNoteOpen} setCsrdNoteOpen={setCsrdNoteOpen} csrdNoteDraft={csrdNoteDraft} setCsrdNoteDraft={setCsrdNoteDraft} t={t} name={name} companyName={companyName} companyLogo={companyLogo} reportingPath={reportingPath} setReportingPath={setReportingPath} questName={questName} onSave={(n)=>{saveQuest(n);setQuestName(n);}} renderSaveBtn={renderSaveBtn} nextScreen="approachStepsCopy" showGeo frameworkChecks={frameworkChecks} toggleFw={toggleFw} fwOpen={fwOpen} setFwOpen={setFwOpen} rptOpen={rptOpen} setRptOpen={setRptOpen} sustainabilityReportSince={sustainabilityReportSince} setSustainabilityReportSince={setSustainabilityReportSince}/>;

  if(screen==="priorities"&&profile)return <PrioritiesScreen language={language} profile={profile} setLanguage={setLanguage} setScreen={setScreen} reset={reset} goBack={goBack} renderTrustBar={renderTrustBar} priorities={priorities} priorityIncluded={priorityIncluded} togglePriorityIncluded={togglePriorityIncluded} rankPriority={rankPriority} prioExperience={prioExperience} setPrioExpModal={setPrioExpModal} prioExpModal={prioExpModal} prioExpMode={prioExpMode} setPrioExpMode={setPrioExpMode} prioExpSelected={prioExpSelected} setPrioExpSelected={setPrioExpSelected} setPrioExperience={setPrioExperience} prioDefaultExp={prioDefaultExp} displayCompanyName={displayCompanyName} t={t} name={name} onSave={(n)=>{saveQuest(n);setQuestName(n);}} defaultSaveName={questName} skipDataCopyIntro={approachDataCopySeen}/>;

  if(screen==="approachDataCopy"&&profile){
    const goToData=()=>{
      setApproachDataCopySeen(true);
      // rimuove approachDataCopy dalla history così goBack non ci torna
      setScreenHistory(h=>h.filter(s=>s!=="approachDataCopy"));
      setScreenState("priorityData");
    };
    if(approachDataCopySeen){
      // navigazione programmatica pulita: non aggiunge nulla alla history
      setScreenHistory(h=>h.filter(s=>s!=="approachDataCopy"));
      setScreenState("priorities");
      return null;
    }
    return <ApproachDataCopyScreen language={language} profile={profile} setLanguage={setLanguage} setScreen={setScreen} reset={reset} goBack={goBack} renderTrustBar={renderTrustBar} t={t} onContinue={goToData}/>;
  }

  if(screen==="priorityData"&&profile){
    const goBackToPriorities=()=>{setScreenHistory(h=>h.filter(s=>s!=="approachDataCopy"&&s!=="priorityData"));setScreenState("priorities");};
    return <PriorityDataScreen language={language} profile={profile} setLanguage={setLanguage} setScreen={setScreen} reset={reset} goBack={goBackToPriorities} renderTrustBar={renderTrustBar} priorities={priorities} priorityIncluded={priorityIncluded} dataNeeds={dataNeeds} needRelevance={needRelevance} setNeedRelevance={setNeedRelevance} needCriticality={needCriticality} setNeedCriticality={setNeedCriticality} needIncluded={needIncluded} toggleNeedIncluded={toggleNeedIncluded} isNeedIncluded={isNeedIncluded} pdHelpOpen={pdHelpOpen} setPdHelpOpen={setPdHelpOpen} needIdToMission={needIdToMission} needIdToCapability={needIdToCapability} displayCompanyName={displayCompanyName} t={t} name={name} pdCustomLabels={pdCustomLabels} setPdCustomLabels={setPdCustomLabels} pdCustomMemos={pdCustomMemos} setPdCustomMemos={setPdCustomMemos}/>;
  }


  if(screen==="priorityMatrix"&&profile)return <PriorityMatrixScreen language={language} profile={profile} setLanguage={setLanguage} setScreen={setScreen} reset={reset} goBack={goBack} renderTrustBar={renderTrustBar} priorities={priorities} dataNeeds={dataNeeds} needRelevance={needRelevance} needCriticality={needCriticality} needIncluded={needIncluded} isNeedIncluded={isNeedIncluded} focusMinR={focusMinR} setFocusMinR={setFocusMinR} focusMinC={focusMinC} setFocusMinC={setFocusMinC} hoveredPriority={hoveredPriority} setHoveredPriority={setHoveredPriority} pmMissionFilter={pmMissionFilter} setPmMissionFilter={setPmMissionFilter} pmFromBriefing={pmFromBriefing} setPmFromBriefing={setPmFromBriefing} pmSelected={pmSelected} setPmSelected={setPmSelected} needIdToMission={needIdToMission} t={t}/>;


  if(screen==="bridge"&&profile){
    const top5=topNeeds;
    const missions=t.bridgeMissions as {num:string,label:string,need:string}[];
    // group top5 needs by destination mission (fallback → data foundation)
    const needsByMission:Record<number,typeof top5>=Object.fromEntries([0,1,2,3,4,5].map(i=>[i,[]]));
    top5.forEach((n,rank)=>{
      const mi=needIdToMission[n.id]??0;
      needsByMission[mi].push({...n,_rank:rank+1} as typeof top5[0] & {_rank:number});
    });
    return <main className="bridgeScreen">
      <header className="missionNav missionNavTrust">
        <button className="brand brandButton" onClick={reset}><span className="brandMark">e·</span><span>Envizi<br/>Impact Quest</span></button>
        <div className="missionProgress"><span className="activeDot"/> THE QUEST</div>
        {renderTrustBar()}
        <div className="introNavRight"><button className="introBackBtn" onClick={()=>goBack()}>← {language==="it"?"Indietro":"Back"}</button><button className="langMini" onClick={()=>setLanguage(language==="it"?"en":"it")}>{language==="it"?"EN":"IT"}</button></div>
      </header>
      <section className="bridgeIntroBar">
        <div>
          <p className="eyebrow">{t.bridgeKicker}</p>
          <h1>{t.bridgeTitle}</h1>
          <p className="bridgeIntroText">{t.bridgeIntro}</p>
        </div>
        <button className="actionButton bridgeCta" onClick={()=>setScreen("missions")}>{t.bridgeCta}<b>→</b></button>
      </section>
      <section className="bridgeMapping">
        {/* Riquadro prerequisito — missione 0 */}
        {(()=>{
          const m=missions[0];
          const assigned=(needsByMission[0]||[]) as (typeof top5[0] & {_rank:number})[];
          const hasNeeds=assigned.length>0;
          return <div className="bridgePrereqBlock">
            <div className="bridgeBlockLabel">{(t as any).bridgePrereqLabel}</div>
            <div className={`bridgeMapRow bridgeMapRowPrereq${hasNeeds?"":" bridgeMapRowEmpty"}`}>
              <div className="bridgeMapNeedsCol">
                {hasNeeds ? assigned.map(n=>(
                  <div key={n.id} className="bridgeMapNeed">
                    <span className="bridgeMapNeedRank">{String(n._rank).padStart(2,"0")}</span>
                    <div>
                      <small>{language==="it"?"LA TUA ESIGENZA":"YOUR DATA NEED"}</small>
                      <strong>{n.label}</strong>
                      <span className="bridgeMapNeedPrio">{t.priorityNames[n.priority]}</span>
                    </div>
                  </div>
                )) : (
                  <div className="bridgeMapNeedEmpty">
                    <span className="bridgeMapNeedEmptyDash">—</span>
                    <small>{language==="it"?"Nessuna esigenza prioritaria assegnata":"No priority need assigned"}</small>
                  </div>
                )}
              </div>
              <div className="bridgeMapConnector">
                <span className={`bridgeMapConnectorLine${hasNeeds?"":" empty"}`}/>
                <span className={`bridgeMapConnectorArrow${hasNeeds?"":" empty"}`}>▶</span>
              </div>
              <div className={`bridgeMapMission${hasNeeds?"":" bridgeMapMissionEmpty"}`}>
                <span className="bridgeMapMissionNum">{m.num}</span>
                <div>
                  <small>{language==="it"?"SFIDA DELLA QUEST":"QUEST CHALLENGE"}</small>
                  <strong className="bridgeMapMissionTitle">{m.label}</strong>
                  <p className="bridgeMapMissionNeed">{m.need}</p>
                </div>
              </div>
            </div>
          </div>;
        })()}
        {/* Riquadro capacità ulteriori — missioni 1–4 */}
        <div className="bridgeCapBlock">
          <div className="bridgeBlockLabel">{(t as any).bridgeCapLabel}</div>
          {missions.slice(1).map((m,idx)=>{
            const mi=idx+1;
            const assigned=(needsByMission[mi]||[]) as (typeof top5[0] & {_rank:number})[];
            const hasNeeds=assigned.length>0;
            return <div key={m.num} className={`bridgeMapRow${hasNeeds?"":" bridgeMapRowEmpty"}`}>
              <div className="bridgeMapNeedsCol">
                {hasNeeds ? assigned.map(n=>(
                  <div key={n.id} className="bridgeMapNeed">
                    <span className="bridgeMapNeedRank">{String(n._rank).padStart(2,"0")}</span>
                    <div>
                      <small>{language==="it"?"LA TUA ESIGENZA":"YOUR DATA NEED"}</small>
                      <strong>{n.label}</strong>
                      <span className="bridgeMapNeedPrio">{t.priorityNames[n.priority]}</span>
                    </div>
                  </div>
                )) : (
                  <div className="bridgeMapNeedEmpty">
                    <span className="bridgeMapNeedEmptyDash">—</span>
                    <small>{language==="it"?"Nessuna esigenza prioritaria assegnata":"No priority need assigned"}</small>
                  </div>
                )}
              </div>
              <div className="bridgeMapConnector">
                <span className={`bridgeMapConnectorLine${hasNeeds?"":" empty"}`}/>
                <span className={`bridgeMapConnectorArrow${hasNeeds?"":" empty"}`}>▶</span>
              </div>
              <div className={`bridgeMapMission${hasNeeds?"":" bridgeMapMissionEmpty"}`}>
                <span className="bridgeMapMissionNum">{m.num}</span>
                <div>
                  <small>{language==="it"?"SFIDA DELLA QUEST":"QUEST CHALLENGE"}</small>
                  <strong className="bridgeMapMissionTitle">{m.label}</strong>
                  <p className="bridgeMapMissionNeed">{m.need}</p>
                </div>
              </div>
            </div>;
          })}
        </div>
      </section>
    </main>;
  }

  if(screen==="compare"&&profile)return <Compare language={language} profile={profile} setLanguage={setLanguage} setScreen={setScreen} reset={reset} goBack={goBack} renderTrustBar={renderTrustBar} selectedMission={selectedMission} active={active} asIsRatings={asIsRatings} setScreenHistory={setScreenHistory} setScreenState={setScreenState} handleDecision={handleDecision} t={t}/>;

  if(screen==="tobe"&&profile)return <MissionFlowScreen language={language} profile={profile} setLanguage={setLanguage} setScreen={setScreen} reset={reset} goBack={goBack} screen="tobe" selectedMission={selectedMission} missionOutcomes={missionOutcomes} active={active} asIsRatings={asIsRatings} setAsIsRatings={setAsIsRatings} negativeChoice={negativeChoice} pendingOutcome={pendingOutcome} missionParameters={missionParameters} companyDims={companyDims} displayCompanyName={displayCompanyName} activeTrustIntro={activeTrustIntro} activeTrustSources={activeTrustSources} trustSteps={trustSteps} trustTotalW={trustTotalW} TRUST_BAR_W={TRUST_BAR_W} TRUST_BAR_GAP={TRUST_BAR_GAP} TRUST_CHART_H={TRUST_CHART_H} TRUST_SVG_PAD_X={TRUST_SVG_PAD_X} resultValues={resultValues} setPmMissionFilter={setPmMissionFilter} setPmFromBriefing={setPmFromBriefing} renderSaveBtn={renderSaveBtn} missionItems={missionItems} missionUnits={missionUnits} t={{...t,companyFacts:dynamicCompanyFacts}} name={name}/>;






  if(screen==="introCopy2"&&profile)return <main className="introScreen"><header className="missionNav"><button className="brand brandButton" onClick={reset}><span className="brandMark">e·</span><span>Envizi<br/>Impact Quest</span></button><div className="missionProgress"><span className="activeDot"/> YOUR CHALLENGE</div><div className="introNavRight"><button className="introBackBtn" onClick={()=>goBack()}>← {language==="it"?"Indietro":"Back"}</button><button className="langMini" onClick={()=>setLanguage(language==="it"?"en":"it")}>{language==="it"?"EN":"IT"}</button></div></header><section className="characterStage"><img src={`./characters/${profile}-neutral.png`} alt={name}/><div className="characterTag characterTagRaised"><span className="statusDot"/><div><small>ESG MANAGER</small><strong>{name}</strong></div></div></section><section className="introBody"><p className="eyebrow">{t.introKicker}</p><h1>{t.introTitle}</h1><p className="storyText">{t.introBody}</p><div className="introTrustBox"><p className="introScoreLabel">{t.introScoreLabel}</p>{renderTrustBar()}</div><div className="introCtaRow"><button className="actionButton questLaunchBtn" onClick={()=>setScreen("compare")}>{t.introStart}<b>→</b></button></div></section></main>;


  if((screen==="briefing"||screen==="asis"||screen==="trust"||screen==="negative"||screen==="success")&&profile)return <MissionFlowScreen language={language} profile={profile} setLanguage={setLanguage} setScreen={setScreen} reset={reset} goBack={goBack} screen={screen} selectedMission={selectedMission} missionOutcomes={missionOutcomes} active={active} asIsRatings={asIsRatings} setAsIsRatings={setAsIsRatings} negativeChoice={negativeChoice} pendingOutcome={pendingOutcome} missionParameters={missionParameters} companyDims={companyDims} displayCompanyName={displayCompanyName} activeTrustIntro={activeTrustIntro} activeTrustSources={activeTrustSources} trustSteps={trustSteps} trustTotalW={trustTotalW} TRUST_BAR_W={TRUST_BAR_W} TRUST_BAR_GAP={TRUST_BAR_GAP} TRUST_CHART_H={TRUST_CHART_H} TRUST_SVG_PAD_X={TRUST_SVG_PAD_X} resultValues={resultValues} setPmMissionFilter={setPmMissionFilter} setPmFromBriefing={setPmFromBriefing} renderSaveBtn={renderSaveBtn} missionItems={missionItems} missionUnits={missionUnits} t={{...t,companyFacts:dynamicCompanyFacts}} name={name}/>;



  if(screen==="cover")return <main className="coverScreen" style={{position:"relative"}}>
    {coverZoomWarn&&<div style={{position:"fixed",inset:0,zIndex:99999,background:"rgba(7,18,15,.82)",display:"flex",alignItems:"center",justifyContent:"center"}} onClick={()=>setCoverZoomWarn(false)}>
      <div style={{background:"#0d1f19",border:"1px solid rgba(57,239,180,.3)",borderRadius:"14px",padding:"28px 32px",maxWidth:"380px",width:"90vw",textAlign:"center",boxShadow:"0 8px 40px rgba(0,0,0,.6)"}} onClick={e=>e.stopPropagation()}>
        <p style={{margin:"0 0 8px",fontSize:"13px",fontFamily:"var(--font-geist-mono,monospace)",letterSpacing:".14em",textTransform:"uppercase",color:"#39efb4"}}>{language==="it"?"Attenzione":"Warning"}</p>
        <p style={{margin:"0 0 20px",fontSize:"15px",color:"#e8f5ef",lineHeight:1.5}}>{language==="it"?"Il rapporto di visualizzazione è ottimizzato per questa schermata. Sei sicuro di voler cambiare lo zoom?":"The display ratio is optimised for this screen. Are you sure you want to change the zoom?"}</p>
        <div style={{display:"flex",gap:"10px",justifyContent:"center"}}>
          <button style={{padding:"8px 22px",borderRadius:"8px",border:"1px solid rgba(57,239,180,.35)",background:"transparent",color:"#39efb4",fontSize:"14px",cursor:"pointer",fontFamily:"inherit"}} onClick={()=>setCoverZoomWarn(false)}>{language==="it"?"Annulla":"Cancel"}</button>
          <button style={{padding:"8px 22px",borderRadius:"8px",border:"1px solid #c84040",background:"rgba(200,64,64,.12)",color:"#ff8080",fontSize:"14px",cursor:"pointer",fontFamily:"inherit"}} onClick={dismissZoom}>{language==="it"?"Continua comunque":"Continue anyway"}</button>
        </div>
      </div>
    </div>}
    <div style={{position:"absolute",top:0,left:0,right:0,height:"4px",background:"#3b82f4",zIndex:100}}/>
    <img className="coverImage" src="./cover-marco.png" alt="Envizi Impact Quest"/>
    <div className="coverCta"><button className="coverStartBtn" onClick={()=>setScreenState("welcome")}>START</button></div>
    <div style={{position:"absolute",bottom:0,left:0,right:0,height:"4px",background:"#39efb4",zIndex:100}}/>
  </main>;

  if(screen==="welcome"){
    const isIt=language==="it";
    // Leggi tutte le quest salvate con i dati
    const allSavedKeys=getSavedQuestKeys();
    const allSaved=allSavedKeys.map(k=>{
      let d:any={};
      try{d=JSON.parse(localStorage.getItem(`envizi-quest-save-${k}`)||"{}");}catch(e){}
      return {key:k,userName:(d.userName||"") as string,missionOutcomes:d.missionOutcomes||{}};
    });
    // Utenti unici case-insensitive (mantiene prima occorrenza, ordina)
    const knownUsers=(()=>{const seen=new Set<string>();const out:string[]=[];for(const s of allSaved){const u=s.userName.trim();if(u&&!seen.has(u.toLowerCase())){seen.add(u.toLowerCase());out.push(u);}}return out.sort((a,b)=>a.toLowerCase().localeCompare(b.toLowerCase()));})();
    // Suggerimenti utente: match parziale sul campo (esclude match esatto case-insensitive)
    const userSuggestions=knownUsers.filter(u=>userName.trim()&&u.toLowerCase().includes(userName.trim().toLowerCase())&&u.toLowerCase()!==userName.trim().toLowerCase());
    // Quest filtrate per utente corrente (match esatto, case-insensitive)
    const userQuests=userName.trim()
      ? allSaved.filter(s=>s.userName.toLowerCase()===userName.trim().toLowerCase())
      : [];
    return <main className="welcomeScreen" style={{position:"relative"}}>
      {welcomeZoomWarn&&<div style={{position:"fixed",inset:0,zIndex:99999,background:"rgba(7,18,15,.82)",display:"flex",alignItems:"center",justifyContent:"center"}} onClick={()=>setWelcomeZoomWarn(false)}>
        <div style={{background:"#0d1f19",border:"1px solid rgba(57,239,180,.3)",borderRadius:"14px",padding:"28px 32px",maxWidth:"380px",width:"90vw",textAlign:"center",boxShadow:"0 8px 40px rgba(0,0,0,.6)"}} onClick={e=>e.stopPropagation()}>
          <p style={{margin:"0 0 8px",fontSize:"13px",fontFamily:"var(--font-geist-mono,monospace)",letterSpacing:".14em",textTransform:"uppercase",color:"#39efb4"}}>{isIt?"Attenzione":"Warning"}</p>
          <p style={{margin:"0 0 20px",fontSize:"15px",color:"#e8f5ef",lineHeight:1.5}}>{isIt?"Il rapporto di visualizzazione è ottimizzato per questa schermata. Sei sicuro di voler cambiare lo zoom?":"The display ratio is optimised for this screen. Are you sure you want to change the zoom?"}</p>
          <div style={{display:"flex",gap:"10px",justifyContent:"center"}}>
            <button style={{padding:"8px 22px",borderRadius:"8px",border:"1px solid rgba(57,239,180,.35)",background:"transparent",color:"#39efb4",fontSize:"14px",cursor:"pointer",fontFamily:"inherit"}} onClick={()=>setWelcomeZoomWarn(false)}>{isIt?"Annulla":"Cancel"}</button>
            <button style={{padding:"8px 22px",borderRadius:"8px",border:"1px solid #c84040",background:"rgba(200,64,64,.12)",color:"#ff8080",fontSize:"14px",cursor:"pointer",fontFamily:"inherit"}} onClick={dismissZoom}>{isIt?"Continua comunque":"Continue anyway"}</button>
          </div>
        </div>
      </div>}
      <div className="welcomeBlueBar"/>
      <span style={{position:"fixed",bottom:"20px",right:"24px",fontSize:"22px",fontWeight:700,letterSpacing:".18em",color:"rgba(57,239,180,.75)",fontFamily:"var(--font-geist-mono,monospace)",pointerEvents:"none",zIndex:9999}}>V2</span>
      <img src="./welcome-gen.png" alt="" className="welcomeBg" aria-hidden="true"/>
      <div className="welcomeBgOverlay"/>
      <header className="missionNav" style={{position:"relative",zIndex:3}}>
        <div className="brand"><span className="brandMark">e·</span><span>Envizi<br/>Impact Quest</span></div>
        <div style={{display:"flex",gap:"10px",alignItems:"center"}}>
          <button className="langMini" style={{fontFamily:"var(--font-geist-mono,monospace)"}} onClick={()=>setJourneyOpen(o=>!o)}>Journey</button>
          <button className="langMini" onClick={()=>setLanguage(language==="it"?"en":"it")}>{language==="it"?"EN":"IT"}</button>
        </div>
      </header>
      <button className="secondaryAction" style={{position:"fixed",bottom:"24px",left:"24px",zIndex:9998,fontSize:"clamp(11px,1vw,14px)",padding:"8px 16px"}} onClick={()=>setScreenState("cover")}>← {isIt?"Indietro":"Back"}</button>
      <div className="welcomePanel">
        {/* LEFT: form */}
        <div className="welcomeLeft">
          <p className="eyebrow">IBM ENVIZI · IMPACT QUEST</p>
          <h1 className="welcomeTitle">{isIt?"Benvenuto alla Envizi Quest":"Welcome to Envizi Quest"}</h1>
          <div className="welcomeForm">
            {/* Campo nome con suggerimenti utenti */}
            <div className="welcomeField" style={{position:"relative"}}>
              <label className="welcomeLabel">{isIt?"Il tuo nome":"Your name"}</label>
              <input
                className="welcomeInput"
                type="text"
                placeholder={isIt?"Es. Felice Petrignano":"E.g. Felice Petrignano"}
                value={userName}
                onChange={e=>setUserName(e.target.value)}
                autoComplete="off"
              />
              {/* Dropdown suggerimenti utenti esistenti */}
              {userSuggestions.length>0&&(
                <ul className="welcomeUserSuggestions">
                  {userSuggestions.map(u=>(
                    <li key={u}>
                      <button className="welcomeUserSuggBtn" onClick={()=>setUserName(u)}>
                        <span className="welcomeUserSuggIcon">👤</span>{u}
                      </button>
                    </li>
                  ))}
                </ul>
              )}
              {/* Pill con tutti gli utenti noti (se il campo è vuoto) */}
              {!userName.trim()&&knownUsers.length>0&&(
                <div className="welcomeKnownUsers">
                  {knownUsers.map(u=>(
                    <button key={u} className="welcomeUserPill" onClick={()=>setUserName(u)}>{u}</button>
                  ))}
                </div>
              )}
            </div>
            {/* Campo nome quest */}
            <div className="welcomeField">
              <label className="welcomeLabel">{isIt?"Nome della Quest (per il salvataggio)":"Quest name (for saving)"}</label>
              <input className="welcomeInput" type="text" placeholder={isIt?"Es. NovaForge — sessione 1":"E.g. NovaForge — session 1"} value={questName} onChange={e=>setQuestName(e.target.value)}/>
            </div>
            {userName.trim()&&questName.trim()&&(
              <button className="actionButton welcomeStartBtn" onClick={()=>{if(questName.trim())saveQuest(questName.trim());setScreenState("onboarding");}}>
                {isIt?"Inizia la Quest →":"Start the Quest →"}
              </button>
            )}
          </div>
          <div className="welcomeNote">
            <span className="welcomeNoteIcon">ℹ</span>
            <p>{isIt?"Per recuperare utenti e Quest precedentemente registrati, collegati dal medesimo browser utilizzato in precedenza.":"To retrieve previously registered users and Quests, connect from the same browser used before."}</p>
          </div>
        </div>
        {/* RIGHT: quest dell'utente corrente */}
        <div className="welcomeRight">
          {userName.trim()?(
            <>
              <p className="welcomeSavedTitle">
                {isIt?"Quest di":"Quests for"} <strong style={{color:"#39efb4"}}>{userName.trim()}</strong>
              </p>
              <button className="welcomeUserBackBtn" onClick={()=>setUserName("")}>← {isIt?"Cambia utente":"Change user"}</button>
              {userQuests.length===0?(
                <p className="welcomeEmpty">{isIt?"Nessuna Quest salvata per questo utente.":"No saved quests for this user."}</p>
              ):(
                <ul className="welcomeSavedList">
                  {userQuests.map(({key,missionOutcomes:mo})=>{
                    const completed=Object.keys(mo).length;
                    return <li key={key} className="welcomeSavedItem">
                      <div className="welcomeSavedInfo">
                        <strong>{key}</strong>
                        <small>{isIt?`${completed}/6 missioni`:`${completed}/6 missions`}</small>
                      </div>
                      <div className="welcomeSavedActions">
                        <button className="welcomeLoadBtn" onClick={()=>{loadQuest(key);setScreenState("onboarding");}}>{isIt?"Riprendi →":"Resume →"}</button>
                        <button className="welcomeDownloadBtn" title={isIt?"Salva come file .envizi-quest (controlla la cartella Download del browser)":"Save as .envizi-quest file (check your browser Downloads folder)"} onClick={()=>downloadQuest(key)}>⬇</button>
                        <button className="welcomeDeleteBtn" onClick={()=>{deleteQuest(key);setScreenState("cover");setTimeout(()=>setScreenState("welcome"),10);}}>✕</button>
                      </div>
                    </li>;
                  })}
                </ul>
              )}
              {/* Upload zone */}
              <div className="welcomeUploadZone" onDragOver={e=>e.preventDefault()} onDrop={e=>{e.preventDefault();const f=e.dataTransfer.files[0];if(f)uploadQuestFile(f);}}>
                <input id="welcomeUploadInput" type="file" accept=".envizi-quest,.json" style={{display:"none"}} onChange={e=>{const f=e.target.files?.[0];if(f)uploadQuestFile(f);e.target.value="";}}/>
                <button className="welcomeUploadBtn" onClick={openUploadPicker}>
                  <span className="welcomeUploadIcon">⬆</span>
                  <span className="welcomeUploadText">{isIt?"Importa una Quest (.envizi-quest)":"Import a Quest (.envizi-quest)"}</span>
                </button>
                <span className="welcomeUploadHint">{isIt?"Scegli cartella o trascina il file qui":"Choose folder or drag file here"}</span>
              </div>
            </>
          ):(
            <>
              <p className="welcomeSavedTitle">{isIt?"Quest salvate":"Saved quests"}</p>
              {allSaved.length===0
                ?<p className="welcomeEmpty">{isIt?"Nessuna Quest salvata ancora.":"No saved quests yet."}</p>
                :<ul className="welcomeSavedList">
                  {allSaved.map(({key,userName:u,missionOutcomes:mo})=>{
                    const completed=Object.keys(mo).length;
                    return <li key={key} className="welcomeSavedItem">
                      <div className="welcomeSavedInfo">
                        <strong>{key}</strong>
                        <small>{u?`${u} · `:""}{isIt?`${completed}/6 missioni`:`${completed}/6 missions`}</small>
                      </div>
                      <div className="welcomeSavedActions">
                        <button className="welcomeLoadBtn" onClick={()=>{loadQuest(key);setScreenState("onboarding");}}>{isIt?"Riprendi →":"Resume →"}</button>
                        <button className="welcomeDeleteBtn" onClick={()=>{deleteQuest(key);setScreenState("cover");setTimeout(()=>setScreenState("welcome"),10);}}>✕</button>
                      </div>
                    </li>;
                  })}
                </ul>
              }
            </>
          )}
        </div>
      </div>
      <div className="welcomeBlueBar" style={{background:"#39efb4"}}/>
    </main>;
  }


  return <main className="onboarding" style={{position:"relative"}}>{onboardingZoomWarn&&<div style={{position:"fixed",inset:0,zIndex:99999,background:"rgba(7,18,15,.82)",display:"flex",alignItems:"center",justifyContent:"center"}} onClick={()=>setOnboardingZoomWarn(false)}><div style={{background:"#0d1f19",border:"1px solid rgba(57,239,180,.3)",borderRadius:"14px",padding:"28px 32px",maxWidth:"380px",width:"90vw",textAlign:"center",boxShadow:"0 8px 40px rgba(0,0,0,.6)"}} onClick={e=>e.stopPropagation()}><p style={{margin:"0 0 8px",fontSize:"13px",fontFamily:"var(--font-geist-mono,monospace)",letterSpacing:".14em",textTransform:"uppercase",color:"#39efb4"}}>{language==="it"?"Attenzione":"Warning"}</p><p style={{margin:"0 0 20px",fontSize:"15px",color:"#e8f5ef",lineHeight:1.5}}>{language==="it"?"Il rapporto di visualizzazione è ottimizzato per questa schermata. Sei sicuro di voler cambiare lo zoom?":"The display ratio is optimised for this screen. Are you sure you want to change the zoom?"}</p><div style={{display:"flex",gap:"10px",justifyContent:"center"}}><button style={{padding:"8px 22px",borderRadius:"8px",border:"1px solid rgba(57,239,180,.35)",background:"transparent",color:"#39efb4",fontSize:"14px",cursor:"pointer",fontFamily:"inherit"}} onClick={()=>setOnboardingZoomWarn(false)}>{language==="it"?"Annulla":"Cancel"}</button><button style={{padding:"8px 22px",borderRadius:"8px",border:"1px solid #c84040",background:"rgba(200,64,64,.12)",color:"#ff8080",fontSize:"14px",cursor:"pointer",fontFamily:"inherit"}} onClick={dismissZoom}>{language==="it"?"Continua comunque":"Continue anyway"}</button></div></div></div>}<div className="welcomeBlueBar"/><div className="ambient ambientOne"/><div className="ambient ambientTwo"/><header className="topbar"><div className="brand"><span className="brandMark">e·</span><span>Envizi<br/>Impact Quest</span></div></header><section className="introPanel"><p className="eyebrow">{t.eyebrow}</p><h1>{t.title}</h1><p className="intro">{t.intro}</p><p className="thread">{t.sameStory}</p><p className="authorDisclaimer">{t.disclaimer}<a href="mailto:felice_petrignano@it.ibm.com">felice_petrignano@it.ibm.com</a></p></section><section className="choicePanel"><div className="choiceHeading"><div><span className="choiceNumber">01</span><h2>{t.language}</h2></div><div className="languageSwitch"><button className={language==="it"?"active":""} onClick={()=>setLanguage("it")}>Italiano <span>🇮🇹</span></button><button className={language==="en"?"active":""} onClick={()=>setLanguage("en")}>English <span>🇬🇧</span></button></div></div><div className="profileSection"><div className="profileTitle profileTitleHighlighted"><span className="choiceNumber">02</span><h2>{t.profile}</h2></div><div className="profilesWrap"><div className="profiles profilesGuided">{(["marco","luisa"] as Profile[]).map(p=><div key={p} className="profileCardWrap"><button className={`profileCard ${profile===p?"selected":""}`} onClick={()=>setProfile(p)}><img src={`./characters/${p}-neutral.png`} alt={p==="marco"?"Marco Rossi":"Luisa Bianchi"}/><div className="profileInfo"><span className="statusDot"/><div><strong>{p==="marco"?"Marco Rossi":"Luisa Bianchi"}</strong><small>{p==="marco"?t.maleRole:t.femaleRole}</small></div></div></button><button className="profileChooseBtn" onClick={()=>{setProfile(p);localStorage.setItem("envizi-quest-profile",JSON.stringify({language,profile:p}));setScreen("chapterMap");}}>{language==="it"?`Scegli ${p==="marco"?"Marco":"Luisa"}`:`Choose ${p==="marco"?"Marco":"Luisa"}`} →</button></div>)}</div></div></div><p className="bobCredit">{language==="it"?"Sviluppato con IBM Bob":"Developed with IBM Bob"}</p></section><button className="backBtn" onClick={()=>setScreenState("welcome")}>← {language==="it"?"Indietro":"Back"}</button><div className="welcomeBlueBar" style={{background:"#39efb4"}}/></main>;
}
