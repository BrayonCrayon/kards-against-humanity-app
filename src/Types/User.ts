import {WhiteCard} from "./WhiteCard";

export interface User {
  id: number;
  name: string;
  score: number;
  hasSubmittedWhiteCards: boolean;
  redrawCount: number;
}

export interface UserResponse {
  id: number;
  name: string;
  score: number;
  hasSubmittedWhiteCards: boolean;
  redrawCount: number;
}

export const initialUserObject = (): User => {
  return {
    id: 0,
    name: "",
    score: 0,
    hasSubmittedWhiteCards: false,
    redrawCount: 0,
  }
}

export const transformUser = (user: UserResponse): User => {
  return {
    ...user,
    hasSubmittedWhiteCards: user.hasSubmittedWhiteCards,
  };
};

export const transformUsers = (users: UserResponse[]): User[] =>
  users.map((user) => transformUser(user));
