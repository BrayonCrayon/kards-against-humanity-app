import {Game, initialGameObject} from "Types/Game";
import {initialUserObject, User} from "Types/User";
import {BlackCard, initialBlackCardObject} from "Types/BlackCard";

export interface IGameState {
  game: Game;
  judge: User;
  blackCard: BlackCard;
}

export const initialGameState: IGameState = {
  judge: initialUserObject(),
  game: initialGameObject(),
  blackCard: initialBlackCardObject(),
};
