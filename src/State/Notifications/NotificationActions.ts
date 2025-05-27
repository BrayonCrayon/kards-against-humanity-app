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

export class RemoveNotification extends BaseAction<INotificationsState, Notification> {
  execute = (state: INotificationsState) => {
    const notificatiosnWithoutThisMessage = state.notifications.filter((notification) => {
      return notification.message != this.payload.message;
    });

    console.log(notificatiosnWithoutThisMessage);

    return {
      ...state,
      notifications: notificatiosnWithoutThisMessage,
    };
  };
}
export type NotificationsActionTypes = AddNotification | RemoveNotification;
