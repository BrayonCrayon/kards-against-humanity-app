import { blackCardFixture } from "../Api/fixtures/blackcardFixture";
import { BlackCard } from "../Types/BlackCard";
import { SubmittedCard } from "../Types/ResponseTypes";
import { fillOutBlackCard } from "./helpers";
import { gameStateExampleResponse } from "../Api/fixtures/gameStateExampleResponse";

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
  it("will add white card text on bottom and bold it for question black cards", () => {
    const expectedCardText = fillOutBlackCard(blackCard, [cardWinner]);

    expect(expectedCardText).toContain(`<strong>${cardWinner.text}</strong>`);
  });

  it("will bold players white card for multiple underline black card", () => {
    const {
      data: { hand },
    } = gameStateExampleResponse;
    const selectedCards = hand.slice(0, 2);

    const expectedCardText = fillOutBlackCard(blackCardFixture, selectedCards);

    selectedCards.forEach((card) => {
      expect(expectedCardText).toContain(
        `<strong>${card.text.replace(/\.$/, "")}</strong>`
      );
    });
  });
});
