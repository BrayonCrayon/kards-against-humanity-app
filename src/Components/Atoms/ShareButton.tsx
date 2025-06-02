import { FC, useCallback } from "react";
import { defaultShareData, ShareData, webShare } from "@/Types/WebShare";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faShareNodes } from "@fortawesome/free-solid-svg-icons";
import { useToasts } from "@/Hooks/Notification/useToasts";

interface ShareButtonProps {
  role?: string;
  data?: ShareData;
}

const ShareButton: FC<ShareButtonProps> = ({ role = "share-button", data = defaultShareData }) => {
  const { errorToast } = useToasts();

  const share = useCallback(async () => {
    try {
      await webShare.share(data);
    } catch (e) {
      errorToast("Could not share try again.");
    }
  }, [data]);

  return (
    <button role={role} onClick={() => share()}>
      <FontAwesomeIcon icon={faShareNodes} />
    </button>
  );
};

export default ShareButton;
