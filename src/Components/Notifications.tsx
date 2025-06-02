import React from "react";
import { useNotifications } from "@/State/Notifications/useNotifications";
import KAHNotification from "@/Components/Molecules/KAHNotification";
import { Notification } from "@/Types/Notification";

const Notifications = () => {
  const {
    state: { notifications },
  } = useNotifications();

  return (
    <>
      {notifications.map((notification: Notification) => (
        <KAHNotification notification={notification} key={notification.id} />
      ))}
    </>
  );
};

export default Notifications;
