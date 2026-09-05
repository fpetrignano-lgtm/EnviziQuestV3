export type Language = "it" | "en";
export type Profile = "marco" | "luisa";
export type Screen = "cover" | "welcome" | "onboarding" | "intro" | "approach" | "chapterMap" | "questIntro" | "approachIntro" | "approachSteps" | "approachData" | "approachDecisions" | "approachRoadmap" | "blank1" | "p10Slideshow" | "reportSlideshow" | "reportSlideshowPng" | "approachTrust" | "approachReport" | "separatorNext" | "approachStepsCopy" | "companySetup" | "missions" | "roadmapPreview" | "ilTuoReport" | "chapterOneSummary" | "esgStrategist" | "challengeSeparator1" | "challengeSeparator2" | "challengeSeparator3" | "challengeSeparator4" | "challengeSeparator5" | "challengeSeparator6" | "missionCard1" | "missionCard2" | "missionCard3" | "missionCard4" | "missionCard5" | "missionCard6" | "introCopy" | "introCopy2" | "company" | "company2" | "priorities" | "approachDataCopy" | "priorityData" | "priorityMatrix" | "bridge" | "briefing" | "missionIntro" | "asis" | "milestone" | "dataFoundation" | "dfConclusion" | "challengeComplete1" | "challengeComplete2" | "challengeComplete3" | "challengeComplete4" | "challengeComplete5" | "challengeComplete6" | "compare" | "tobe" | "trust" | "negative" | "success" | "reportingFoundation" | "reportingConclusion" | "energyFoundation" | "energyConclusion" | "supplyFoundation" | "supplyConclusion" | "planningFoundation" | "planningConclusion" | "frameworkFoundation" | "frameworkConclusion" | "summary" | "nextStep" | "thankYou" | "sectionIntro1" | "sectionIntro2" | "sectionIntro3" | "sectionOutro";
export type Market = "italia" | "europa" | "mondo";
export type EsgReadiness = "primi" | "consolidamento" | "decisioni";
export type SectorKey = "manifatturiero"|"bancario"|"assicurativo"|"utilities"|"distribuzione"|"farmaceutico"|"sanitario"|"logistico"|"alberghiero"|"telecomunicazioni"|"trasporti"|"costruzioni"|"immobiliare"|"media"|"tecnologico"|"pa"|"universitario"|"nonprofit";
export type Priority = "credit" | "compliance" | "customers" | "efficiency" | "supply" | "reputation";
export type Outcome = "positive" | "warning" | "critical";
export type DFRating = "low" | "medium" | "high";
export type SectorDef = {
  label:{it:string,en:string};
  dimLabel:{it:string,en:string};
  dimUnit:{it:string,en:string};
  opsLabel:{it:string,en:string};
  opsUnit:{it:string,en:string};
  defaults:[number,number,number,number,number];
};
