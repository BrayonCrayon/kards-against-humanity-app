import { INotificationsState } from "@/State/Notifications/NotificationsState";
import { Notification } from "@/Types/Notification";
import { BaseAction } from "@/State/GeneralContext";

export class AddNotification extends BaseAction<INotificationsState, Notification> {
  execute = (state: INotificationsState) => {
    return {
      ...state,
      notifications: [...state.notifications, this.payload],
    };
  };
}

export class RemoveNotification extends BaseAction<INotificationsState, Notification> {
  execute = (state: INotificationsState) => {
    return {
      ...state,
      notifications: state.notifications.filter((notification) => {
        return notification !== this.payload;
      }),
    };
  };
}
export type NotificationsActionTypes = AddNotification | RemoveNotification;
