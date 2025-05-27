import { NotificationType } from "@/Components/Molecules/KAHNotification";

export enum Location {
  TOP = "TOP",
  BOTTOM = "BOTTOM",
  LEFT = "LEFT",
  RIGHT = "RIGHT",
  CENTER = "CENTER",
}

export interface INotification {
  message: string;
  type: NotificationType;
  location: Location;
}

export class Notification implements INotification {
  location: Location;
  message: string;
  type: NotificationType;

  constructor(location: Location, message: string, type?: NotificationType) {
    this.location = location;
    this.message = message;
    this.type = type ?? NotificationType.SUCCESS;
  }
}

export interface INotificationsState {
  notifications: Notification[];
}

export const initialNotificationsState: INotificationsState = {
  notifications: [],
};
