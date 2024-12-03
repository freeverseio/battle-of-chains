// Function to map coordinates to map extent
export function mapCoordinates(x: bigint, y: bigint): { x: number; y: number } {
    const maxCoord = (BigInt(1) << BigInt(80)) - BigInt(1);
    const xScale = maxCoord / BigInt(1024);
    const yScale = maxCoord / BigInt(1024);
    const xCoord = Number(x / xScale);
    const yCoord = Number(y / yScale);
    return { x: xCoord, y: yCoord };
  }