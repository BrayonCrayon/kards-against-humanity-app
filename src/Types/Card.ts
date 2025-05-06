export enum CardType {
  Black,
  White,
  None
}

export interface ICard {
  getType: () => CardType;
}

export class Card implements ICard {
  getType(): CardType {
    return CardType.None;
  };
}