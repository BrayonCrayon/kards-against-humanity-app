import { Location, Notification } from "@/Types/Notification";
import { AddNotification } from "@/State/Notifications/NotificationActions";

export const useToasts = () => {
  const { dispatch } = useNotifications();

  const happyToast = (message: string = "Success", location: Location = Location.CENTER) => {
    dispatch(new AddNotification(new Notification({ message, location })));
  };

  return {
    happyToast,
  };
};
