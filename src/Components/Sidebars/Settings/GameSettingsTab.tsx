import { FC, useCallback, useEffect, useState } from "react";
import LeaveGame from "Components/Molecules/LeaveGame";
import { TimerSetting } from "./TimerSetting";
import { Button } from "Components/Atoms/Button";
import useUpdateGameSettings from "Hooks/Game/State/useUpdateGameSettings";
import { happyToast } from "Utilities/toasts";
import { useGame } from "State/Game/useGame";

export interface Options {
    timer: number|null;
    hasAnimations: boolean;
}

interface GameSettingsTabProps {
    options?: Options;
    onUpdatedSettings?: (options: Options) => void
}

const GameSettingsTab: FC<GameSettingsTabProps> = ({ options = null, onUpdatedSettings = () => {}}) => {

    const { state: { game }} = useGame();
    const update = useUpdateGameSettings();
    const [defaultTimer, setDefaultTimer] = useState<number | null>(options?.timer ?? game.selectionTimer);
    const [displayAnimations] = useState(options?.hasAnimations ?? false);

    const updateSettings = useCallback(async () => {
        await update(game.id, defaultTimer);
        happyToast("Game updated!");
    }, [defaultTimer]);

    useEffect(() => {
        onUpdatedSettings({ timer: defaultTimer, hasAnimations: displayAnimations});
    }, [defaultTimer]);

    return (
        <div className="flex flex-col h-full">
            <div className="flex-1">
                <TimerSetting onChange={(seconds) => { setDefaultTimer(seconds)}} timer={defaultTimer} />
                <hr className={"pb-3"}/>
            </div>
            {
                game.id &&
                <>
                    <Button className="w-full" text="Update Settings" dataTestid="update-settings" onClick={() => updateSettings()} />
                    <LeaveGame className="mt-0 mb-0" gameId={game.id} />
                </>
            }
        </div>
    )
}

export default GameSettingsTab;