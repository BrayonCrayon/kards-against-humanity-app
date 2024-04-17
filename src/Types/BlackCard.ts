import { Card } from "Types/Card";

export interface IBlackCard {
  id: number;
  text: string;
  pick: number;
  expansionId: number;
  createdAt?: Date;
  deleted_at?: Date;
}

export class BlackCard extends Card implements IBlackCard {
    id: number;
    text: string;
    pick: number;
    expansionId: number;
    createdAt?: Date | undefined;
    deleted_at?: Date | undefined;

    constructor(
      id: number = 0,
      text: string = "",
      pick: number = 1,
      expansionId: number = 0,
      createdAt?: Date | undefined,
      deleted_at?: Date | undefined,
    ) {
      super();
      this.id = id;
      this.text = text;
      this.pick = pick;
      this.expansionId = expansionId;
      this.createdAt = createdAt;
      this.deleted_at = deleted_at;
    }
}

export const initialBlackCardObject = (): BlackCard => {
    return {
        id: 0,
        text: "",
        pick: 0,
        expansionId: 0,
    }
}