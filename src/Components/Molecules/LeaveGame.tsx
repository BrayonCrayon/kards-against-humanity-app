import React, { FC, useCallback } from "react";
import useLeaveGame from "@/Hooks/Game/Actions/useLeaveGame";
import useLoading from "@/Hooks/Game/Shared/useLoading";
import { Button, ButtonVariant } from "../Atoms/Button";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faDoorOpen } from "@fortawesome/free-solid-svg-icons";

interface LeaveGameProps {
    gameId: string;
    className?: string;
}

const LeaveGame: FC<LeaveGameProps> = ({gameId, className = ""}) => {
    const leaveGame = useLeaveGame();
    const {loading, setLoading} = useLoading();

    const leave = useCallback(async () => {
        setLoading(true);
        await leaveGame(gameId);
    }, [gameId]);

    return (
        <>
            <Button
                dataTestid="leave-game"
                text="Leave Game"
                className={className}
                variant={ButtonVariant["dark-outline"]}
                isLoading={loading}
                onClick={leave}
            >
              <FontAwesomeIcon icon={faDoorOpen} className="pr-2" />
            </Button>
        </>
    );
};

export default LeaveGame;
