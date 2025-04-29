import { FC, PropsWithChildren, useCallback, useEffect, useState } from "react";

interface KAHModalProps extends PropsWithChildren {
  show?: boolean;
  onClose?: () => void;
}

const KAHModal: FC<KAHModalProps> = (props) => {
  const { show, onClose = () => {}, children } = props;

  const [showModal, setShowModal] = useState(Boolean(show));

  const closeModal = useCallback(() => {
    setShowModal(false);
    onClose();
  }, [onClose]);

  useEffect(() => {
    setShowModal(show ?? false);
  }, [show]);

  if (!showModal) {
    return <></>;
  }

  return (
    <div
      data-testid="modal"
      className="w-screen h-screen fixed top-0 left-0 flex flex-col items-center justify-center bg-white/35"
      onClick={closeModal}
    >
      <div className="bg-white rounded shadow-lg w-3/4 h-1/2 max-w-2xl">{children}</div>
    </div>
  );
};

export default KAHModal;
