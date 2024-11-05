import { SpeciesLore, SpeciesTypicalyStats } from "./species";

export enum DefendSpecies {
  FullStackDeveloper,
  RustDeveloper,
  PythonDeveloper,
  CPlusPlusDeveloper,
  MicrosoftDeveloper,
  HighSchoolDeveloper,
  CybersecurityGuru,
  LegalCounselor,
  VentureCapitalist,
  AngelInvestor,
  ProductOwner,
  CommunityManager,
  AcademicProfessor,
  QAGuy,
  ITGuy,
  Cook,
  VilatikTuberin,
  SatoshiNakamoto,
  GevinWoud
}

export const DefendSpeciesLore: Record<DefendSpecies, SpeciesLore> = {
  [DefendSpecies.FullStackDeveloper]: { 
    name: "Full Stack Developer", 
    description: "The mythical jack-of-all-trades who knows just enough front-end and back-end to be dangerous." 
  },
  [DefendSpecies.RustDeveloper]: { 
    name: "Rust Developer", 
    description: "Brave and fearless, a developer who laughs in the face of memory leaks, yet somehow always annoyed with C++." 
  },
  [DefendSpecies.PythonDeveloper]: { 
    name: "Python Developer", 
    description: "Can get any job done in five lines of code, but don’t ask them about static typing." 
  },
  [DefendSpecies.CPlusPlusDeveloper]: { 
    name: "C++ Developer", 
    description: "The wizard of low-level magic, with pointers, manual memory management, and a superiority complex." 
  },
  [DefendSpecies.MicrosoftDeveloper]: { 
    name: "Microsoft Developer", 
    description: "An expert in writing code to fit perfectly with Windows updates. Complains if it has to run on Linux." 
  },
  [DefendSpecies.HighSchoolDeveloper]: { 
    name: "High-School Developer", 
    description: "Young, hungry, and self-taught—destined to become a legend or quit for TikTok fame." 
  },
  [DefendSpecies.CybersecurityGuru]: { 
    name: "Cybersecurity Guru", 
    description: "Lives for catching vulnerabilities and cryptic log files. Knows ten ways to break your app." 
  },
  [DefendSpecies.LegalCounselor]: { 
    name: "Legal Counselor", 
    description: "Specializes in making everything you thought was allowed suddenly forbidden." 
  },
  [DefendSpecies.VentureCapitalist]: { 
    name: "Venture Capitalist", 
    description: "Pumps money into ideas they barely understand but insists on being the ‘visionary’." 
  },
  [DefendSpecies.AngelInvestor]: { 
    name: "Angel Investor", 
    description: "Shows up with money, and a smile, and leaves right before things get complicated." 
  },
  [DefendSpecies.ProductOwner]: { 
    name: "Product Owner", 
    description: "Has never coded a day in their life, but knows exactly why your implementation is wrong." 
  },
  [DefendSpecies.CommunityManager]: { 
    name: "Community Manager", 
    description: "Keeps the online mobs at bay with memes, emojis, and the occasional thinly veiled PR statement." 
  },
  [DefendSpecies.AcademicProfessor]: { 
    name: "Academic Professor", 
    description: "Highly knowledgeable, but only if the knowledge is 10+ years old and theoretical." 
  },
  [DefendSpecies.QAGuy]: { 
    name: "QA Guy", 
    description: "Lives to find bugs you didn’t even know existed. Always has that ‘Did you test this?’ face." 
  },
  [DefendSpecies.ITGuy]: { 
    name: "IT Guy", 
    description: "Can fix your computer, network, and spirit—all while pretending to be annoyed." 
  },
  [DefendSpecies.Cook]: { 
    name: "Cook", 
    description: "Knows exactly how to slice, dice, and occasionally burn both food and code. Culinary and debugging expert." 
  },
  [DefendSpecies.VilatikTuberin]: { 
    name: "Vilatik Tuberin", 
    description: "Rumored to be able to fork any project into oblivion. The father of all modern blockchains." 
  },
  [DefendSpecies.SatoshiNakamoto]: { 
    name: "Satoshi Nakamoto", 
    description: "The ghostly figure everyone worships but no one has seen. Leaves breadcrumbs of cryptography everywhere." 
  },
  [DefendSpecies.GevinWoud]: { 
    name: "Gevin Woud", 
    description: "Believes decentralization can solve world hunger, climate change, and probably achieve world peace too." 
  }
};

