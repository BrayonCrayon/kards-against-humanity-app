import { FC, useCallback } from "react";
import { defaultShareData, ShareData, webShare } from "@/Types/WebShare";
import { errorToast } from "@/Utilities/toasts";

interface ShareButtonProps {
  role?: string;
  data?: ShareData
}

const ShareButton: FC<ShareButtonProps> = ({ role = "share-button", data= defaultShareData }) => {

  const share = useCallback(async () => {
    try {
      await webShare.share(data);
    }
    catch (e) {
      errorToast("Could not share try again.");
    }
  }, [data]);

  return (
    <button role={role} onClick={() => share()}>
      <i className="fa-solid fa-share-nodes"></i>
    </button>
  );
}

export default ShareButton;