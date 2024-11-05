import { SpeciesLore, SpeciesTypicalyStats } from "./species";

export enum AttackSpecies {
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
  MicrosoftBlueScreen,
  PureMathematician,
  KOL,
  Influencer,
  VilatikTuberin,
  SatoshiNakamoto,
  GevinWoud
}

export const AttackSpeciesLore: Record<AttackSpecies, SpeciesLore> = {
  [AttackSpecies.WhiteHacker]: { 
    name: "White Hacker", 
    description: "The 'ethical' hacker who claims to be on your side… until they aren’t."
  },
  [AttackSpecies.MercenaryHacker]: { 
    name: "Mercenary Hacker", 
    description: "A hacker for hire. They don’t care who you are, as long as the payment clears."
  },
  [AttackSpecies.HighSchoolHacker]: { 
    name: "High-School Hacker", 
    description: "Just learned SQL injection and thinks they’re the next Anonymous."
  },
  [AttackSpecies.SECLawyer]: { 
    name: "SEC Lawyer", 
    description: "Attacks with paperwork and regulations. No firewall can block the law."
  },
  [AttackSpecies.Evangelist]: { 
    name: "Evangelist", 
    description: "Relentlessly pushes their chosen tech, regardless of practicality. Can destroy a project from within."
  },
  [AttackSpecies.SalesGuy]: { 
    name: "Sales Guy", 
    description: "Can sell you back your own data for triple the price. Armed with charm and empty promises."
  },
  [AttackSpecies.FTXFounder]: { 
    name: "FTX Founder", 
    description: "Master of the 'strategic' rug pull, leaving chaos and lawsuits in their wake."
  },
  [AttackSpecies.RoundTableConductor]: { 
    name: "Round Table Conductor", 
    description: "Hosts endless meetings, draining productivity and morale from the inside."
  },
  [AttackSpecies.EuropeanBureaucrat]: { 
    name: "European Bureaucrat", 
    description: "Regulates anything that moves. Attacks with endless paperwork and compliance forms."
  },
  [AttackSpecies.NSASurveillor]: { 
    name: "NSA Surveillor", 
    description: "Sees everything, hears everything. Your secrets are already in their database."
  },
  [AttackSpecies.OpenAIBoardMember]: { 
    name: "OpenAI Board Member", 
    description: "Armed with ethical debates and boardroom power moves. Paralyzes projects with bureaucracy."
  },
  [AttackSpecies.MicrosoftBlueScreen]: { 
    name: "Microsoft Blue Screen", 
    description: "Your worst nightmare in digital form. Crashes systems and erases data without mercy."
  },
  [AttackSpecies.PureMathematician]: { 
    name: "Pure Mathematician", 
    description: "Too abstract to be of any practical use, but always convinced of their own importance."
  },
  [AttackSpecies.KOL]: { 
    name: "KOL (Key Opinion Leader)", 
    description: "Attacks with influence and hype. Often as clueless as they are powerful."
  },
  [AttackSpecies.Influencer]: { 
    name: "Influencer", 
    description: "Wields hype and misinformation like a weapon. A single tweet can bring down entire companies."
  },
  [AttackSpecies.VilatikTuberin]: { 
    name: "Vilatik Tuberin", 
    description: "A crypto genius—or so they claim. Known for wild ideas and ‘innovations’ that cause chaos."
  },
  [AttackSpecies.SatoshiNakamoto]: { 
    name: "Satoshi Nakamoto", 
    description: "The myth, the legend. No one knows what he wants, but everyone fears his return."
  },
  [AttackSpecies.GevinWoud]: { 
    name: "Gevin Woud", 
    description: "The mastermind engineer whose coding skills are so advanced, it’s basically magic."
  }
};

