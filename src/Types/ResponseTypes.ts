import { IWhiteCard } from "./WhiteCard";

export interface SubmittedCard extends Partial<IWhiteCard> {
  id: number;
  text: string;
  expansion_id: number;
  order: number;
}

export interface PlayerSubmittedCard {
  user_id: number;
  submitted_cards: Array<SubmittedCard>;
}

export interface SubmittedCardsResponse {
  data: Array<PlayerSubmittedCard>;
}
