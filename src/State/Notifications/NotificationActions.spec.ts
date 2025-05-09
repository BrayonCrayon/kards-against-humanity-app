import { notificationFactory } from "@/Tests/Factories/NotificationFactory";
import { AddNotification } from "@/State/Notifications/NotificationActions";

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

  it.todo("will remove an notification ", () => {});
});
