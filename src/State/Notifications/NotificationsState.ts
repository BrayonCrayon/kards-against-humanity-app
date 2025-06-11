import { Notification } from "src/Types/Notification";

export interface INotificationsState {
  notifications: Notification[];
}

export const initialNotificationsState: INotificationsState = {
  notifications: [],
};
