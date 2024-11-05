import { Entity, PrimaryColumn, Column } from "typeorm";

@Entity('user')
export class User {
  @PrimaryColumn({ type: 'text' })
  address!: string;

  @Column({ type: 'text' })
  name!: string;

  @Column({ type: 'integer' })
  homechain?: number;

  @Column({ type: 'integer' })
  joined_timestamp!: number;

  @Column({ type: 'integer' })
  score!: number;

  @Column({ type: 'integer' })
  treasury!: number;

  @Column({ type: 'integer' })
  health!: number;

  @Column({ type: 'integer' })
  xp!: number;

  @Column({ type: 'integer' })
  level!: number;

  @Column({ type: 'integer' })
  treasury_last_update!: number;

  @Column({ type: 'text', nullable: true })
  current_supported_chain_action?: string;
}
