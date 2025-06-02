import { random } from "lodash";

export enum Location {
  TOP = "TOP",
  BOTTOM = "BOTTOM",
  LEFT = "LEFT",
  RIGHT = "RIGHT",
  CENTER = "CENTER",
}

export enum NotificationType {
  SUCCESS = "success",
  ERROR = "error",
}

export interface INotification {
  id: number;
  message: string;
  type: NotificationType;
  location: Location;
  duration: number;
}

export class Notification implements INotification {
  id: number;
  location: Location;
  message: string;
  type: NotificationType;
  duration: number;

  constructor({ message = "", location, type, duration = 3 }: Partial<INotification>) {
    this.id = random(1000);
    this.message = message;
    this.location = location ?? Location.CENTER;
    this.type = type ?? NotificationType.SUCCESS;
    this.duration = duration;
  }
}
