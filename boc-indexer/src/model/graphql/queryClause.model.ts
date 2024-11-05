import { Field, InputType, Int } from 'type-graphql';

@InputType()
export class TransferWhereInput {
  @Field({ nullable: true })
  tokenId?: string;

  @Field({ nullable: true })
  contractAddress?: string;

  @Field({ nullable: true })
  to?: string;

  @Field({ nullable: true })
  from?: string;

  @Field({ nullable: true, name: 'to_startsWith' })
  to_startsWith?: string;
}

@InputType()
export class TokenWhereInput {

  @Field({ nullable: true })
  contractAddress?: string;

  @Field({ nullable: true })
  owner?: string;

  @Field({ nullable: true })
  laosContract?: string;

  @Field({ nullable: true })
  tokenId?: string;

  @Field(() => Int, { nullable: true })
  homeChain?: number;

  @Field(() => String, { nullable: true })
  typeId?: string;
}

@InputType()
export class TokenOwnersWhereInput {
  @Field({ nullable: true })
  laosContract?: string;

  @Field({ nullable: true })
  contractAddress?: string;

  @Field({ nullable: true })
  tokenId?: string;

  @Field({ nullable: true })
  owner?: string;

  @Field(() => Int, { nullable: true })
  homeChain?: number;

  @Field(() => String, { nullable: true })
  typeId?: string;
}