import { SubmittedCard } from "../Types/ResponseTypes";
import { BlackCard } from "../Types/BlackCard";
import { WhiteCard } from "../Types/WhiteCard";

export const fillOutBlackCard = (
  blackCard: BlackCard,
  cards: Array<SubmittedCard>
): string => {
  let blackCardText = blackCard.text;

  if (!blackCard.text.includes("_")) {
    return `${blackCardText}\n\n<strong>${cards[0].text}</strong>`;
  }

  cards
    .sort((left, right) => left.order - right.order)
    .forEach((card) => {
      if (blackCardText.indexOf("_", 0) < 0) return;

      blackCardText = blackCardText.replace(
        "_",
        `<strong>${card.text.replace(/\.$/, "")}</strong>`
      );
    });
  return blackCardText;
};

export const sortHand = (clone: WhiteCard[]) => {
  clone.forEach((item) => {
    if (item.order > 0) {
      item.order -= 1;
    }
    item.selected = item.order !== 0;
  });
};
