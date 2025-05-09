import { useGenericContext } from "src/State/GeneralContext";
import { NotificationsContext } from "src/State/Notifications/NotificationsContext";

function useNotifications() {
  return useGenericContext(NotificationsContext);
}

export { useNotifications };
