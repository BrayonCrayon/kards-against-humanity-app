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
  message: string;
  type: NotificationType;
  location: Location;
}

export class Notification implements INotification {
  location: Location;
  message: string;
  type: NotificationType;

  constructor(message: string, location?: Location, type?: NotificationType) {
    this.message = message;
    this.location = location ?? Location.CENTER;
    this.type = type ?? NotificationType.SUCCESS;
  }
}
