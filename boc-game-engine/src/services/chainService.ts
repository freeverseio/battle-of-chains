import { DataSource } from "typeorm";
import { Chain, ProcessStatus } from "../db/entity";
import { ObjectType, Field, Int } from "type-graphql";

export enum ProcessStatusEnum {
  FREE = "FREE",
  PROCESSING = "PROCESSING",
}

@ObjectType()
export class ChainOutput {
  @Field(() => Int)
  chain_id!: number;

  @Field(() => Int)
  score!: number;

  @Field(() => String)
  name!: string;

  constructor(props: Partial<ChainOutput>) {
    Object.assign(this, props);
  }
}

@ObjectType()
export class ProcessStatusOutput {
  @Field(() => Int)
  id!: number;

  @Field(() => String)
  status!: string;

  @Field(() => Date)
  last_update!: Date;

  constructor(props: Partial<ProcessStatusOutput>) {
    Object.assign(this, props);
  }
}

export class ChainService {
  private dataSource: DataSource;

  constructor(dataSource: DataSource) {
    this.dataSource = dataSource;
  }

  async getAllChains(): Promise<ChainOutput[]> {
    const repository = this.dataSource.getRepository(Chain);
    const all = await repository.find();
    return all.map((entry) => new ChainOutput(entry));
  }

  async getStatus(): Promise<ProcessStatusOutput[]> {
    const repository = this.dataSource.getRepository(ProcessStatus);
    const all = await repository.find();
    return all.map((entry) => new ProcessStatusOutput(entry));
  }

  async setStatus(status: string): Promise<void> {
    const repository = this.dataSource.getRepository(ProcessStatus);
    await repository.save({
      id: 1,
      status: status,
      last_update: new Date(),
    });
  }
}
