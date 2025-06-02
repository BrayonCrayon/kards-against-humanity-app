import { INotification, Location, Notification, NotificationType } from "@/Types/Notification";
import { rand, randSentence } from "@ngneat/falso";
import { random } from "lodash";

export const notificationFactory = (overrides: Partial<INotification> = {}): Notification => {
  const defaults: INotification = {
    id: random(5000),
    location: rand([Location.TOP, Location.BOTTOM, Location.LEFT, Location.RIGHT]),
    message: randSentence(),
    duration: 1000,
    type: NotificationType.SUCCESS,
    ...overrides,
  };
  return new Notification(defaults);
};
