import { Entity, PrimaryColumn, Column } from "typeorm";

@Entity('log')
export class Log {
  @PrimaryColumn({ type: 'integer' })
  id!: number;

  @Column({ type: 'text' })
  user_address?: string;

  @Column({ type: 'integer' })
  chain?: number;

  @Column({ type: 'integer' })
  timestamp!: number;

  @Column({ type: 'text' })
  comment!: string;
}
