import React, { FC, PropsWithChildren, useCallback } from "react";
import { SweetAlertPosition } from "sweetalert2";
import { useNotifications } from "@/State/Notifications/useNotifications";
import { AddNotification } from "@/State/Notifications/NotificationActions";
import { Location, Notification } from "@/State/Notifications/NotificationsState";

interface ClipboardProps extends PropsWithChildren {
  copy: string;
  className?: string;
  role?: string;
  successMessage?: string;
  messagePosition?: SweetAlertPosition;
}

const ClipBoard: FC<ClipboardProps> = ({
  children,
  copy,
  className = "",
  role = "copy",
  successMessage = "Text Copied!",
  messagePosition = "top-start",
}) => {
  const { dispatch } = useNotifications();

  const copyText = useCallback(async () => {
    try {
      await navigator.clipboard.writeText(copy);
      //happyToast(successMessage, messagePosition);
      dispatch(new AddNotification(new Notification(Location.CENTER, successMessage)));
    } catch (error) {
      console.error(error);
    }
  }, [copy, successMessage]);

  return (
    <div role={role} onClick={() => copyText()} className={`cursor-pointer ${className}`}>
      {children}
    </div>
  );
};

export default ClipBoard;
