import { notificationFactory } from "@/Tests/Factories/NotificationFactory";
import { AddNotification, RemoveNotification } from "@/State/Notifications/NotificationActions";
import { INotificationsState } from "@/State/Notifications/NotificationsState";

describe("NotificationActions", () => {
  it("will add a notification from default state", () => {
    const notification = notificationFactory();
    const action = new AddNotification(notification);

    const result = action.execute({ notifications: [] });

    expect(result.notifications).toHaveLength(1);
  });

  it("will append a new notification to existing notifications", () => {
    const notification = notificationFactory();
    const existingNotification = notificationFactory();
    const existingState = {
      notifications: [existingNotification],
    };
    const action = new AddNotification(notification);

    const result = action.execute(existingState);

    [notification, existingNotification].forEach((item) => {
      expect(result.notifications).toContain(item);
    });
  });

  it("will remove an notification ", () => {
    const notificationToRemove = notificationFactory();
    const state: INotificationsState = {
      notifications: [notificationToRemove, notificationFactory()],
    };
    const action = new RemoveNotification(notificationToRemove);

    const result = action.execute(state);

    expect(result.notifications).toEqual(state.notifications.filter((item) => item !== notificationToRemove));
  });

  it("will remove exact notification when a message is duplicated", () => {
    const notificationToRemove = notificationFactory({ message: "im a foo" });
    const state: INotificationsState = {
      notifications: [notificationToRemove, notificationFactory({ message: "im a foo" })],
    };
    const action = new RemoveNotification(notificationToRemove);

    const result = action.execute(state);

    expect(result.notifications).toEqual(state.notifications.filter((item) => item !== notificationToRemove));
  });
});
