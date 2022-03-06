import React, { FC } from "react";
import { VoteActionTypes } from "./VoteActions";
import {
  BaseContext,
  useGenericContext,
  useGenericReducer,
} from "../GeneralContext";
import { initialVoteState, IVoteState } from "./VoteState";

export const VoteContext = React.createContext<
  BaseContext<IVoteState, VoteActionTypes>
>({
  state: initialVoteState,
  dispatch: () => {},
});

function voteReducer(state: IVoteState, action: VoteActionTypes): IVoteState {
  return action.execute(state);
}

const VoteProvider: FC = ({ children }) => {
  return (
    <VoteContext.Provider
      value={useGenericReducer<IVoteState, VoteActionTypes>(
        voteReducer,
        initialVoteState
      )}
    >
      {children}
    </VoteContext.Provider>
  );
};

function useVote() {
  return useGenericContext(VoteContext);
}

export { VoteProvider, useVote };
