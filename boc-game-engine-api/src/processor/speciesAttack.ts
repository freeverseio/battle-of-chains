import { ONE_YEAR_IN_SECS } from "./constants";
import { SpeciesLore, SpeciesTypicalyStats } from "./species";

export enum AttackSpeciesType {
  WhiteHacker,
  MercenaryHacker,
  HighSchoolHacker,
  SECLawyer,
  Evangelist,
  SalesGuy,
  FTXFounder,
  RoundTableConductor,
  EuropeanBureaucrat,
  NSASurveillor,
  OpenAIBoardMember,
  Bullshiter,
  PureMathematician,
  KOL,
  Influencer,
  VilatikTuberin,
  SatoshiNakamoto,
  GevinWoud
}

export const AttackSpeciesLore: Record<AttackSpeciesType, SpeciesLore> = {
  [AttackSpeciesType.WhiteHacker]: { 
    name: "White Hacker", 
    description: "The 'ethical' hacker who claims to be on your side… until they aren’t."
  },
  [AttackSpeciesType.MercenaryHacker]: { 
    name: "Mercenary Hacker", 
    description: "A hacker for hire. They don’t care who you are, as long as the payment clears."
  },
  [AttackSpeciesType.HighSchoolHacker]: { 
    name: "High-School Hacker", 
    description: "Just learned SQL injection and thinks they’re the next Anonymous."
  },
  [AttackSpeciesType.SECLawyer]: { 
    name: "SEC Lawyer", 
    description: "Attacks with paperwork and regulations. No firewall can block the law."
  },
  [AttackSpeciesType.Evangelist]: { 
    name: "Evangelist", 
    description: "Relentlessly pushes their chosen tech, regardless of practicality. Can destroy a project from within."
  },
  [AttackSpeciesType.SalesGuy]: { 
    name: "Sales Guy", 
    description: "Can sell you back your own data for triple the price. Armed with charm and empty promises."
  },
  [AttackSpeciesType.FTXFounder]: { 
    name: "FTX Founder", 
    description: "Master of the 'strategic' rug pull, leaving chaos and lawsuits in their wake."
  },
  [AttackSpeciesType.RoundTableConductor]: { 
    name: "Round Table Conductor", 
    description: "Hosts endless meetings, draining productivity and morale from the inside."
  },
  [AttackSpeciesType.EuropeanBureaucrat]: { 
    name: "European Bureaucrat", 
    description: "Regulates anything that moves. Attacks with endless paperwork and compliance forms."
  },
  [AttackSpeciesType.NSASurveillor]: { 
    name: "NSA Surveillor", 
    description: "Sees everything, hears everything. Your secrets are already in their database."
  },
  [AttackSpeciesType.OpenAIBoardMember]: { 
    name: "OpenAI Board Member", 
    description: "Armed with ethical debates and boardroom power moves. Paralyzes projects with bureaucracy."
  },
  [AttackSpeciesType.Bullshiter]: { 
    name: "Bullshiter", 
    description: "A master of buzzwords and vague promises. Can talk for hours without actually saying anything of value."
  },
  [AttackSpeciesType.PureMathematician]: { 
    name: "Pure Mathematician", 
    description: "Too abstract to be of any practical use, but always convinced of their own importance."
  },
  [AttackSpeciesType.KOL]: { 
    name: "KOL (Key Opinion Leader)", 
    description: "Attacks with influence and hype. Often as clueless as they are powerful."
  },
  [AttackSpeciesType.Influencer]: { 
    name: "Influencer", 
    description: "Wields hype and misinformation like a weapon. A single tweet can bring down entire companies."
  },
  [AttackSpeciesType.VilatikTuberin]: { 
    name: "Vilatik Tuberin", 
    description: "A crypto genius—or so they claim. Known for wild ideas and ‘innovations’ that cause chaos."
  },
  [AttackSpeciesType.SatoshiNakamoto]: { 
    name: "Satoshi Nakamoto", 
    description: "The myth, the legend. No one knows what he wants, but everyone fears his return."
  },
  [AttackSpeciesType.GevinWoud]: { 
    name: "Gevin Woud", 
    description: "The mastermind engineer whose coding skills are so advanced, it’s basically magic."
  }
};

