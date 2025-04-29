import { FC, useState } from "react";
import KAHModal from "@/Components/Atoms/KAHModal";
import { Button, ButtonVariant } from "@/Components/Atoms/Button";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faExclamation } from "@fortawesome/free-solid-svg-icons";

interface KickPlayerModalProps {
  show: boolean;
  playerName: string;
}

const KickPlayerModal: FC<KickPlayerModalProps> = (props) => {
  const [show, setShow] = useState(props.show);
  return (
    <KAHModal show={show} onClose={() => setShow(false)}>
      <div className="flex flex-col h-full p-8">
        <div className="w-full h-full flex-1 flex flex-col justify-around items-center">
          <FontAwesomeIcon icon={faExclamation} className="text-9xl border-4 border-black rounded-full px-14 py-2" />
          <div className="text-center font-bold text-4xl">
            <p>Are you sure you want to kick</p>
            <p>{props.playerName}</p>
          </div>
        </div>
        <div className="flex flex-col w-full md:flex-row md:justify-center">
          <Button className="md:w-1/4 md:mr-8" text="Yes" role="yes-kick-player" />
          <Button
            className="md:w-1/4"
            text="Cancel"
            role="cancel-kicking-player"
            variant={ButtonVariant["dark-outline"]}
          />
        </div>
      </div>
    </KAHModal>
  );
};

export default KickPlayerModal;
