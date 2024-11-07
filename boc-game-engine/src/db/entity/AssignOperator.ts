import { Entity, PrimaryColumn, Column } from "typeorm";

@Entity('operator_assignment')
export class AssignOperator {
  @PrimaryColumn({ type: 'text' })
  assigner!: string;

  @PrimaryColumn({ type: 'text' })
  operator!: string;

  @PrimaryColumn({ type: 'integer' })
  chain_id!: number;

  @Column({ type: 'integer' })
  timestamp!: number;
}
