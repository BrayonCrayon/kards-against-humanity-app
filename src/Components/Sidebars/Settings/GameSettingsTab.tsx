import {FC, useCallback, useState} from "react";
import LeaveGame from "Components/Molecules/LeaveGame";
import {TimerSetting} from "./TimerSetting";
import {Button} from "Components/Atoms/Button";
import useUpdateGameSettings from "Hooks/Game/State/useUpdateGameSettings";
import {happyToast} from "Utilities/toasts";
import {useGame} from "State/Game/useGame";

interface GameSettingsTabProps {}

const GameSettingsTab: FC<GameSettingsTabProps> = ({}) => {

    const { state: { game }} = useGame();
    const update = useUpdateGameSettings();
    const [defaultTimer, setDefaultTimer] = useState<number | null>(game.selectionTimer)

    const updateSettings = useCallback(async () => {
        await update(game.id, defaultTimer);
        happyToast("Game updated!");
    }, [defaultTimer]);

    return (
        <div className="flex flex-col h-full">
            <div className="flex-1">
                <TimerSetting onChange={(seconds) => { setDefaultTimer(seconds)}} timer={defaultTimer} />
                <hr className={"pb-3"}/>
            </div>
            <Button className="w-full" text="Update Settings" dataTestid="update-timer" onClick={() => updateSettings()} />
            <LeaveGame className="mt-0 mb-0" gameId={game.id} />
        </div>
    )
}

export default GameSettingsTab;