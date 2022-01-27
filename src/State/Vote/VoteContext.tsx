import React, { useReducer } from "react";
import { SubmittedCard } from "../../Types/ResponseTypes";
import { SELECT_WINNER, VoteActionTypes } from "./VoteActions";

export interface IVoteState {
  selectedSubmittedCard: SubmittedCard;
}

export const initialState: IVoteState = {
  selectedSubmittedCard: {
    id: 0,
    text: "",
    expansion_id: 0,
    order: 0,
  },
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
        selectedSubmittedCard: action.payload,
      };
    }
    default:
      return state;
  }
}

function VoteProvider(children: React.ReactNode) {
  const [state, dispatch] = useReducer(voteReducer, initialState);

  return (
    <VoteContext.Provider value={{ state, dispatch }}>
      {children}
    </VoteContext.Provider>
  );
}

function useVote() {
  const context = React.useContext(VoteContext);
  if (context === undefined) {
    throw new Error("useCount must be used within a CountProvider");
  }
  return context;
}

export { VoteProvider, useVote };
