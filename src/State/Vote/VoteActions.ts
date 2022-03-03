import { PlayerSubmittedCard, RoundWinner } from "../../Types/ResponseTypes";

export const SELECT_WINNER = "SELECT_WINNER";
export const WINNER_SELECTED = "WINNER_SELECTED";
export const CLEAR_STATE = "CLEAR_STATE";

export interface Action {
  type: string;
  payload: object;
}

export interface SelectWinnerAction extends Action {
  type: typeof SELECT_WINNER;
  payload: { userId: number };
}

export interface WinnerSelectedAction extends Action {
  type: typeof WINNER_SELECTED;
  payload: RoundWinner;
}

export interface ClearStateAction extends Omit<Action, "payload"> {
  type: typeof CLEAR_STATE;
}

export type VoteActionTypes =
  | SelectWinnerAction
  | WinnerSelectedAction
  | ClearStateAction;
