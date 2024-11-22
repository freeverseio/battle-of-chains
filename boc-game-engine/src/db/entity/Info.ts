import { Entity, PrimaryColumn, Column } from "typeorm";

@Entity('info')
export class Info {
  @PrimaryColumn({ type: 'text' })
  key!: string;

  @Column({ type: 'jsonb' })
  value!: unknown;
}