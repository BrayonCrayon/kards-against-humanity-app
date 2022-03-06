import { RoundWinner } from "../../Types/ResponseTypes";
import { BaseAction } from "../GeneralContext";
import { initialVoteState, IVoteState } from "./VoteState";

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
}

export class ClearStateAction implements BaseAction<IVoteState> {
  execute(state: IVoteState): IVoteState {
    return initialVoteState;
  }
}

export type VoteActionTypes =
  | SelectWinnerAction
  | WinnerSelectedAction
  | ClearStateAction;
