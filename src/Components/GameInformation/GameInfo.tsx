import React, { FC, useState } from "react";
import { BlackKard } from "Components/BlackKard";
import { usePlayers } from "State/Players/usePlayers";
import PlayerNotificationBar from "Components/PlayerNotificationBar";
import JudgeMessage from "Components/JudgeMessage";
import { useAuth } from "State/Auth/useAuth";
import { useGame } from "State/Game/useGame";
import Settings from "Components/Sidebars/Settings";
import CopyIcon from "Components/Icons/CopyIcon";
import ClipBoard from "Components/Atoms/ClipBoard";
import ShareButton from "Components/Atoms/ShareButton";
import { ShareData } from "Types/WebShare";

const GameInfo: FC = () => {
  const { state: { game, blackCard }, } = useGame();
  const { state: { players }, } = usePlayers();
  const { state: { auth }, } = useAuth();
  const [data] = useState<ShareData>({
    title: 'Kards Against Humanity',
    text: 'Come join my game!',
    url: `https://kardsagainsthumanity.ca/${game.code}`
  });

  return (
    <div>
      <div className="flex flex-wrap items-center md:flex-row md:justify-between">
        <PlayerNotificationBar users={players} judgeId={game.judgeId} />
        <div className="bg-white px-3 shadow-md rounded-full h-10 text-xl flex justify-center ml-2 md:hidden">
          <ShareButton data={data} />
        </div>
        <div className="border-2 w-3/5 border-gray-200 shadow-md p-2 m-2 font-semibold md:w-auto">
          <ClipBoard copy={game.code} className="flex" successMessage="Game code copied!" messagePosition="center">
            <CopyIcon />
            <span className="text-gray-700 px-1">Code:</span> {game.code}
          </ClipBoard>
        </div>
        <Settings className="flex-grow md:flex-grow-0 md:mr-5" gameId={game.id} players={players} />
      </div>
      <div className="mx-auto my-2 w-full px-6 flex flex-col items-center md:w-1/2 lg:w-1/3">
        <BlackKard card={blackCard} />
        <div className="border-b-4 border-black h-8 w-10 self-center"></div>
      </div>
      <JudgeMessage user={auth} judgeId={game.judgeId} users={players} className="mt-6" />
    </div>
  );
};

export default GameInfo;
