import React, {useMemo, useState} from "react";
import {toMinutesSeconds} from "Utilities/helpers";
import {useAuth} from "State/Auth/useAuth";
import {useGame} from "State/Game/useGame";
import {Button} from "Components/Atoms/Button";
import TimerIcon from "Components/Icons/TimerIcon";
import useGameStart from "Hooks/Game/Timer/useGameStart";
import ShareButton from "Components/Atoms/ShareButton";
import {ShareData} from "Types/WebShare";
import CopyGameCode from "Components/Molecules/CopyGameCode";

export const PreGameModal: React.FC= () => {
    const { state: { auth } } = useAuth();
    const { state: { game }} = useGame();
    const startGame = useGameStart();

    const [data] = useState<ShareData>({
        title: "Kards Against Humanity",
        text: "Come join my game!",
        url: `https://kardsagainsthumanity.ca/${game.code}`
    });

    const isJudge = useMemo(() => {
        return auth.id === game.judgeId;
    }, [auth, game.judgeId]);

    if (!game.selectionTimer || game.selectionEndsAt) return null;

    return (
        <div
            data-testid="pre-game-modal"
            className="w-screen h-screen fixed top-0 left-0 flex flex-col items-center justify-center bg-black/75"
        >
            <div className="bg-white px-4 pt-4 shadow-md border-2 flex flex-wrap text-center font-bold">

                <div className="flex items-center mb-4">
                    <div className="bg-white px-3 shadow-md rounded-full h-10 text-xl flex justify-center ml-2 md:hidden">
                        <ShareButton data={data} />
                    </div>
                    <div className="shadow-md p-2 ml-2 md:w-auto">
                        <CopyGameCode code={game.code} />
                    </div>
                </div>

                {
                    isJudge ?
                    <>
                        <TimerIcon className="w-full" />
                        <div className="w-full">
                            <p>Is everyone in & ready to start?</p>
                            <p>Timer is set to:</p>
                            <p className="font-normal">{toMinutesSeconds(game.selectionTimer)}</p>
                        </div>
                        <div className="w-full">
                            <Button text="Yep" className="w-1/2" onClick={() => startGame(game.id)} />
                        </div>
                    </> :
                    <div className="w-full pb-4">
                        <i className="fa-solid fa-hourglass-end text-4xl mb-2"></i>
                        <p>Waiting for the judge to start the game...</p>
                    </div>
                }
            </div>
        </div>
    );
};