import React from "react";
import { render } from "@testing-library/react";
import KAHNotification, { NotificationType } from "@/Components/Molecules/KAHNotification";

describe("KAHNotification", () => {
  it("should show the notification text", () => {
    const testText = "Hello";
    const { getByText } = render(<KAHNotification message={testText} />);
    expect(getByText(testText)).toBeInTheDocument();
  });

  it("will show error icon when it's a notification error", () => {
    const wrapper = render(<KAHNotification message="Im a error" type={NotificationType.ERROR} />);

    expect(wrapper.getByTestId("notification-error")).toBeInTheDocument();
  });

  it("will show success icon when it's a success error", () => {
    const wrapper = render(<KAHNotification message="Im successful" type={NotificationType.SUCCESS} />);

    expect(wrapper.getByTestId("notification-success")).toBeInTheDocument();
    expect(wrapper.queryByTestId("notification-error")).not.toBeInTheDocument();
  });
});
