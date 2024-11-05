// utils/enums.ts
export enum ChainActionType {
  DEFEND = 0,
  IMPROVE = 1,
  ATTACK_AREA = 2,
  ATTACK_ADDRESS = 3,
}

export enum AttackArea {
  NULL = 0,
  NORTH = 1,
  SOUTH = 2,
  EAST = 3,
  WEST = 4,
  ALL = 5,
}

export interface ChainAction {
  targetChain: number;
  actionType: ChainActionType;
  attackArea: AttackArea;
  attackAddress: `0x${string}`; // Ethers.js address type
}

interface OptionParams {
  actionType: ChainActionType;
  attackArea: AttackArea;
  attackAddress: `0x${string}`;
}

export const optionsMap: Record<string, OptionParams> = {
  option1: {
    actionType: ChainActionType.IMPROVE,
    attackArea: AttackArea.NULL,
    attackAddress: "0x0000000000000000000000000000000000000000",
  },
  option2: {
    actionType: ChainActionType.DEFEND,
    attackArea: AttackArea.NULL,
    attackAddress: "0x0000000000000000000000000000000000000000",
  },
  option3: {
    actionType: ChainActionType.ATTACK_AREA,
    attackArea: AttackArea.ALL, // Adjust as needed
    attackAddress: "0x0000000000000000000000000000000000000000",
  },
  option4: {
    actionType: ChainActionType.ATTACK_ADDRESS,
    attackArea: AttackArea.NULL,
    attackAddress: "0x0000000000000000000000000000000000000000", // Will be set based on user input
  },
};
