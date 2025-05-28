import { INotification, Location, Notification, NotificationType } from "@/Types/Notification";
import { rand, randSentence } from "@ngneat/falso";

export const notificationFactory = (overrides: Partial<INotification> = {}): Notification => {
  const defaults: INotification = {
    location: rand([Location.TOP, Location.BOTTOM, Location.LEFT, Location.RIGHT]),
    message: randSentence(),
    type: NotificationType.SUCCESS,
    ...overrides,
  };
  return new Notification(defaults.message, defaults.location, defaults.type);
};
