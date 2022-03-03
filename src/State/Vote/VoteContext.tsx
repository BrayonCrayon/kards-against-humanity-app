import React, { FC, useReducer } from "react";
import {
  CLEAR_STATE,
  SELECT_WINNER,
  VoteActionTypes,
  WINNER_SELECTED,
} from "./VoteActions";
import { RoundWinner } from "../../Types/ResponseTypes";

export interface IVoteState {
  selectedPlayerId: number;
  selectedRoundWinner?: RoundWinner;
}

export const initialVoteState: IVoteState = {
  selectedPlayerId: 0,
};

type Dispatch = (action: VoteActionTypes) => void;

export const VoteContext = React.createContext<
  { state: IVoteState; dispatch: Dispatch } | undefined
>(undefined);

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
  const [state, dispatch] = useReducer(voteReducer, initialVoteState);

  const value = { state, dispatch };
  return <VoteContext.Provider value={value}>{children}</VoteContext.Provider>;
};

function useVote() {
  const context = React.useContext(VoteContext);
  if (context === undefined) {
    throw new Error("useVote must be used within a VoteProvider");
  }
  return context;
}

export { VoteProvider, useVote };
