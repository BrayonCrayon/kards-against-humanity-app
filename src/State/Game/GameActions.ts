import { BaseAction } from "../GeneralContext";
import { IGameState } from "./GameState";
import { Game } from "@/Types/Game";
import { BlackCard } from "@/Types/BlackCard";

export class SetGameAction extends BaseAction<IGameState, Game> {
  execute = (state: IGameState) => ({
    ...state,
    game: this.payload,
  });
}

export class SetBlackCardAction extends BaseAction<IGameState, BlackCard> {
  execute = (state: IGameState) => ({
    ...state,
    blackCard: this.payload,
  });
}

export class ToggleSpectation extends BaseAction<IGameState, boolean> {
  execute = (state: IGameState) => ({
    ...state,
    hasSpectator: this.payload,
  })
}

export type GameActions = SetGameAction | SetBlackCardAction | ToggleSpectation;
