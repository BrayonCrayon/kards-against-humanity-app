import React from "react";
import { Game } from "../../Types/Game";

interface HappyLittleGameProviderProps {}

type Dispatch = (action: Action) => void;
type Action =
  | { type: "createGame"; payload: Game }
  | { type: "changeName"; payload: string }
  | { type: "default" };

export interface IHappyLittleGameContext {
  name: string;
  game: {
    id: string;
    name: string;
    judge_id: number;
    code: string;
  };
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
      return { ...state, name: state.name + " I'm happy here!" };
    }
    case "createGame": {
      // call something that creates game
      return { ...state, game: action.payload };
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
    game: {
      id: "",
      name: "",
      judge_id: 0,
      code: "",
    },
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
