import { IWhiteCard } from "./WhiteCard";
import { BlackCard } from "./BlackCard";

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

export interface RoundWinner extends PlayerSubmittedCard {
  blackCard: BlackCard;
}

export interface SubmittedCardsResponse {
  data: Array<PlayerSubmittedCard>;
}

export interface RoundWinnerResponse {
  data: RoundWinner;
}
