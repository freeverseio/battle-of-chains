import { Attack, AttackWhereInput } from '../types';
import { attacksQuery } from '../queries';
import { parse } from 'graphql';
import { Coordinates } from '../types/coordinates';
import { CoordinatesHelper } from './CoordinatesHelper';

export class AttackService {
  constructor(private context: any) { }

  async getAttacks(where?: AttackWhereInput): Promise<Attack[]> {
    let query = '';
    if (where && where.chainId && where.coordinates) {
      const { x, y } = where.coordinates;
      const address = this.getAttackAddress(where.chainId, x!, y!);
      query = attacksQuery(address);
    } else {
      query = attacksQuery();
    }
    const result = await this.context.indexerExec({
        document: parse(query),
        context: this.context,
    });
    console.log(result);
    const attacks = result.data.transfers.map((transfer: any) => {
      const coordinates = CoordinatesHelper.getXYFromAddress(transfer.to);
      const attack = new Attack({
        from: transfer.from,
        to: transfer.to,
        tokenId: transfer.tokenId,
        coordinates: coordinates,
      });
      console.log('attack', attack);
      return attack;
    });
    console.log('attacks', attacks);
    return attacks;
  }

  getAttackAddress(targetChainId: number, x: number, y: number) {
    const targetChainIdBig = BigInt(targetChainId);
    const xBig = BigInt(x);
    const yBig = BigInt(y);

    const addressBig = (targetChainIdBig << 64n) | (xBig << 32n) | yBig;
    const addressHex = addressBig.toString(16).padStart(40, '0');

    return '0x' + addressHex;
  }
}
