import { Field, InputType } from 'type-graphql';
import { CoordinatesInput } from './coordinates';

@InputType()
export class AttackWhereInput {
  @Field(() => Number, { nullable: true })
  chainId?: number;

  @Field(() => CoordinatesInput, { nullable: true })
  coordinates?: CoordinatesInput;
}