import { WhiteCard } from "./WhiteCard";

export interface User {
  id: number;
  name: string;
  whiteCards: WhiteCard[];
}
