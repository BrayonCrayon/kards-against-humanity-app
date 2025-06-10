import { FC, PropsWithChildren, useCallback, useEffect, useState } from "react";
import { AnimatePresence, motion } from "motion/react";
import { Button, ButtonVariant } from "@/Components/Atoms/Button";

interface KAHModalProps extends PropsWithChildren {
  show?: boolean;
  onConfirm: () => void;
  onClose?: () => void;
}

const KAHModal: FC<KAHModalProps> = (props) => {
  const { show, onClose = () => {}, onConfirm, children } = props;

  const [showModal, setShowModal] = useState(Boolean(show));

  const confirmModal = useCallback(() => {
    onConfirm();
    setShowModal(false);
  }, []);

  const closeModal = useCallback(() => {
    onClose();
    setShowModal(false);
  }, [onClose]);

  useEffect(() => {
    setShowModal(show ?? false);
  }, [show]);

  return (
    <AnimatePresence>
      {showModal ? (
        <motion.div className="z-100" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>
          <div
            data-testid="modal"
            className="w-screen h-screen fixed top-0 left-0 flex flex-col items-center justify-center bg-white/35 cursor-pointer z-100"
            onClick={closeModal}
          >
            <div
              onClick={(e) => e.stopPropagation()}
              className="bg-white rounded shadow-lg w-3/4 max-w-2xl cursor-default"
            >
              <div className="flex flex-col h-full p-8">
                {children}
                <div className="flex flex-col w-full md:flex-row md:justify-center">
                  <Button className="md:w-1/4 md:mr-8" text="Yes" role="confirm" onClick={confirmModal} />
                  <Button
                    className="md:w-1/4"
                    text="Cancel"
                    role="cancel"
                    variant={ButtonVariant["dark-outline"]}
                    onClick={closeModal}
                  />
                </div>
              </div>
            </div>
          </div>
        </motion.div>
      ) : null}
    </AnimatePresence>
  );
};

export default KAHModal;
