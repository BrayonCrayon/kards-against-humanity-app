import { FC } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faCheck, faClose } from "@fortawesome/free-solid-svg-icons";
import { useNotifications } from "@/State/Notifications/useNotifications";
import { RemoveNotification } from "@/State/Notifications/NotificationActions";
import { Location, Notification } from "@/State/Notifications/NotificationsState";

export enum NotificationType {
  SUCCESS = "success",
  ERROR = "error",
}

type KAHNotificationProps = {
  message: string;
  type?: NotificationType;
};

const KAHNotification: FC<KAHNotificationProps> = ({ message, type = NotificationType.SUCCESS }) => {
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
    dispatch(new RemoveNotification(new Notification(Location.TOP, message)));
  };

  return (
    <div className="w-[400px] h-[75px] fixed top-1/2 left-1/2 translate-[-50%] flex items-center border border-lukewarmGray-100 shadow-xl p-2 rounded bg-white animate-notification">
      <div className={"mr-4 ml-2 inline-block"}>{looks[type].icon}</div>
      <button onClick={closeNotification}>Close Notification</button>
      <p className={"w-[320px] truncate"}>{message}</p>
      <div className="absolute bottom-0 left-0 h-[5px] animate-progress-bar bg-lukewarmGray-400"></div>
    </div>
  );
};

export default KAHNotification;
