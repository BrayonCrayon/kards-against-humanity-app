import { blackCardFixture } from "../Api/fixtures/blackcardFixture";
import { BlackCard } from "../Types/BlackCard";
import { SubmittedCard } from "../Types/ResponseTypes";
import { canSubmit, fillOutBlackCard } from "./helpers";
import { gameStateExampleResponse } from "../Api/fixtures/gameStateExampleResponse";
import { gameStateAllPlayerSubmittedCardsExampleResponse } from "../Api/fixtures/gameStateAllPlayerSubmittedCardsExampleResponse";
import { transformWhiteCardArray, WhiteCard } from "../Types/WhiteCard";

const blackCard: BlackCard = {
  ...blackCardFixture,
  text: "What do you say to your spouse in bed?",
  pick: 1,
};

const cardWinner: SubmittedCard = {
  id: 1,
  text: "I am a piglet",
  expansionId: 1,
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
      expect(expectedCardText).toContain(`<strong>${card.text.replace(/\.$/, "")}</strong>`);
    });
  });

  it("will return false when player has no submitted cards", () => {
    const {
      data: { hand, blackCard },
    } = gameStateExampleResponse;

    expect(canSubmit(hand, blackCard.pick)).toBeFalsy();
  });

  it("will return true when player has required submitted amount", () => {
    const data = gameStateAllPlayerSubmittedCardsExampleResponse;
    const hand: WhiteCard[] = transformWhiteCardArray(data.data.hand);

    for (let i = 0; i < data.data.blackCard.pick; ++i) {
      hand[i].selected = true;
    }

    expect(canSubmit(hand, data.data.blackCard.pick)).toBeTruthy();
  });

  it("will return false when player does not have a hand", () => {
    const {
      data: { blackCard },
    } = gameStateExampleResponse;

    expect(canSubmit([], blackCard.pick)).toBeFalsy();
  });

  it("will return false when player is loading in the game", () => {
    expect(canSubmit([], 0)).toBeFalsy();
  });

  it("will return false when player has not submitted any cards and pick amount is 0", () => {
    const { data } = gameStateExampleResponse;
    expect(canSubmit(data.hand, 0)).toBeFalsy();
  });
});
