export interface Game {
  id: string;
  name: string;
  judgeId: number;
  createdAt?: Date;
  deleted_at?: Date;
  code: string;
  redrawLimit: number;
  judgeTimer: number | null;
  selectionTimer: number | null;
}

export const initialGameObject = (): Game => {
  return {
    id: "",
    name: "",
    judgeId: 0,
    code: "",
    redrawLimit: 2,
    judgeTimer: null,
    selectionTimer: null,
  };
};
