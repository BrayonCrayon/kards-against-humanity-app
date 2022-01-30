import { SubmittedCard } from "../../Types/ResponseTypes";

export const SELECT_WINNER = "SELECT_WINNER";

export interface Action {
  type: string;
  payload: object;
}

export interface SelectWinnerAction extends Action {
  type: typeof SELECT_WINNER;
  payload: { userId: number };
}

export type VoteActionTypes = SelectWinnerAction;
