export interface IWhiteCard {
  id: number;
  text: string;
  expansionId: number;
  selected: boolean;
  order: number;
  createdAt?: Date;
  deleted_at?: Date;
}

export class WhiteCard implements IWhiteCard {
  id: number;
  text: string;
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
    this.id = id;
    this.text = text;
    this.expansionId = expansionId;
    this.selected = selected;
    this.order = order;
  }
}

export const transformWhiteCardArray = (
    cards: WhiteCard[],
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
