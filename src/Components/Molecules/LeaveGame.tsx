import React, {FC, useCallback} from "react";
import useLeaveGame from "@/Hooks/Game/Actions/useLeaveGame";
import useLoading from "@/Hooks/Game/Shared/useLoading";
import {Button, ButtonVariant} from "../Atoms/Button";

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
                <i className="fa-solid fa-door-open pr-2"></i>
            </Button>
        </>
    );
};

export default LeaveGame;
