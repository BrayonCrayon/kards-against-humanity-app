import React, { FC, PropsWithChildren, useCallback } from "react";
import { useToasts } from "@/Hooks/Notification/useToasts";
import { Location } from "@/Types/Notification";

interface ClipboardProps extends PropsWithChildren {
  copy: string;
  className?: string;
  role?: string;
  successMessage?: string;
  messagePosition?: Location;
}

const ClipBoard: FC<ClipboardProps> = ({
  children,
  copy,
  className = "",
  role = "copy",
  successMessage = "Text Copied!",
  messagePosition = Location.CENTER,
}) => {
  const { happyToast } = useToasts();

  const copyText = useCallback(async () => {
    try {
      await navigator.clipboard.writeText(copy);
      happyToast(successMessage, messagePosition);
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
