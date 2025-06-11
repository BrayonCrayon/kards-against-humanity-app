import { FC, useEffect, useMemo } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faCheck, faClose, faXmark } from "@fortawesome/free-solid-svg-icons";
import { useNotifications } from "@/State/Notifications/useNotifications";
import { RemoveNotification } from "@/State/Notifications/NotificationActions";
import { Location, Notification, NotificationType } from "@/Types/Notification";

type KAHNotificationProps = {
  notification: Notification;
  type?: NotificationType;
};

const NotificationPosition = {
  [Location.TOP_LEFT]: "top-2 left-2",
  [Location.TOP_RIGHT]: "top-2 right-2",
  [Location.TOP_CENTER]: "top-2 left-1/2 translate-x-[-50%]",
  [Location.CENTER]: "top-1/2 left-1/2 translate-[-50%]",
  [Location.CENTER_LEFT]: "top-1/2 left-2 translate-y-[-50%]",
  [Location.CENTER_RIGHT]: "top-1/2 right-2 translate-y-[-50%]",
  [Location.BOTTOM_LEFT]: "bottom-2 left-2",
  [Location.BOTTOM_RIGHT]: "bottom-2 right-2",
  [Location.BOTTOM_CENTER]: "bottom-2 left-1/2 translate-x-[-50%]",
};

const KAHNotification: FC<KAHNotificationProps> = ({ notification, type = notification.type }) => {
  const { dispatch } = useNotifications();

  const looks = {
    [NotificationType.SUCCESS]: {
      className: "",
      icon: <FontAwesomeIcon data-testid="notification-success" size="2x" icon={faCheck} />,
    },
    [NotificationType.ERROR]: {
      className: "",
      icon: <FontAwesomeIcon data-testid="notification-error" size="2x" icon={faClose} />,
    },
  };

  const closeNotification = () => {
    dispatch(new RemoveNotification(notification));
  };

  useEffect(() => {
    const timeout = setTimeout(() => {
      closeNotification();
    }, notification.duration * 1000);

    return () => clearTimeout(timeout);
  }, []);

  const position = useMemo(() => {
    return NotificationPosition[notification.location];
  }, [notification.location]);

  return (
    <div
      className={`w-[400px] h-[75px] z-100 fixed flex items-center border border-lukewarmGray-100 shadow-xl p-2 rounded bg-white animate-notification ${position}`}
    >
      <div className={"mr-4 ml-2 inline-block"}>{looks[type].icon}</div>
      <p className={"w-[320px] truncate"}>{notification.message}</p>
      <FontAwesomeIcon className="absolute top-1 right-2 cursor-pointer" icon={faXmark} onClick={closeNotification} />
      <div className="absolute bottom-0 left-0 h-[5px] animate-progress-bar bg-lukewarmGray-400"></div>
    </div>
  );
};

export default KAHNotification;
