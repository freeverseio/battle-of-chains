import { Entity, PrimaryColumn, Column } from "typeorm";

@Entity('nft_type')
export class NFTType {
  @PrimaryColumn({ type: 'integer' })
  id!: number;

  @Column({ type: 'text' })
  name!: string

  @Column({ type: 'int', array: true })
  xp_levels!: number[];

  @Column({ type: 'int', array: true })
  cost_levels!: number[];
}