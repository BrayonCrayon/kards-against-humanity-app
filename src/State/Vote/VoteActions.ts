import { RoundWinner } from "../../Types/ResponseTypes";
import { BaseAction } from "../GeneralContext";
import { initialVoteState, IVoteState } from "./VoteState";

export class SelectWinnerAction extends BaseAction<IVoteState, number> {
  execute = (state: IVoteState): IVoteState => ({
    ...state,
    selectedPlayerId: this.payload,
  });
}

export class WinnerSelectedAction extends BaseAction<IVoteState, RoundWinner> {
  execute = (state: IVoteState): IVoteState => ({
    ...state,
    selectedRoundWinner: this.payload,
  });
}

export class ClearStateAction extends BaseAction<IVoteState, null> {
  execute = (state: IVoteState): IVoteState => initialVoteState;
}

export type VoteActionTypes =
  | SelectWinnerAction
  | WinnerSelectedAction
  | ClearStateAction;
