import { Entity, PrimaryColumn, Column } from "typeorm";

@Entity('defend_species')
export class DefendSpecies {
  @PrimaryColumn({ type: 'integer' })
  id!: number;

  @Column({ type: 'text' })
  name!: string

  @Column({ type: 'text' })
  description!: string;

  @Column({ type: 'integer' })
  rarity!: number;
}