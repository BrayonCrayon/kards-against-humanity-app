import React from "react";
import { render } from "@testing-library/react";
import KAHNotification from "@/Components/Molecules/KAHNotification";
import { Notification, NotificationType } from "@/Types/Notification";

describe("KAHNotification", () => {
  it("should show the notification text", () => {
    const notification = new Notification("Hello");
    const { getByText } = render(<KAHNotification notification={notification} />);
    expect(getByText(notification.message)).toBeInTheDocument();
  });

  it("will show error icon when it's a notification error", () => {
    const notification = new Notification("Hello");
    const wrapper = render(<KAHNotification notification={notification} type={NotificationType.ERROR} />);

    expect(wrapper.getByTestId("notification-error")).toBeInTheDocument();
  });

  it("will show success icon when it's a success error", () => {
    const notification = new Notification("Hello");
    const wrapper = render(<KAHNotification notification={notification} type={NotificationType.SUCCESS} />);

    expect(wrapper.getByTestId("notification-success")).toBeInTheDocument();
    expect(wrapper.queryByTestId("notification-error")).not.toBeInTheDocument();
  });
});
