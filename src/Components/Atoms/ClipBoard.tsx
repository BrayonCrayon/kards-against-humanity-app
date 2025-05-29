import React, { FC, PropsWithChildren, useCallback } from "react";
import { SweetAlertPosition } from "sweetalert2";
import { useToasts } from "@/Hooks/Notification/useToasts";

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
  const { happyToast } = useToasts();

  const copyText = useCallback(async () => {
    try {
      await navigator.clipboard.writeText(copy);
      happyToast(successMessage);
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
