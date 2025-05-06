import { Card, CardType } from "@/Types/Card";
import { SubmittedCard } from "@/Types/SubmittedCard";

export interface IWhiteCard {
  id: number;
  text: string;
  expansionId: number;
  selected: boolean;
  order: number;
  createdAt?: Date;
  deleted_at?: Date;
}

export class WhiteCard extends Card implements IWhiteCard {
  id: number;
  text: string;
  type: CardType;
  expansionId: number;
  selected: boolean;
  order: number;
  createdAt?: Date;
  deleted_at?: Date;

  constructor(
    id: number = 0,
    text: string = "",
    expansionId: number = 0,
    selected = false,
    order = 0
  ) {
    super();
    this.type = CardType.White;
    this.id = id;
    this.text = text;
    this.expansionId = expansionId;
    this.selected = selected;
    this.order = order;
  }

  getType(): CardType {
    return this.type;
  }
}

export const transformWhiteCardArray = (
    cards: IWhiteCard[],
    hasSubmittedWhiteCards: boolean = false,
    submittedWhiteCardIds: number[] = []
) => {
  return cards.map((item: IWhiteCard) => {
    const alreadySubmitted =
        hasSubmittedWhiteCards &&
        submittedWhiteCardIds.find((cardId: number) => cardId === item.id) !==
        undefined;

    return new WhiteCard(
      item.id,
      item.text,
      item.expansionId,
      alreadySubmitted,
      item.order,
    );
  });
};

export const transformSubmissionsToWhiteCard = (cards: SubmittedCard[]): WhiteCard[] => {
  return cards.map((item) => {
    return new WhiteCard(
      item.id,
      item.text,
      item.expansionId,
      item.selected,
      item.order,
    )
  })
}