import { User } from "../../Types/User";
import { whiteCardFixture as cardsInHand } from "./whiteCardFixture";

export const userFixture: User = {
  id: 1,
  name: "Rick Sanchez",
  score: 0,
  whiteCards: cardsInHand,
  hasSubmittedWhiteCards: false,
};
