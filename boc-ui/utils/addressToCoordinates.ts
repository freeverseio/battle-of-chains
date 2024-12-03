export function addressToCoordinates(address: string): { x: bigint; y: bigint } {
    const addressHex = address.startsWith('0x') ? address.slice(2) : address;
    const user160 = BigInt('0x' + addressHex);
    const x = user160 >> BigInt(80);
    const mask = (BigInt(1) << BigInt(80)) - BigInt(1);
    const y = user160 & mask;
    return { x, y };
  }