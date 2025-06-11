import { FC } from "react";
import KAHModal from "@/Components/Atoms/KAHModal";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faExclamation } from "@fortawesome/free-solid-svg-icons";

interface RedrawModalProps {
  show: boolean;
  onClose: () => void;
  onConfirm: () => void;
}

const RedrawModal: FC<RedrawModalProps> = (props) => {
  const { onClose, onConfirm, show } = props;

  return (
    <KAHModal show={show} onClose={onClose} onConfirm={onConfirm}>
      <div className="w-full h-full flex-1 flex flex-col justify-around items-center">
        <FontAwesomeIcon
          icon={faExclamation}
          className="text-8xl border-4 border-black rounded-full px-9 md:text-9xl md:py-2 md:px-14"
        />
        <div className="text-center font-bold text-2xl md:text-4xl">
          <p>Are you sure you want to redraw?</p>
        </div>
      </div>
    </KAHModal>
  );
};

export default RedrawModal;
