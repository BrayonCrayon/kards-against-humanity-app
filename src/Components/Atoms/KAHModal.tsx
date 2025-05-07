import { FC, PropsWithChildren, useCallback, useEffect, useState } from "react";
import { AnimatePresence, motion } from "motion/react";

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

  return (
    <AnimatePresence>
      {showModal ? (
        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>
          <div
            data-testid="modal"
            className="w-screen h-screen fixed top-0 left-0 flex flex-col items-center justify-center bg-white/35 cursor-pointer"
            onClick={closeModal}
          >
            <div
              onClick={(e) => e.stopPropagation()}
              className="bg-white rounded shadow-lg w-3/4 max-w-2xl cursor-default"
            >
              {children}
            </div>
          </div>
        </motion.div>
      ) : null}
    </AnimatePresence>
  );
};

export default KAHModal;
