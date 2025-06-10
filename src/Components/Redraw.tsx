import React, { FC, useCallback, useMemo, useState } from "react";
import useRedrawPlayerHand from "@/Hooks/Game/Actions/useRedrawPlayerHand";
import { Game } from "@/Types/Game";
import { useToasts } from "@/Hooks/Notification/useToasts";
import RedrawModal from "@/Components/Molecules/RedrawModal";

interface RedrawProps {
  game: Game;
  redrawsUsed: number;
  className?: string;
  buttonClass?: string;
}

const Redraw: FC<RedrawProps> = ({ game, redrawsUsed, className = "", buttonClass = "" }) => {
  const { errorToast } = useToasts();
  const redrawHand = useRedrawPlayerHand();
  const [showModal, setShowModal] = useState(false);

  const redrawsLeft = useMemo(() => {
    return game.redrawLimit - redrawsUsed;
  }, [redrawsUsed, game]);

  const canUserRedraw = useCallback(async () => {
    if (redrawsUsed === game.redrawLimit) {
      errorToast("Cannot redraw, please wait until next round.");
      return;
    }

    setShowModal(true);
  }, [game, redrawsUsed]);

  const redraw = useCallback(async () => {
    setShowModal(false);
    await redrawHand(game.id);
  }, [game]);

  return (
    <div className={className}>
      <div className="bg-white rounded-full p-2 relative shadow-xl">
        <img src="/images/redraw-icon.png" className="pl-1" alt="redraw" />
        <p className="absolute text-sm bottom-0 left-0 bg-black rounded-full text-white px-1.5">{redrawsLeft}</p>
      </div>
      <button
        className={`text-sm text-black border border-lightBlack cursor-pointer ${buttonClass}`}
        data-testid="redraw-button"
        onClick={canUserRedraw}
      >
        Redraw
      </button>
      <RedrawModal show={showModal} onConfirm={redraw} onClose={() => setShowModal(false)} />
    </div>
  );
};

export default Redraw;
