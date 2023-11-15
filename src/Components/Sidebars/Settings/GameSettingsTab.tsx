import {User} from "Types/User";
import {FC} from "react";
import LeaveGame from "../../Molecules/LeaveGame";
import {TimerSetting} from "./TimerSetting";
import {Button} from "../../Atoms/Button";

interface GameSettingsTabProps {
    players: User[];
    gameId: string;
    timer?: number | null;
    onSettingsUpdate?: (seconds: number) => void;
}

const GameSettingsTab: FC<GameSettingsTabProps> = ({ players, gameId,  timer, onSettingsUpdate }) => {

    // TODO: Maybe store the timer settings update here or in a hook?

    return (
        <div className="flex flex-col h-full">
            {/* TODO: hookup onchange event for timer */}
            <div className="flex-1">
                <TimerSetting onChange={() => {}} timer={timer} />
                <hr className={"pb-3"}/>
            </div>
            {/* TODO: hook up settings update on button below */}
            <Button className="w-full" text="Update Settings" dataTestid="update-timer" />
            <LeaveGame className="mt-0 mb-0" gameId={gameId} />
        </div>
    )
}

export default GameSettingsTab;