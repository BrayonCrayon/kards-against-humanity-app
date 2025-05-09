import { INotification, Location, Notification, NotificationType } from "@/State/Notifications/NotificationsState";
import { rand, randSentence } from "@ngneat/falso";

export const notificationFactory = (overrides: Partial<INotification> = {}): Notification => {
  const defaults: INotification = {
    location: rand([Location.TOP, Location.BOTTOM, Location.LEFT, Location.RIGHT]),
    message: randSentence(),
    type: NotificationType.INFO,
    ...overrides,
  };
  return new Notification(defaults.location, defaults.message, defaults.type);
};
