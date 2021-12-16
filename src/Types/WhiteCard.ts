export interface IWhiteCard {
  id: number;
  text: string;
  expansion_id: number;
  selected: boolean;
  created_at?: Date;
  deleted_at?: Date;
}

export class WhiteCard implements IWhiteCard {
  id: number;
  text: string;
  expansion_id: number;
  selected: boolean;
  created_at?: Date;
  deleted_at?: Date;

  constructor(
    id: number = 0,
    text: string = "",
    expansion_id: number = 0,
    selected = false
  ) {
    this.id = id;
    this.text = text;
    this.expansion_id = expansion_id;
    this.selected = selected;
  }
}

export const constructWhiteCardArray = (
  cards: WhiteCard[],
  hasSubmittedWhiteCards: boolean,
  submittedWhiteCardIds: number[]
) => {
  return cards.map((item: IWhiteCard) => {
    const alreadySubmitted =
      hasSubmittedWhiteCards &&
      submittedWhiteCardIds.find((cardId: number) => cardId === item.id) !==
        undefined;

    return new WhiteCard(
      item.id,
      item.text,
      item.expansion_id,
      alreadySubmitted
    );
  });
};
