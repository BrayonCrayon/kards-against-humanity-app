import { IWhiteCard } from "Types/WhiteCard";
import { submittedCardFactory } from "Tests/Factories/SubmittedCardFactory";

export interface ISubmittedCard extends Partial<IWhiteCard> {
  id: number;
  text: string;
  expansionId: number;
  order: number;
}

export class SubmittedCard implements ISubmittedCard {
  id: number;
  text: string;
  expansionId: number;
  order: number;
  selected?: boolean | undefined;
  createdAt?: Date | undefined;
  deleted_at?: Date | undefined;

  constructor(submittedCard: ISubmittedCard = submittedCardFactory()) {
    this.id = submittedCard.id;
    this.text = submittedCard.text;
    this.expansionId = submittedCard.expansionId;
    this.order = submittedCard.order;
    this.selected = submittedCard.selected;
    this.createdAt = submittedCard.createdAt;
    this.deleted_at = submittedCard.deleted_at;
  }
}

export const transformSubmittedCardArray = (cards: SubmittedCard[]) => {
  return cards.map((item: ISubmittedCard) => {
    return new SubmittedCard({
      id: item.id,
      text: item.text,
      expansionId: item.expansionId,
      order: item.order,
      selected: item.selected,
      createdAt: item.createdAt,
      deleted_at: item.deleted_at,
    });
  });
};