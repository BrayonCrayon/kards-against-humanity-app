import React from "react";

interface HappyLittleGameProviderProps {}
type Dispatch = (action: Action) => void;
type Action = { type: "changeName" };
type State = { count: number };

export interface IHappyLittleGameContext {
  name: string;
}

const HappyLittleGameStateContext = React.createContext<
  { state: IHappyLittleGameContext; dispatch: Dispatch } | undefined
>(undefined);

function HappyLittleGameReducer(
  state: IHappyLittleGameContext,
  action: Action
) {
  switch (action.type) {
    case "changeName": {
      return { name: state.name + " I'm happy here!" };
    }
    default: {
      throw new Error(`Unhandled action type: ${action.type}`);
    }
  }
}

const HappyLittleGameProvider: React.FC<HappyLittleGameProviderProps> = ({
  children,
}) => {
  const [state, dispatch] = React.useReducer(HappyLittleGameReducer, {
    name: "Bob",
  });
  const value = { state, dispatch };

  return (
    <HappyLittleGameStateContext.Provider value={value}>
      {children}
    </HappyLittleGameStateContext.Provider>
  );
};

function useHappyLittleHook() {
  const context = React.useContext(HappyLittleGameStateContext);
  if (context === undefined) {
    throw new Error("You're not doing it right");
  }
  return context;
}

export {
  HappyLittleGameProvider,
  HappyLittleGameStateContext,
  useHappyLittleHook,
};
