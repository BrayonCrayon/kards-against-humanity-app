import {RoundWinner} from "Types/ResponseTypes";

export interface IVoteState {
  selectedPlayerId: number;
  selectedRoundWinner?: RoundWinner;
}

export const initialVoteState: IVoteState = {
  selectedPlayerId: 0,
};
