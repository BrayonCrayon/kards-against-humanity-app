import { SubmittedCard } from "../Types/ResponseTypes";

export const fillOutBlackCard = (text: string, cards: Array<SubmittedCard>) => {
  let blackCardText = text;
  cards
    .sort((left, right) => left.order - right.order)
    .forEach((card) => {
      if (blackCardText.indexOf("_", 0) < 0) return;

      blackCardText = blackCardText.replace("_", card.text.replace(/\.$/, ""));
    });
  return blackCardText;
};
