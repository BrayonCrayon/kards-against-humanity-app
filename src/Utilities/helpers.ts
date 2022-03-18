import { SubmittedCard } from "../Types/ResponseTypes";
import { BlackCard } from "../Types/BlackCard";

export const fillOutBlackCard = (
  blackCard: BlackCard,
  cards: Array<SubmittedCard>
): string => {
  let blackCardText = blackCard.text;

  if (!blackCard.text.includes("_")) {
    return `${blackCardText}\n\n${cards[0].text}`;
  }

  cards
    .sort((left, right) => left.order - right.order)
    .forEach((card) => {
      if (blackCardText.indexOf("_", 0) < 0) return;

      blackCardText = blackCardText.replace("_", card.text.replace(/\.$/, ""));
    });
  return blackCardText;
};