export const AttackSpeciesCharacteristics: Record<AttackSpecies, SpeciesTypicalyStats> = {
  [AttackSpecies.WhiteHacker]: {
    name: AttackSpeciesLore[AttackSpecies.WhiteHacker].name,
    description: AttackSpeciesLore[AttackSpecies.WhiteHacker].description,
    attack: 10,
    defense: 7,
    travelSpeed: 10,
    age: 30,
    potential: 12,
    rarity: 10
  },
  [AttackSpecies.MercenaryHacker]: {
    name: AttackSpeciesLore[AttackSpecies.MercenaryHacker].name,
    description: AttackSpeciesLore[AttackSpecies.MercenaryHacker].description,
    attack: 8,
    defense: 4,
    travelSpeed: 10,
    age: 30,
    potential: 6,
    rarity: 5
  },
  [AttackSpecies.HighSchoolHacker]: {
    name: AttackSpeciesLore[AttackSpecies.HighSchoolHacker].name,
    description: AttackSpeciesLore[AttackSpecies.HighSchoolHacker].description,
    attack: 3,
    defense: 2,
    travelSpeed: 12,
    age: 16,
    potential: 10,
    rarity: 5
  },
  [AttackSpecies.SECLawyer]: {
    name: AttackSpeciesLore[AttackSpecies.SECLawyer].name,
    description: AttackSpeciesLore[AttackSpecies.SECLawyer].description,
    attack: 12,
    defense: 1,
    travelSpeed: 3,
    age: 45,
    potential: 2,
    rarity: 7
  },
  [AttackSpecies.Evangelist]: {
    name: AttackSpeciesLore[AttackSpecies.Evangelist].name,
    description: AttackSpeciesLore[AttackSpecies.Evangelist].description,
    attack: 5,
    defense: 1,
    travelSpeed: 3,
    age: 50,
    potential: 5,
    rarity: 6
  },
  [AttackSpecies.SalesGuy]: {
    name: AttackSpeciesLore[AttackSpecies.SalesGuy].name,
    description: AttackSpeciesLore[AttackSpecies.SalesGuy].description,
    attack: 7,
    defense: 1,
    travelSpeed: 10,
    age: 40,
    potential: 5,
    rarity: 4
  },
  [AttackSpecies.FTXFounder]: {
    name: AttackSpeciesLore[AttackSpecies.FTXFounder].name,
    description: AttackSpeciesLore[AttackSpecies.FTXFounder].description,
    attack: 12,
    defense: 2,
    travelSpeed: 15,
    age: 29,
    potential: 8,
    rarity: 9
  },
  [AttackSpecies.RoundTableConductor]: {
    name: AttackSpeciesLore[AttackSpecies.RoundTableConductor].name,
    description: AttackSpeciesLore[AttackSpecies.RoundTableConductor].description,
    attack: 4,
    defense: 1,
    travelSpeed: 5,
    age: 55,
    potential: 2,
    rarity: 4
  },
  [AttackSpecies.EuropeanBureaucrat]: {
    name: AttackSpeciesLore[AttackSpecies.EuropeanBureaucrat].name,
    description: AttackSpeciesLore[AttackSpecies.EuropeanBureaucrat].description,
    attack: 7,
    defense: 2,
    travelSpeed: 2,
    age: 60,
    potential: 5,
    rarity: 6
  },
  [AttackSpecies.NSASurveillor]: {
    name: AttackSpeciesLore[AttackSpecies.NSASurveillor].name,
    description: AttackSpeciesLore[AttackSpecies.NSASurveillor].description,
    attack: 7,
    defense: 1,
    travelSpeed: 10,
    age: 50,
    potential: 5,
    rarity: 8
  },
  [AttackSpecies.OpenAIBoardMember]: {
    name: AttackSpeciesLore[AttackSpecies.OpenAIBoardMember].name,
    description: AttackSpeciesLore[AttackSpecies.OpenAIBoardMember].description,
    attack: 8,
    defense: 1,
    travelSpeed: 8,
    age: 45,
    potential: 8,
    rarity: 15
  },
  [AttackSpecies.MicrosoftBlueScreen]: {
    name: AttackSpeciesLore[AttackSpecies.MicrosoftBlueScreen].name,
    description: AttackSpeciesLore[AttackSpecies.MicrosoftBlueScreen].description,
    attack: 9,
    defense: 1,
    travelSpeed: 3,
    age: 45,
    potential: 1,
    rarity: 2
  },
  [AttackSpecies.PureMathematician]: {
    name: AttackSpeciesLore[AttackSpecies.PureMathematician].name,
    description: AttackSpeciesLore[AttackSpecies.PureMathematician].description,
    attack: 8,
    defense: 3,
    travelSpeed: 6,
    age: 35,
    potential: 9,
    rarity: 5
  },
  [AttackSpecies.KOL]: {
    name: AttackSpeciesLore[AttackSpecies.KOL].name,
    description: AttackSpeciesLore[AttackSpecies.KOL].description,
    attack: 3,
    defense: 1,
    travelSpeed: 8,
    age: 25,
    potential: 2,
    rarity: 3
  },
  [AttackSpecies.Influencer]: {
    name: AttackSpeciesLore[AttackSpecies.Influencer].name,
    description: AttackSpeciesLore[AttackSpecies.Influencer].description,
    attack: 3,
    defense: 1,
    travelSpeed: 7,
    age: 20,
    potential: 3,
    rarity: 3
  },
  [AttackSpecies.VilatikTuberin]: {
    name: AttackSpeciesLore[AttackSpecies.VilatikTuberin].name,
    description: AttackSpeciesLore[AttackSpecies.VilatikTuberin].description,
    attack: 10,
    defense: 10,
    travelSpeed: 10,
    age: 25,
    potential: 15,
    rarity: 15
  },
  [AttackSpecies.SatoshiNakamoto]: {
    name: AttackSpeciesLore[AttackSpecies.SatoshiNakamoto].name,
    description: AttackSpeciesLore[AttackSpecies.SatoshiNakamoto].description,
    attack: 12,
    defense: 12,
    travelSpeed: 12,
    age: 35,
    potential: 20,
    rarity: 20
  },
  [AttackSpecies.GevinWoud]: {
    name: AttackSpeciesLore[AttackSpecies.GevinWoud].name,
    description: AttackSpeciesLore[AttackSpecies.GevinWoud].description,
    attack: 10,
    defense: 10,
    travelSpeed: 10,
    age: 35,
    potential: 15,
    rarity: 15
  }
};

export const attackSpeciesStats: [AttackSpecies, SpeciesTypicalyStats][] = 
  Object.values(AttackSpecies).filter(value => typeof value === 'number')
    .map((key) => [key as AttackSpecies, AttackSpeciesCharacteristics[key as AttackSpecies]]);
