export enum FactorySpecies {
  AttackFactory,
  DefendFactory,
}

export type SpeciesLore = {
  name: string;
  description: string;
};

export type SpeciesTypicalyStats = {
  name: string;
  description: string;
  attack: number;
  defense: number;
  travelSpeed: number;
  age: number;
  potential: number;
  rarity: number;
};


