import { Location, Notification, NotificationType } from "@/Types/Notification";
import { AddNotification } from "@/State/Notifications/NotificationActions";
import { useNotifications } from "@/State/Notifications/useNotifications";

export const useToasts = () => {
  const { dispatch } = useNotifications();

  const happyToast = (message: string = "Success", location: Location = Location.CENTER) => {
    dispatch(new AddNotification(new Notification({ message, location })));
  };

  const errorToast = (message: string = "Error", location: Location = Location.CENTER) => {
    dispatch(new AddNotification(new Notification({ message, location, type: NotificationType.ERROR })));
  };

  return {
    happyToast,
    errorToast,
  };
};
