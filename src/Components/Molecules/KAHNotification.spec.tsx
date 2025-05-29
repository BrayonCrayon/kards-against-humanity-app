import React from "react";
import { render } from "@testing-library/react";
import KAHNotification from "@/Components/Molecules/KAHNotification";
import { Notification, NotificationType } from "@/Types/Notification";
import { spyOnUseNotifications } from "@/Tests/testHelpers";

vi.useFakeTimers();
describe("KAHNotification", () => {
  it("should show the notification text", () => {
    const notification = new Notification({ message: "Hello" });
    const { getByText } = render(<KAHNotification notification={notification} />);
    expect(getByText(notification.message)).toBeInTheDocument();
  });

  it("will show error icon when it's a notification error", () => {
    const notification = new Notification({ message: "Hello" });
    const wrapper = render(<KAHNotification notification={notification} type={NotificationType.ERROR} />);

    expect(wrapper.getByTestId("notification-error")).toBeInTheDocument();
  });

  it("will show success icon when it's a success error", () => {
    const notification = new Notification({ message: "Hello" });
    const wrapper = render(<KAHNotification notification={notification} type={NotificationType.SUCCESS} />);

    expect(wrapper.getByTestId("notification-success")).toBeInTheDocument();
    expect(wrapper.queryByTestId("notification-error")).not.toBeInTheDocument();
  });

  it("will automatically close after duration ends", () => {
    const duration = 3;
    const notification = new Notification({ message: "Hello", duration: 3 });
    const dispatch = spyOnUseNotifications();

    render(<KAHNotification notification={notification} type={NotificationType.SUCCESS} />);

    vi.advanceTimersByTime(duration * 1000);
    expect(dispatch).toHaveBeenCalled();
  });
});
