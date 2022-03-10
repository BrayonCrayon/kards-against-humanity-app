import { User } from "../../Types/User";
import { whiteCardFixture as cardsInHand } from "./whiteCardFixture";

export const userFixture: User = {
  id: 1,
  name: "Rick Sanchez",
  whiteCards: cardsInHand,
  hasSubmittedWhiteCards: false,
};
