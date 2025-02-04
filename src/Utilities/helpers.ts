import { BlackCard } from "Types/BlackCard";
import { WhiteCard } from "Types/WhiteCard";
import { Expansion, ExpansionOption } from "Types/Expansion";
import { SubmittedCard } from "Types/SubmittedCard";
import { CardSize } from "Components/BlackKard";
import { User } from "Types/User";

export const fillOutBlackCard = (blackCard: BlackCard, cards: Array<SubmittedCard>): string => {
  let blackCardText = blackCard.text;

  if (!blackCard.text.includes("_")) {
    return `${blackCardText}\n\n<strong>${cards[0].text}</strong>`;
  }

  cards
    .sort((left, right) => left.order - right.order)
    .forEach((card) => {
      if (blackCardText.indexOf("_", 0) < 0) return;

      blackCardText = blackCardText.replace("_", `<strong>${card.text.replace(/\.$/, "")}</strong>`);
    });
  return blackCardText;
};

export const decrementPreviouslySelectedCardPositions = (clone: WhiteCard[]) => {
  clone.forEach((item) => {
    if (item.order > 0) {
      item.order -= 1;
    }
    item.selected = item.order !== 0;
  });
};

export const ExpansionToExpansionOption = (expansion: Expansion): ExpansionOption => {
  return {
    expansion,
    isSelected: true,
  };
};

export const ExpansionsToExpansionOptions = (expansions: Expansion[]): ExpansionOption[] => {
  return expansions.map((item) => ExpansionToExpansionOption(item));
};

export const canSubmit = (hand: WhiteCard[], pickAmount: number): boolean => {
  if (hand.length === 0 || pickAmount === 0) return false;

  return hand.filter((card) => card.selected).length === pickAmount;
};

export const toMinutesSeconds = (seconds: number) => {
  const date = new Date(seconds * 1000);

  const formattedSeconds = date.getSeconds() > 9 ? date.getSeconds() : `0${date.getSeconds()}`;
  const formattedMinutes = date.getMinutes();
  return `${formattedMinutes}:${formattedSeconds}`;
};

export const displayScore = (score: number): string => {
  return score < 10 ? `0${score}` : score.toString();
}

export const cardSize = (text: string): CardSize => {
  if (text.length < 100) {
    return CardSize.SMALL
  }

  return text.length < 200 ? CardSize.MEDIUM : CardSize.LARGE;
}

export const nonJudgePlayers = (judgeId: number, players: User[]): User[] => {
  return players.filter((player: User) => player.id !== judgeId);
}
