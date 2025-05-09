import { INotificationsState, Notification } from "@/State/Notifications/NotificationsState";
import { BaseAction } from "@/State/GeneralContext";

export class AddNotification extends BaseAction<INotificationsState, Notification> {
  execute = (state: INotificationsState) => {
    return {
      ...state,
      notifications: [...state.notifications, this.payload],
    };
  };
}
export type NotificationsActionTypes = AddNotification;
