import { blackCardFixture } from "@/Api/fixtures/blackcardFixture";
import { BlackCard } from "@/Types/BlackCard";
import { canSubmit, cardSize, displayScore, fillOutBlackCard, nonJudgePlayers, toMinutesSeconds } from "./helpers";
import { gameStateExampleResponse } from "@/Api/fixtures/gameStateExampleResponse";
import {
  gameStateAllPlayerSubmittedCardsExampleResponse
} from "@/Api/fixtures/gameStateAllPlayerSubmittedCardsExampleResponse";
import { transformWhiteCardArray, WhiteCard } from "@/Types/WhiteCard";
import { SubmittedCard } from "@/Types/SubmittedCard";
import { CardSize } from "@/Components/BlackKard";
import { userFactory } from "@/Tests/Factories/UserFactory";
import { User } from "@/Types/User";
import { blackCardFactory } from "@/Tests/Factories/BlackCardFactory";

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

  it("will will replace underlines properly when there are more underlines in each section to be replaced", () => {
    const blackCard = blackCardFactory({
      text: "What do ___ say to other ___, and go boom in the ___.",
    })
    const { data: { hand } } = gameStateExampleResponse;
    const selectedCards = hand.slice(0, 3);
    let expectedText = blackCard.text;
    selectedCards.forEach((card) => {
      expectedText = expectedText.replace("___", `<strong>${card.text.replace(/\.$/, "")}</strong>`);
    })

    const result = fillOutBlackCard(blackCard, selectedCards);

    selectedCards.forEach((card) => {
      expect(result).toContain(`<strong>${card.text.replace(/\.$/, "")}</strong>`);
    });
    expect(result).not.toContain('_')
    expect(result).toEqual(expectedText);
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

  it.each([
    ["5:00", 300],
    ["4:59", 299],
    ["2:30", 150],
    ["1:01", 61],
    ["0:00", 0],
  ])("will return %s from %d", (expected, seconds) => {
    expect(toMinutesSeconds(seconds)).toEqual(expected);
  });

  it.each([
      [23, "23"],
      [3, "03"]
  ])("will cast score as string", (score, expected) => {
    expect(displayScore(score)).toEqual(expected)
  });

  it.each([
    [CardSize.SMALL, 99],
    [CardSize.MEDIUM, 100],
    [CardSize.MEDIUM, 199],
    [CardSize.LARGE, 200],
  ])("will return %s card size when text is %d characters", (expectedSize, characterCount) => {
    const text = "0".repeat(characterCount)

    expect(cardSize(text)).toEqual(expectedSize)
  });

  it("will return all players and exclude the player that is the judge", () => {
    const players = Array.from({ length: 4 }).map(() => userFactory());
    const judgeId = players[2].id

    const result = nonJudgePlayers(judgeId, players)

    expect(result).toHaveLength(players.length - 1)
    result.forEach((player: User) => expect(player.id).not.toEqual(judgeId))
  });
});