export const DefendSpeciesCharacteristics: Record<DefendSpecies, SpeciesTypicalyStats> = {
  [DefendSpecies.FullStackDeveloper]: { 
    attack: 5, 
    defense: 8, 
    travelSpeed: 10, 
    age: 30, 
    name: DefendSpeciesLore[DefendSpecies.FullStackDeveloper].name, 
    description: DefendSpeciesLore[DefendSpecies.FullStackDeveloper].description,
    potential: 5,
    rarity: 5
  },
  [DefendSpecies.RustDeveloper]: { 
    attack: 2, 
    defense: 12, 
    travelSpeed: 2, 
    age: 25, 
    name: DefendSpeciesLore[DefendSpecies.RustDeveloper].name, 
    description: DefendSpeciesLore[DefendSpecies.RustDeveloper].description,
    potential: 10,
    rarity: 6
  },
  [DefendSpecies.PythonDeveloper]: { 
    attack: 4, 
    defense: 4, 
    travelSpeed: 12, 
    age: 45, 
    name: DefendSpeciesLore[DefendSpecies.PythonDeveloper].name, 
    description: DefendSpeciesLore[DefendSpecies.PythonDeveloper].description,
    potential: 2,
    rarity: 4
  },
  [DefendSpecies.CPlusPlusDeveloper]: { 
    attack: 2, 
    defense: 12, 
    travelSpeed: 5, 
    age: 50, 
    name: DefendSpeciesLore[DefendSpecies.CPlusPlusDeveloper].name, 
    description: DefendSpeciesLore[DefendSpecies.CPlusPlusDeveloper].description,
    potential: 3,
    rarity: 6
  },
  [DefendSpecies.MicrosoftDeveloper]: { 
    attack: 2, 
    defense: 3, 
    travelSpeed: 4, 
    age: 45, 
    name: DefendSpeciesLore[DefendSpecies.MicrosoftDeveloper].name, 
    description: DefendSpeciesLore[DefendSpecies.MicrosoftDeveloper].description,
    potential: 1,
    rarity: 3
  },
  [DefendSpecies.HighSchoolDeveloper]: { 
    attack: 1, 
    defense: 6, 
    travelSpeed: 20, 
    age: 5, 
    name: DefendSpeciesLore[DefendSpecies.HighSchoolDeveloper].name, 
    description: DefendSpeciesLore[DefendSpecies.HighSchoolDeveloper].description,
    potential: 8,
    rarity: 2
  },
  [DefendSpecies.CybersecurityGuru]: { 
    attack: 1, 
    defense: 12, 
    travelSpeed: 8, 
    age: 35, 
    name: DefendSpeciesLore[DefendSpecies.CybersecurityGuru].name, 
    description: DefendSpeciesLore[DefendSpecies.CybersecurityGuru].description,
    potential: 5,
    rarity: 7
  },
  [DefendSpecies.LegalCounselor]: { 
    attack: 1, 
    defense: 12, 
    travelSpeed: 3, 
    age: 45, 
    name: DefendSpeciesLore[DefendSpecies.LegalCounselor].name, 
    description: DefendSpeciesLore[DefendSpecies.LegalCounselor].description,
    potential: 5,
    rarity: 4
  },
  [DefendSpecies.VentureCapitalist]: { 
    attack: 1, 
    defense: 12, 
    travelSpeed: 7, 
    age: 45, 
    name: DefendSpeciesLore[DefendSpecies.VentureCapitalist].name, 
    description: DefendSpeciesLore[DefendSpecies.VentureCapitalist].description,
    potential: 3,
    rarity: 6
  },
  [DefendSpecies.AngelInvestor]: { 
    attack: 1, 
    defense: 8, 
    travelSpeed: 12, 
    age: 35, 
    name: DefendSpeciesLore[DefendSpecies.AngelInvestor].name, 
    description: DefendSpeciesLore[DefendSpecies.AngelInvestor].description,
    potential: 5,
    rarity: 6
  },
  [DefendSpecies.ProductOwner]: { 
    attack: 1, 
    defense: 7, 
    travelSpeed: 4, 
    age: 35, 
    name: DefendSpeciesLore[DefendSpecies.ProductOwner].name, 
    description: DefendSpeciesLore[DefendSpecies.ProductOwner].description,
    potential: 3,
    rarity: 4
  },
  [DefendSpecies.CommunityManager]: { 
    attack: 1, 
    defense: 8, 
    travelSpeed: 12, 
    age: 20, 
    name: DefendSpeciesLore[DefendSpecies.CommunityManager].name, 
    description: DefendSpeciesLore[DefendSpecies.CommunityManager].description,
    potential: 5,
    rarity: 4
  },
  [DefendSpecies.AcademicProfessor]: { 
    attack: 1, 
    defense: 10, 
    travelSpeed: 4, 
    age: 45, 
    name: DefendSpeciesLore[DefendSpecies.AcademicProfessor].name, 
    description: DefendSpeciesLore[DefendSpecies.AcademicProfessor].description,
    potential: 6,
    rarity: 7
  },
  [DefendSpecies.QAGuy]: { 
    attack: 1, 
    defense: 12, 
    travelSpeed: 10, 
    age: 30, 
    name: DefendSpeciesLore[DefendSpecies.QAGuy].name, 
    description: DefendSpeciesLore[DefendSpecies.QAGuy].description,
    potential: 3,
    rarity: 5
  },
  [DefendSpecies.ITGuy]: { 
    attack: 1, 
    defense: 10, 
    travelSpeed: 8, 
    age: 30, 
    name: DefendSpeciesLore[DefendSpecies.ITGuy].name, 
    description: DefendSpeciesLore[DefendSpecies.ITGuy].description,
    potential: 3,
    rarity: 5
  },
  [DefendSpecies.Cook]: { 
    attack: 1, 
    defense: 10, 
    travelSpeed: 10, 
    age: 30, 
    name: DefendSpeciesLore[DefendSpecies.Cook].name, 
    description: DefendSpeciesLore[DefendSpecies.Cook].description,
    potential: 5,
    rarity: 4
  },
  [DefendSpecies.VilatikTuberin]: { 
    attack: 15, 
    defense: 15, 
    travelSpeed: 15, 
    age: 20, 
    name: DefendSpeciesLore[DefendSpecies.VilatikTuberin].name, 
    description: DefendSpeciesLore[DefendSpecies.VilatikTuberin].description,
    potential: 15,
    rarity: 15
  },
  [DefendSpecies.SatoshiNakamoto]: { 
    attack: 20, 
    defense: 20, 
    travelSpeed: 20, 
    age: 40, 
    name: DefendSpeciesLore[DefendSpecies.SatoshiNakamoto].name, 
    description: DefendSpeciesLore[DefendSpecies.SatoshiNakamoto].description,
    potential: 20,
    rarity: 20
  },
  [DefendSpecies.GevinWoud]: { 
    attack: 14, 
    defense: 14, 
    travelSpeed: 14, 
    age: 35, 
    name: DefendSpeciesLore[DefendSpecies.GevinWoud].name, 
    description: DefendSpeciesLore[DefendSpecies.GevinWoud].description,
    potential: 15,
    rarity: 15
  }
};

export const defendSpeciesStats: [DefendSpecies, SpeciesTypicalyStats][] = 
  Object.values(DefendSpecies)
    .filter(value => typeof value === 'number')
    .map((key) => [key as DefendSpecies, DefendSpeciesCharacteristics[key as DefendSpecies]]);