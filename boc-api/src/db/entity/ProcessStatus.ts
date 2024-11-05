import { Entity, PrimaryColumn, Column } from "typeorm";

@Entity('process_status')
export class ProcessStatus {
  @PrimaryColumn({ type: 'integer' })
  id!: number;

  @Column({ type: 'text' })
  status!: string;

  @Column({ type: 'timestamp' })
  last_update!: Date;
}
