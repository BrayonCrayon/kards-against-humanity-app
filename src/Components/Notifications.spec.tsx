import { spyOnUseNotifications } from "@/Tests/testHelpers";
import { notificationFactory } from "@/Tests/Factories/NotificationFactory";
import { kardsRender } from "@/Tests/testRenders";
import Notifications from "@/Components/Notifications";

describe("Notifications", () => {
  it("will show notifications", () => {
    const notifications = [notificationFactory(), notificationFactory()];
    spyOnUseNotifications(vi.fn(), { notifications });

    const wrapper = kardsRender(<Notifications />);

    notifications.forEach((notification) => {
      expect(wrapper.queryByText(notification.message)).toBeDefined();
    });
  });
});
