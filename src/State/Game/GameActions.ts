import { BaseAction } from "../GeneralContext";
import { IGameState } from "./GameState";
import { Game } from "../../Types/Game";
import { User } from "../../Types/User";
import { BlackCard } from "../../Types/BlackCard";

export class SetGameAction extends BaseAction<IGameState, Game> {
  execute = (state: IGameState) => ({
    ...state,
    game: this.payload,
  });
}

export class SetJudgeAction extends BaseAction<IGameState, User> {
  execute = (state: IGameState) => ({
    ...state,
    judge: this.payload,
  });
}

export class SetBlackCardAction extends BaseAction<IGameState, BlackCard> {
  execute = (state: IGameState) => ({
    ...state,
    blackCard: this.payload,
  });
}

export type GameActions = SetGameAction | SetJudgeAction | SetBlackCardAction;
