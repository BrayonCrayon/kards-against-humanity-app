export interface BlackCard {
  id: number;
  text: string;
  pick: number;
  expansionId: number;
  createdAt?: Date;
  deleted_at?: Date;
}

export const initialBlackCardObject = (): BlackCard => {
    return {
        id: 0,
        text: "",
        pick: 0,
        expansionId: 0,
    }
}