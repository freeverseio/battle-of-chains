import { Entity, PrimaryColumn, Column } from "typeorm";

@Entity('asset')
export class Asset {
  @PrimaryColumn({ type: 'integer' })
  chain_id!: number;

  @PrimaryColumn({ type: 'text' })
  token_id!: string

  @Column({ type: 'text' })
  type!: string;

  @Column({ type: 'integer' })
  creation_timestamp!: number;

  @Column({ type: 'text' })
  owner!: string;

  @Column({ type: 'integer' })
  xp!: number;

  @Column({ type: 'integer' })
  health!: number;

  @Column({ type: 'integer' })
  level!: number;

  @Column({ type: 'integer' })
  attack!: number;

  @Column({ type: 'integer' })
  defense!: number;

  @Column({ type: 'integer' })
  age!: number;

  @Column({ type: 'integer' })
  travel_speed!: number;

  @Column({ type: 'integer' })
  potential!: number;

  @Column({ type: 'integer' })
  species!: number;

  @Column({ type: 'integer' })
  stats_last_update!: number;

  @Column({ type: 'integer' })
  asset_state!: number;

  @Column({ type: 'integer', nullable: true })
  pending_attack_id?: number;
}
