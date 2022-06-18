import React, { FC } from "react";
import { VoteActionTypes } from "./VoteActions";
import { BaseContext, useGenericReducer } from "../GeneralContext";
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
      value={useGenericReducer(voteReducer, initialVoteState)}
    >
      {children}
    </VoteContext.Provider>
  );
};

export { VoteProvider };
