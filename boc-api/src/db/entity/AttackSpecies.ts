import { Entity, PrimaryColumn, Column } from "typeorm";

@Entity('attack_species')
export class AttackSpecies {
  @PrimaryColumn({ type: 'integer' })
  id!: number;

  @Column({ type: 'text' })
  name!: string

  @Column({ type: 'text' })
  description!: string;

  @Column({ type: 'integer' })
  rarity!: number;
}