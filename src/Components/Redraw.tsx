import React, {FC, useCallback, useMemo} from "react";
import {errorToast} from "../Utilities/toasts";
import Swal from "sweetalert2";
import useRedrawPlayerHand from "../Hooks/Game/Actions/useRedrawPlayerHand";
import {Game} from "../Types/Game";

interface RedrawProps {
    game: Game;
    redrawsUsed: number;
    className?: string;
    buttonClass?: string;
}

const Redraw: FC<RedrawProps> = ({ game, redrawsUsed, className = '', buttonClass = ''}) => {


    const redrawHand = useRedrawPlayerHand();

    const redrawsLeft = useMemo(() => {
        return game.redrawLimit - redrawsUsed;
    }, [redrawsUsed, game]);

    const redraw = useCallback(async () => {
        if (redrawsUsed === game.redrawLimit) {
            errorToast("Cannot redraw, please wait until next round.");
            return;
        }

        const result = await Swal.fire({
            title: `Are you sure you want to redraw?`,
            icon: "warning",
            showCancelButton: true,
            confirmButtonColor: "#3085d6",
            cancelButtonColor: "#d33",
            confirmButtonText: "Yes",
        });

        if (result.isDismissed || result.isDenied) {
            return;
        }

        await redrawHand(game.id);
    }, [game, redrawsUsed]);

    return (
        <div className={className}>
            <div className="bg-white rounded-full p-2 relative shadow-xl">
                <img src="/images/redraw-icon.png" className="pl-1" alt="redraw" />
                <p
                    className="absolute text-sm bottom-0 left-0 bg-black rounded-full text-white px-1.5"
                >{ redrawsLeft }</p>
            </div>
            <button
                className={`text-sm text-black border border-lightBlack ${buttonClass}`}
                data-testid="redraw-button"
                onClick={redraw}
            >
                Redraw
            </button>
        </div>
)
}

export default Redraw;