import React, {FC, PropsWithChildren, useCallback} from "react";
import { happyToast } from "Utilities/toasts";
import { SweetAlertPosition } from "sweetalert2";

interface ClipboardProps extends PropsWithChildren{
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
                                         messagePosition = "top-start"
                                       }) => {

  const copyText = useCallback(async () => {
    try {
      await navigator.clipboard.writeText(copy);
      happyToast(successMessage, messagePosition);
    } catch (error) {
      console.error(error);
    }
  }, [copy, successMessage]);

  return (
    <div
      role={role}
      onClick={() => copyText()}
      className={`cursor-pointer ${className}`}
    >
      {children}
    </div>
  );
};

export default ClipBoard;