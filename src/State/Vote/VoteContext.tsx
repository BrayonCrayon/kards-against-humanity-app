import React, { FC } from "react";
import {
  CLEAR_STATE,
  SELECT_WINNER,
  VoteActionTypes,
  WINNER_SELECTED,
} from "./VoteActions";
import { RoundWinner } from "../../Types/ResponseTypes";
import { BaseContext, getContext, getReducer } from "../GeneralContext";

export interface IVoteState {
  selectedPlayerId: number;
  selectedRoundWinner?: RoundWinner;
}

export const initialVoteState: IVoteState = {
  selectedPlayerId: 0,
};

export const VoteContext =
  React.createContext<BaseContext<IVoteState, VoteActionTypes>>(undefined);

function voteReducer(state: IVoteState, action: VoteActionTypes): IVoteState {
  switch (action.type) {
    case SELECT_WINNER: {
      return {
        ...state,
        selectedPlayerId: action.payload.userId,
      };
    }
    case WINNER_SELECTED: {
      return {
        ...state,
        selectedRoundWinner: action.payload,
      };
    }
    case CLEAR_STATE: {
      return { ...initialVoteState };
    }
    default:
      return state;
  }
}

const VoteProvider: FC = ({ children }) => {
  return (
    <VoteContext.Provider
      value={getReducer<IVoteState, VoteActionTypes>(
        voteReducer,
        initialVoteState
      )}
    >
      {children}
    </VoteContext.Provider>
  );
};

function useVote() {
  return getContext(VoteContext);
}

export { VoteProvider, useVote };
