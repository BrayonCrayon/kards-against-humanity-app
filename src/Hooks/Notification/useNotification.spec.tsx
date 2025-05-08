import { renderHook } from "@testing-library/react";
import { useNotification } from "@/Hooks/Notification/useNotification";

describe("useNotification", () => {
  it("will be able to add a notification", () => {
    const {
      result: { current },
    } = renderHook(useNotification);

    // await current.showNotification("Hi there");

    // expect(current.notifications).toHaveLength(1);
  });

  // it will be able to remove a notification
  // setup with one notification
  // assert no notifications

  // it will add notification to component
  // setup with a new component with notification composable (fake)
  // off of the render of new component call showNotification
  // assert on new component that notification length is one
});