export const AttackSpeciesCharacteristics: Record<AttackSpeciesType, SpeciesTypicalyStats> = {
  [AttackSpeciesType.WhiteHacker]: {
    name: AttackSpeciesLore[AttackSpeciesType.WhiteHacker].name,
    description: AttackSpeciesLore[AttackSpeciesType.WhiteHacker].description,
    attack: 10,
    defense: 7,
    travelSpeed: 10,
    age: 30,
    potential: 12,
    rarity: 10
  },
  [AttackSpeciesType.MercenaryHacker]: {
    name: AttackSpeciesLore[AttackSpeciesType.MercenaryHacker].name,
    description: AttackSpeciesLore[AttackSpeciesType.MercenaryHacker].description,
    attack: 8,
    defense: 4,
    travelSpeed: 10,
    age: 30,
    potential: 6,
    rarity: 5
  },
  [AttackSpeciesType.HighSchoolHacker]: {
    name: AttackSpeciesLore[AttackSpeciesType.HighSchoolHacker].name,
    description: AttackSpeciesLore[AttackSpeciesType.HighSchoolHacker].description,
    attack: 3,
    defense: 2,
    travelSpeed: 12,
    age: 16,
    potential: 10,
    rarity: 5
  },
  [AttackSpeciesType.SECLawyer]: {
    name: AttackSpeciesLore[AttackSpeciesType.SECLawyer].name,
    description: AttackSpeciesLore[AttackSpeciesType.SECLawyer].description,
    attack: 12,
    defense: 1,
    travelSpeed: 3,
    age: 45,
    potential: 2,
    rarity: 7
  },
  [AttackSpeciesType.Evangelist]: {
    name: AttackSpeciesLore[AttackSpeciesType.Evangelist].name,
    description: AttackSpeciesLore[AttackSpeciesType.Evangelist].description,
    attack: 5,
    defense: 1,
    travelSpeed: 3,
    age: 50,
    potential: 5,
    rarity: 6
  },
  [AttackSpeciesType.SalesGuy]: {
    name: AttackSpeciesLore[AttackSpeciesType.SalesGuy].name,
    description: AttackSpeciesLore[AttackSpeciesType.SalesGuy].description,
    attack: 7,
    defense: 1,
    travelSpeed: 10,
    age: 40,
    potential: 5,
    rarity: 4
  },
  [AttackSpeciesType.FTXFounder]: {
    name: AttackSpeciesLore[AttackSpeciesType.FTXFounder].name,
    description: AttackSpeciesLore[AttackSpeciesType.FTXFounder].description,
    attack: 12,
    defense: 2,
    travelSpeed: 15,
    age: 29,
    potential: 8,
    rarity: 9
  },
  [AttackSpeciesType.RoundTableConductor]: {
    name: AttackSpeciesLore[AttackSpeciesType.RoundTableConductor].name,
    description: AttackSpeciesLore[AttackSpeciesType.RoundTableConductor].description,
    attack: 4,
    defense: 1,
    travelSpeed: 5,
    age: 55,
    potential: 2,
    rarity: 4
  },
  [AttackSpeciesType.EuropeanBureaucrat]: {
    name: AttackSpeciesLore[AttackSpeciesType.EuropeanBureaucrat].name,
    description: AttackSpeciesLore[AttackSpeciesType.EuropeanBureaucrat].description,
    attack: 7,
    defense: 2,
    travelSpeed: 2,
    age: 60,
    potential: 5,
    rarity: 6
  },
  [AttackSpeciesType.NSASurveillor]: {
    name: AttackSpeciesLore[AttackSpeciesType.NSASurveillor].name,
    description: AttackSpeciesLore[AttackSpeciesType.NSASurveillor].description,
    attack: 7,
    defense: 1,
    travelSpeed: 10,
    age: 50,
    potential: 5,
    rarity: 8
  },
  [AttackSpeciesType.OpenAIBoardMember]: {
    name: AttackSpeciesLore[AttackSpeciesType.OpenAIBoardMember].name,
    description: AttackSpeciesLore[AttackSpeciesType.OpenAIBoardMember].description,
    attack: 8,
    defense: 1,
    travelSpeed: 8,
    age: 45,
    potential: 8,
    rarity: 15
  },
  [AttackSpeciesType.Bullshiter]: {
    name: AttackSpeciesLore[AttackSpeciesType.Bullshiter].name,
    description: AttackSpeciesLore[AttackSpeciesType.Bullshiter].description,
    attack: 9,
    defense: 1,
    travelSpeed: 3,
    age: 45,
    potential: 1,
    rarity: 2
  },
  [AttackSpeciesType.PureMathematician]: {
    name: AttackSpeciesLore[AttackSpeciesType.PureMathematician].name,
    description: AttackSpeciesLore[AttackSpeciesType.PureMathematician].description,
    attack: 8,
    defense: 3,
    travelSpeed: 6,
    age: 35,
    potential: 9,
    rarity: 5
  },
  [AttackSpeciesType.KOL]: {
    name: AttackSpeciesLore[AttackSpeciesType.KOL].name,
    description: AttackSpeciesLore[AttackSpeciesType.KOL].description,
    attack: 3,
    defense: 1,
    travelSpeed: 8,
    age: 25,
    potential: 2,
    rarity: 3
  },
  [AttackSpeciesType.Influencer]: {
    name: AttackSpeciesLore[AttackSpeciesType.Influencer].name,
    description: AttackSpeciesLore[AttackSpeciesType.Influencer].description,
    attack: 3,
    defense: 1,
    travelSpeed: 7,
    age: 20,
    potential: 3,
    rarity: 3
  },
  [AttackSpeciesType.VilatikTuberin]: {
    name: AttackSpeciesLore[AttackSpeciesType.VilatikTuberin].name,
    description: AttackSpeciesLore[AttackSpeciesType.VilatikTuberin].description,
    attack: 10,
    defense: 10,
    travelSpeed: 10,
    age: 25,
    potential: 15,
    rarity: 15
  },
  [AttackSpeciesType.SatoshiNakamoto]: {
    name: AttackSpeciesLore[AttackSpeciesType.SatoshiNakamoto].name,
    description: AttackSpeciesLore[AttackSpeciesType.SatoshiNakamoto].description,
    attack: 12,
    defense: 12,
    travelSpeed: 12,
    age: 35,
    potential: 20,
    rarity: 20
  },
  [AttackSpeciesType.GevinWoud]: {
    name: AttackSpeciesLore[AttackSpeciesType.GevinWoud].name,
    description: AttackSpeciesLore[AttackSpeciesType.GevinWoud].description,
    attack: 10,
    defense: 10,
    travelSpeed: 10,
    age: 35,
    potential: 15,
    rarity: 15
  }
};

export const attackSpeciesStats: [AttackSpeciesType, SpeciesTypicalyStats][] = 
  Object.values(AttackSpeciesType)
    .filter(value => typeof value === 'number')
    .map((key) => {
      const stats = { ...AttackSpeciesCharacteristics[key as AttackSpeciesType] };
      stats.age *= ONE_YEAR_IN_SECS;
      return [key as AttackSpeciesType, stats];
    });
