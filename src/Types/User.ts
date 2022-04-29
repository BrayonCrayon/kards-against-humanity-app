import {WhiteCard} from "./WhiteCard";

export interface User {
  id: number;
  name: string;
  score: number;
  whiteCards: WhiteCard[];
  hasSubmittedWhiteCards: boolean;
  redrawCount: number;
}

export interface UserResponse {
  id: number;
  name: string;
  score: number;
  has_submitted_white_cards: boolean;
  created_at: string;
  updated_at: string;
  redrawCount: number;
}

export const initialUserObject = (): User => {
  return {
    id: 0,
    name: "",
    score: 0,
    whiteCards: [],
    hasSubmittedWhiteCards: false,
    redrawCount: 0,
  }
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
