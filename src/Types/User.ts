import { WhiteCard } from "./WhiteCard";

export interface User {
  id: number;
  name: string;
  score: number;
  whiteCards: WhiteCard[];
  hasSubmittedWhiteCards: boolean;
}

export interface UserResponse {
  id: number;
  name: string;
  score: number;
  has_submitted_white_cards: boolean;
  created_at: string;
  updated_at: string;
}

export const transformUser = (user: UserResponse): User => {
  return {
    ...user,
    hasSubmittedWhiteCards: user.has_submitted_white_cards,
    whiteCards: [],
  };
};

export const transformUsers = (users: UserResponse[]): User[] =>
  users.map((user) => transformUser(user));
