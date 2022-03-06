import { RoundWinner } from "../../Types/ResponseTypes";
import { BaseAction } from "../GeneralContext";
import { initialVoteState, IVoteState } from "./VoteState";

// export const SELECT_WINNER = "SELECT_WINNER";
// export const WINNER_SELECTED = "WINNER_SELECTED";
// export const CLEAR_STATE = "CLEAR_STATE";

export class SelectWinnerAction implements BaseAction<IVoteState> {
  userId: number;

  constructor(userId: number) {
    this.userId = userId;
  }

  execute(state: IVoteState): IVoteState {
    return {
      ...state,
      selectedPlayerId: this.userId,
    };
  }
  // type: typeof SELECT_WINNER;
  // payload: { userId: number };
}

export class WinnerSelectedAction implements BaseAction<IVoteState> {
  winner: RoundWinner;

  constructor(winner: RoundWinner) {
    this.winner = winner;
  }

  execute(state: IVoteState): IVoteState {
    return {
      ...state,
      selectedRoundWinner: this.winner,
    };
  }
  // type: typeof WINNER_SELECTED;
  // payload: RoundWinner;
}

export class ClearStateAction implements BaseAction<IVoteState> {
  execute(state: IVoteState): IVoteState {
    return initialVoteState;
  }
  // type: typeof CLEAR_STATE;
}

export type VoteActionTypes =
  | SelectWinnerAction
  | WinnerSelectedAction
  | ClearStateAction;
