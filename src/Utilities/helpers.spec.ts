import { blackCardFixture } from "../Api/fixtures/blackcardFixture";
import { BlackCard } from "../Types/BlackCard";
import { SubmittedCard } from "../Types/ResponseTypes";
import { fillOutBlackCard } from "./helpers";

const blackCard: BlackCard = {
  ...blackCardFixture,
  text: "What do you say to your spouse in bed?",
  pick: 1,
};

const cardWinner: SubmittedCard = {
  id: 1,
  text: "I am a piglet",
  expansion_id: 1,
  order: 1,
};

describe("Helpers", () => {
  it("will add white card text on bottom for question black cards", () => {
    const expectedCardText = fillOutBlackCard(blackCard, [cardWinner]);

    expect(expectedCardText).toContain(cardWinner.text);
  });
});
