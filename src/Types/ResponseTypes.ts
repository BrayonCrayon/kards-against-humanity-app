import { IWhiteCard } from "./WhiteCard";

export interface PlayerSubmittedCard {
  user_id: number;
  submitted_cards: Array<IWhiteCard>;
}

export interface SubmittedCardsResponse {
  data: Array<PlayerSubmittedCard>;
}
