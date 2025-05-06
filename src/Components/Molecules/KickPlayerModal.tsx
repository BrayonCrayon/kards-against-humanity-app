import { FC, useCallback, useEffect, useState } from "react";
import KAHModal from "@/Components/Atoms/KAHModal";
import { Button, ButtonVariant } from "@/Components/Atoms/Button";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faExclamation } from "@fortawesome/free-solid-svg-icons";

interface KickPlayerModalProps {
  show: boolean;
  playerName: string;
  onCloseCallback?: () => void;
  onYesCallback?: () => void;
}

const KickPlayerModal: FC<KickPlayerModalProps> = (props) => {
  const { onCloseCallback = () => {}, onYesCallback = () => {} } = props;
  const [show, setShow] = useState(props.show);

  useEffect(() => {
    setShow(props.show);
  }, [props.show]);

  const closeModal = useCallback(() => {
    setShow(false);
    onCloseCallback();
  }, []);

  const confirm = useCallback(() => {
    onYesCallback();
    setShow(false);
    onCloseCallback();
  }, []);

  return (
    <KAHModal show={show} onClose={closeModal}>
      <div className="flex flex-col h-full p-8">
        <div className="w-full h-full flex-1 flex flex-col justify-around items-center">
          <FontAwesomeIcon
            icon={faExclamation}
            className="text-8xl border-4 border-black rounded-full px-9 md:text-9xl md:py-2 md:px-14"
          />
          <div className="text-center font-bold text-2xl md:text-4xl">
            <p>Are you sure you want to kick</p>
            <p>{props.playerName}</p>
          </div>
        </div>
        <div className="flex flex-col w-full md:flex-row md:justify-center">
          <Button className="md:w-1/4 md:mr-8" text="Yes" role="yes-kick-player" onClick={confirm} />
          <Button
            className="md:w-1/4"
            text="Cancel"
            role="cancel-kicking-player"
            variant={ButtonVariant["dark-outline"]}
            onClick={closeModal}
          />
        </div>
      </div>
    </KAHModal>
  );
};

export default KickPlayerModal;
