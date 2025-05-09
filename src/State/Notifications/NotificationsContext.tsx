import { BaseContext, useGenericReducer } from "@/State/GeneralContext";
import { initialNotificationsState, INotificationsState } from "@/State/Notifications/NotificationsState";
import { createContext, FC, PropsWithChildren } from "react";
import { NotificationsActionTypes } from "@/State/Notifications/NotificationActions";

export const NotificationsContext = createContext<BaseContext<INotificationsState, NotificationsActionTypes>>({
  state: initialNotificationsState,
  dispatch: () => {},
});

function notificationsReducer(state: INotificationsState, action: NotificationsActionTypes): INotificationsState {
  return action.execute(state);
}

export const NotificationsProvider: FC<PropsWithChildren> = ({ children }) => {
  return (
    <NotificationsContext.Provider value={useGenericReducer(notificationsReducer, initialNotificationsState)}>
      {children}
    </NotificationsContext.Provider>
  );
};
