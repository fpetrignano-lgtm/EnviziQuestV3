import type { Language, Profile, Screen, Outcome, Priority } from "../types";

export type SetScreen = (s: Screen) => void;
export type SetLanguage = (l: Language) => void;
export type RenderTrustBar = () => JSX.Element;
export type GoBack = () => void;
export type Reset = () => void;

export interface CommonProps {
  language: Language;
  profile: Profile;
  setLanguage: SetLanguage;
  setScreen: SetScreen;
  reset: Reset;
  goBack: GoBack;
  renderTrustBar: RenderTrustBar;
}

export interface NeedItem {
  id: string;
  priority: Priority;
  label: string;
}

export type NeedsByMission = [number, (NeedItem & { rank: number })[]][];
