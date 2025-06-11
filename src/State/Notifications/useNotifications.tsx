import { useGenericContext } from "@/State/GeneralContext";
import { NotificationsContext } from "@/State/Notifications/NotificationsContext";

function useNotifications() {
  return useGenericContext(NotificationsContext);
}

export { useNotifications };
