import { RoundWinner } from "../../Types/ResponseTypes";
import { BaseAction } from "../GeneralContext";

export const SELECT_WINNER = "SELECT_WINNER";
export const WINNER_SELECTED = "WINNER_SELECTED";
export const CLEAR_STATE = "CLEAR_STATE";

export interface SelectWinnerAction extends BaseAction {
  type: typeof SELECT_WINNER;
  payload: { userId: number };
}

export interface WinnerSelectedAction extends BaseAction {
  type: typeof WINNER_SELECTED;
  payload: RoundWinner;
}

export interface ClearStateAction extends Omit<BaseAction, "payload"> {
  type: typeof CLEAR_STATE;
}

export type VoteActionTypes =
  | SelectWinnerAction
  | WinnerSelectedAction
  | ClearStateAction;
