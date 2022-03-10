import { User } from "../../Types/User";

export interface IUsersState {
  users: Array<User>;
}

export const initialUsersState: IUsersState = {
  users: [],
};
