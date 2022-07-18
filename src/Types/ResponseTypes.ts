import {IWhiteCard} from "./WhiteCard";
import {BlackCard} from "./BlackCard";

export interface SubmittedCard extends Partial<IWhiteCard> {
  id: number;
  text: string;
  expansionId: number;
  order: number;
}

export interface PlayerSubmittedCard {
  user_id: number;
  submitted_cards: Array<SubmittedCard>;
}

export interface RoundWinner extends PlayerSubmittedCard {
  black_card: BlackCard;
}

export interface SubmittedCardsResponse {
  data: Array<PlayerSubmittedCard>;
}

export interface RoundWinnerResponse {
  data: RoundWinner;
}

export interface PlayerCard {
  id: number;
  text: string;
  expansionId: number;
  order: number;
  selected: boolean;
}

export interface Resource<T> {
  data: T
}