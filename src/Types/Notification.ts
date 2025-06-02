import { random } from "lodash";

export enum Location {
  TOP_LEFT = "TOP_LEFT",
  TOP_RIGHT = "TOP_RIGHT",
  TOP_CENTER = "TOP_CENTER",
  CENTER = "CENTER",
  CENTER_RIGHT = "CENTER_RIGHT",
  CENTER_LEFT = "CENTER_LEFT",
  BOTTOM_LEFT = "BOTTOM_LEFT",
  BOTTOM_RIGHT = "BOTTOM_RIGHT",
  BOTTOM_CENTER = "BOTTOM_CENTER",
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
