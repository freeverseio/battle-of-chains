import { Entity, PrimaryColumn, Column } from "typeorm";

@Entity('chain_action_proposal')
export class ChainActionProposal {
  @PrimaryColumn({ type: 'text' })
  proposal_hash!: string;

  @Column({ type: 'integer' })
  source_chain_id!: number

  @Column({ type: 'integer', nullable: true })
  target_chain_id?: number;

  @Column({ type: 'integer' })
  type!: number;

  @Column({ type: 'integer', nullable: true })
  attack_area?: number;

  @Column({ type: 'text', nullable: true })
  attack_address?: string;

  @Column({ type: 'integer' })
  votes!: number;
}
