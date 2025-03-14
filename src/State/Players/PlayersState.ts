import { User } from "@/Types/User";

export interface IPlayersState {
  players: Array<User>;
}

export const initialPlayersState: IPlayersState = {
  players: [],
};
