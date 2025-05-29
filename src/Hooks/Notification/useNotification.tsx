import { Location, Notification } from "@/Types/Notification";
import { AddNotification } from "@/State/Notifications/NotificationActions";
import { useNotifications } from "@/State/Notifications/useNotifications";

export const useNotification = () => {
  const { dispatch } = useNotifications();

  const happyNotification = (message: string = "Success", location: Location = Location.CENTER) => {
    dispatch(new AddNotification(new Notification({ message, location })));
  };

  return {
    happyNotification,
  };
};
