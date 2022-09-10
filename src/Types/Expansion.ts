export interface Expansion {
  id: number;
  name: string;
  whiteCardCount: number;
  createdAt?: Date;
  deleted_at?: Date;
}

export type ExpansionOption = {
  expansion: Expansion;
  isSelected: boolean;
};