import { Game } from "../../Types/Game";
import { User } from "../../Types/User";
import { BlackCard } from "../../Types/BlackCard";

export interface IGameState {
  game: Game;
  judge: User;
  blackCard: BlackCard;
}

export const initialGameState: IGameState = {
  judge: {
    id: 0,
    name: "",
    whiteCards: [],
    hasSubmittedWhiteCards: false,
  },
  game: {
    id: "",
    name: "",
    judge_id: 0,
    code: "",
  },
  blackCard: {
    id: 0,
    text: "",
    pick: 0,
    expansion_id: 0,
  },
};
