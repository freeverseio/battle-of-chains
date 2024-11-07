import { SpeciesLore, SpeciesTypicalyStats } from "./species";

export enum DefendSpeciesType {
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

export const DefendSpeciesLore: Record<DefendSpeciesType, SpeciesLore> = {
  [DefendSpeciesType.FullStackDeveloper]: { 
    name: "Full Stack Developer", 
    description: "The mythical jack-of-all-trades who knows just enough front-end and back-end to be dangerous." 
  },
  [DefendSpeciesType.RustDeveloper]: { 
    name: "Rust Developer", 
    description: "Brave and fearless, a developer who laughs in the face of memory leaks, yet somehow always annoyed with C++." 
  },
  [DefendSpeciesType.PythonDeveloper]: { 
    name: "Python Developer", 
    description: "Can get any job done in five lines of code, but don’t ask them about static typing." 
  },
  [DefendSpeciesType.CPlusPlusDeveloper]: { 
    name: "C++ Developer", 
    description: "The wizard of low-level magic, with pointers, manual memory management, and a superiority complex." 
  },
  [DefendSpeciesType.MicrosoftDeveloper]: { 
    name: "Microsoft Developer", 
    description: "An expert in writing code to fit perfectly with Windows updates. Complains if it has to run on Linux." 
  },
  [DefendSpeciesType.HighSchoolDeveloper]: { 
    name: "High-School Developer", 
    description: "Young, hungry, and self-taught—destined to become a legend or quit for TikTok fame." 
  },
  [DefendSpeciesType.CybersecurityGuru]: { 
    name: "Cybersecurity Guru", 
    description: "Lives for catching vulnerabilities and cryptic log files. Knows ten ways to break your app." 
  },
  [DefendSpeciesType.LegalCounselor]: { 
    name: "Legal Counselor", 
    description: "Specializes in making everything you thought was allowed suddenly forbidden." 
  },
  [DefendSpeciesType.VentureCapitalist]: { 
    name: "Venture Capitalist", 
    description: "Pumps money into ideas they barely understand but insists on being the ‘visionary’." 
  },
  [DefendSpeciesType.AngelInvestor]: { 
    name: "Angel Investor", 
    description: "Shows up with money, and a smile, and leaves right before things get complicated." 
  },
  [DefendSpeciesType.ProductOwner]: { 
    name: "Product Owner", 
    description: "Has never coded a day in their life, but knows exactly why your implementation is wrong." 
  },
  [DefendSpeciesType.CommunityManager]: { 
    name: "Community Manager", 
    description: "Keeps the online mobs at bay with memes, emojis, and the occasional thinly veiled PR statement." 
  },
  [DefendSpeciesType.AcademicProfessor]: { 
    name: "Academic Professor", 
    description: "Highly knowledgeable, but only if the knowledge is 10+ years old and theoretical." 
  },
  [DefendSpeciesType.QAGuy]: { 
    name: "QA Guy", 
    description: "Lives to find bugs you didn’t even know existed. Always has that ‘Did you test this?’ face." 
  },
  [DefendSpeciesType.ITGuy]: { 
    name: "IT Guy", 
    description: "Can fix your computer, network, and spirit—all while pretending to be annoyed." 
  },
  [DefendSpeciesType.Cook]: { 
    name: "Cook", 
    description: "Knows exactly how to slice, dice, and occasionally burn both food and code. Culinary and debugging expert." 
  },
  [DefendSpeciesType.VilatikTuberin]: { 
    name: "Vilatik Tuberin", 
    description: "Rumored to be able to fork any project into oblivion. The father of all modern blockchains." 
  },
  [DefendSpeciesType.SatoshiNakamoto]: { 
    name: "Satoshi Nakamoto", 
    description: "The ghostly figure everyone worships but no one has seen. Leaves breadcrumbs of cryptography everywhere." 
  },
  [DefendSpeciesType.GevinWoud]: { 
    name: "Gevin Woud", 
    description: "Believes decentralization can solve world hunger, climate change, and probably achieve world peace too." 
  }
};

export const DefendSpeciesCharacteristics: Record<DefendSpeciesType, SpeciesTypicalyStats> = {
  [DefendSpeciesType.FullStackDeveloper]: { 
    attack: 5, 
    defense: 8, 
    travelSpeed: 10, 
    age: 30, 
    name: DefendSpeciesLore[DefendSpeciesType.FullStackDeveloper].name, 
    description: DefendSpeciesLore[DefendSpeciesType.FullStackDeveloper].description,
    potential: 5,
    rarity: 5
  },
  [DefendSpeciesType.RustDeveloper]: { 
    attack: 2, 
    defense: 12, 
    travelSpeed: 2, 
    age: 25, 
    name: DefendSpeciesLore[DefendSpeciesType.RustDeveloper].name, 
    description: DefendSpeciesLore[DefendSpeciesType.RustDeveloper].description,
    potential: 10,
    rarity: 6
  },
  [DefendSpeciesType.PythonDeveloper]: { 
    attack: 4, 
    defense: 4, 
    travelSpeed: 12, 
    age: 45, 
    name: DefendSpeciesLore[DefendSpeciesType.PythonDeveloper].name, 
    description: DefendSpeciesLore[DefendSpeciesType.PythonDeveloper].description,
    potential: 2,
    rarity: 4
  },
  [DefendSpeciesType.CPlusPlusDeveloper]: { 
    attack: 2, 
    defense: 12, 
    travelSpeed: 5, 
    age: 50, 
    name: DefendSpeciesLore[DefendSpeciesType.CPlusPlusDeveloper].name, 
    description: DefendSpeciesLore[DefendSpeciesType.CPlusPlusDeveloper].description,
    potential: 3,
    rarity: 6
  },
  [DefendSpeciesType.MicrosoftDeveloper]: { 
    attack: 2, 
    defense: 3, 
    travelSpeed: 4, 
    age: 45, 
    name: DefendSpeciesLore[DefendSpeciesType.MicrosoftDeveloper].name, 
    description: DefendSpeciesLore[DefendSpeciesType.MicrosoftDeveloper].description,
    potential: 1,
    rarity: 3
  },
  [DefendSpeciesType.HighSchoolDeveloper]: { 
    attack: 1, 
    defense: 6, 
    travelSpeed: 20, 
    age: 5, 
    name: DefendSpeciesLore[DefendSpeciesType.HighSchoolDeveloper].name, 
    description: DefendSpeciesLore[DefendSpeciesType.HighSchoolDeveloper].description,
    potential: 8,
    rarity: 2
  },
  [DefendSpeciesType.CybersecurityGuru]: { 
    attack: 1, 
    defense: 12, 
    travelSpeed: 8, 
    age: 35, 
    name: DefendSpeciesLore[DefendSpeciesType.CybersecurityGuru].name, 
    description: DefendSpeciesLore[DefendSpeciesType.CybersecurityGuru].description,
    potential: 5,
    rarity: 7
  },
  [DefendSpeciesType.LegalCounselor]: { 
    attack: 1, 
    defense: 12, 
    travelSpeed: 3, 
    age: 45, 
    name: DefendSpeciesLore[DefendSpeciesType.LegalCounselor].name, 
    description: DefendSpeciesLore[DefendSpeciesType.LegalCounselor].description,
    potential: 5,
    rarity: 4
  },
  [DefendSpeciesType.VentureCapitalist]: { 
    attack: 1, 
    defense: 12, 
    travelSpeed: 7, 
    age: 45, 
    name: DefendSpeciesLore[DefendSpeciesType.VentureCapitalist].name, 
    description: DefendSpeciesLore[DefendSpeciesType.VentureCapitalist].description,
    potential: 3,
    rarity: 6
  },
  [DefendSpeciesType.AngelInvestor]: { 
    attack: 1, 
    defense: 8, 
    travelSpeed: 12, 
    age: 35, 
    name: DefendSpeciesLore[DefendSpeciesType.AngelInvestor].name, 
    description: DefendSpeciesLore[DefendSpeciesType.AngelInvestor].description,
    potential: 5,
    rarity: 6
  },
  [DefendSpeciesType.ProductOwner]: { 
    attack: 1, 
    defense: 7, 
    travelSpeed: 4, 
    age: 35, 
    name: DefendSpeciesLore[DefendSpeciesType.ProductOwner].name, 
    description: DefendSpeciesLore[DefendSpeciesType.ProductOwner].description,
    potential: 3,
    rarity: 4
  },
  [DefendSpeciesType.CommunityManager]: { 
    attack: 1, 
    defense: 8, 
    travelSpeed: 12, 
    age: 20, 
    name: DefendSpeciesLore[DefendSpeciesType.CommunityManager].name, 
    description: DefendSpeciesLore[DefendSpeciesType.CommunityManager].description,
    potential: 5,
    rarity: 4
  },
  [DefendSpeciesType.AcademicProfessor]: { 
    attack: 1, 
    defense: 10, 
    travelSpeed: 4, 
    age: 45, 
    name: DefendSpeciesLore[DefendSpeciesType.AcademicProfessor].name, 
    description: DefendSpeciesLore[DefendSpeciesType.AcademicProfessor].description,
    potential: 6,
    rarity: 7
  },
  [DefendSpeciesType.QAGuy]: { 
    attack: 1, 
    defense: 12, 
    travelSpeed: 10, 
    age: 30, 
    name: DefendSpeciesLore[DefendSpeciesType.QAGuy].name, 
    description: DefendSpeciesLore[DefendSpeciesType.QAGuy].description,
    potential: 3,
    rarity: 5
  },
  [DefendSpeciesType.ITGuy]: { 
    attack: 1, 
    defense: 10, 
    travelSpeed: 8, 
    age: 30, 
    name: DefendSpeciesLore[DefendSpeciesType.ITGuy].name, 
    description: DefendSpeciesLore[DefendSpeciesType.ITGuy].description,
    potential: 3,
    rarity: 5
  },
  [DefendSpeciesType.Cook]: { 
    attack: 1, 
    defense: 10, 
    travelSpeed: 10, 
    age: 30, 
    name: DefendSpeciesLore[DefendSpeciesType.Cook].name, 
    description: DefendSpeciesLore[DefendSpeciesType.Cook].description,
    potential: 5,
    rarity: 4
  },
  [DefendSpeciesType.VilatikTuberin]: { 
    attack: 15, 
    defense: 15, 
    travelSpeed: 15, 
    age: 20, 
    name: DefendSpeciesLore[DefendSpeciesType.VilatikTuberin].name, 
    description: DefendSpeciesLore[DefendSpeciesType.VilatikTuberin].description,
    potential: 15,
    rarity: 15
  },
  [DefendSpeciesType.SatoshiNakamoto]: { 
    attack: 20, 
    defense: 20, 
    travelSpeed: 20, 
    age: 40, 
    name: DefendSpeciesLore[DefendSpeciesType.SatoshiNakamoto].name, 
    description: DefendSpeciesLore[DefendSpeciesType.SatoshiNakamoto].description,
    potential: 20,
    rarity: 20
  },
  [DefendSpeciesType.GevinWoud]: { 
    attack: 14, 
    defense: 14, 
    travelSpeed: 14, 
    age: 35, 
    name: DefendSpeciesLore[DefendSpeciesType.GevinWoud].name, 
    description: DefendSpeciesLore[DefendSpeciesType.GevinWoud].description,
    potential: 15,
    rarity: 15
  }
};

export const defendSpeciesStats: [DefendSpeciesType, SpeciesTypicalyStats][] = 
  Object.values(DefendSpeciesType)
    .filter(value => typeof value === 'number')
    .map((key) => {
      const stats = { ...DefendSpeciesCharacteristics[key as DefendSpeciesType] };
      stats.age *= 1;
      return [key as DefendSpeciesType, stats];
    });
