import React, { FC, PropsWithChildren, useCallback } from "react";
import { SweetAlertPosition } from "sweetalert2";
import { useNotification } from "@/Hooks/Notification/useNotification";

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
  const { happyNotification } = useNotification();

  const copyText = useCallback(async () => {
    try {
      await navigator.clipboard.writeText(copy);
      happyNotification(successMessage);
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
