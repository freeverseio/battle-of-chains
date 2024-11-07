import { Entity, PrimaryColumn, Column } from "typeorm";

@Entity('chain')
export class Chain {
  @PrimaryColumn({ type: 'integer' })
  chain_id!: number;

  @Column({ type: 'text' })
  name!: string;

  @Column({ type: 'integer' })
  score!: number;
}
