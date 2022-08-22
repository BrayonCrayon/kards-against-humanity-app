import { Game, initialGameObject } from "Types/Game";
import { BlackCard, initialBlackCardObject } from "Types/BlackCard";

export interface IGameState {
  game: Game;
  blackCard: BlackCard;
}

export const initialGameState: IGameState = {
  game: initialGameObject(),
  blackCard: initialBlackCardObject(),
};
