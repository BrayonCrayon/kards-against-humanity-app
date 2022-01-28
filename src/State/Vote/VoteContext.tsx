import React, { FC, useReducer } from "react";
import { SELECT_WINNER, VoteActionTypes } from "./VoteActions";

export interface IVoteState {
  selectedPlayerId: number;
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
    throw new Error("useCount must be used within a CountProvider");
  }
  return context;
}

export { VoteProvider, useVote };
