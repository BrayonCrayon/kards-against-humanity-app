export interface BlackCard {
  id: number;
  text: string;
  pick: number;
  expansion_id: number;
  created_at?: Date;
  deleted_at?: Date;
}

export const initialBlackCardObject = (): BlackCard => {
    return {
        id: 0,
        text: "",
        pick: 0,
        expansion_id: 0,
    }
}