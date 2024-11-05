import { AppDataSource } from '../db/AppDataSource';
import { Chain, ProcessStatus} from '../db/entity';
import { ObjectType, Field, Int } from 'type-graphql';

export enum ProcessStatusEnum {
  FREE = "FREE",
  PROCESSING = "PROCESSING"
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

export async function getAllChains(): Promise<ChainOutput[]> {
    const repository = AppDataSource.getRepository(Chain);
    const all = await repository.find();
    return all.map(entry => new ChainOutput(entry));
}

export async function getStatus(): Promise<ProcessStatusOutput[]> {
  const repository = AppDataSource.getRepository(ProcessStatus);
  const all = await repository.find();
  return all.map(entry => new ProcessStatusOutput(entry));
}

export async function setStatus(status: string) {
  const repository = AppDataSource.getRepository(ProcessStatus);
  await repository.save({
    id: 1,
    status: status,
    last_update: new Date()
  });
}