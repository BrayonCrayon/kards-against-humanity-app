import { FC, useCallback, useMemo } from "react";
import Timer from "@/Components/Atoms/Timer";
import { useGame } from "@/State/Game/useGame";
import { usePlayers } from "@/State/Players/usePlayers";
import { useForceSubmitCards } from "@/Hooks/Game/Timer/useForceSubmitCards";
import { useHand } from "@/State/Hand/useHand";
import { useAuth } from "@/State/Auth/useAuth";

interface SelectionRoundTimerProps {
    className?: string;
}

const SelectionRoundTimer: FC<SelectionRoundTimerProps> = ({ className = ""}) => {

    const { state: { game, blackCard } } = useGame();
    const { state: { auth } } = useAuth();
    const { state: { players } } = usePlayers();
    const { state: { hand } } = useHand();
    const forceSubmitCards = useForceSubmitCards();

    const isVoting = useMemo(() => {
        const currentPlayers = players.filter((item) => item.id !== game.judgeId);
        return currentPlayers.length > 0 && currentPlayers.every((user) => user.hasSubmittedWhiteCards);
    }, [players, game]);

    const onTimerEnd = useCallback(async () => {
        if (auth.id === game.judgeId || auth.hasSubmittedWhiteCards) return;
        await forceSubmitCards(game.id, hand, blackCard);
    }, [game, hand, blackCard, isVoting, auth]);

    if (isVoting || !game.selectionEndsAt || !game.selectionTimer) return null;

    return <div className={className}>
        <Timer end={game.selectionEndsAt} onEnd={onTimerEnd} />
    </div>
}

export default SelectionRoundTimer;