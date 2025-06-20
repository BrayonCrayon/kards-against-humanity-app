import React, { FC, useState } from "react";
import { BlackKard } from "@/Components/BlackKard";
import { usePlayers } from "@/State/Players/usePlayers";
import PlayerNotificationBar from "@/Components/PlayerNotificationBar";
import { useAuth } from "@/State/Auth/useAuth";
import { useGame } from "@/State/Game/useGame";
import Settings from "@/Components/Sidebars/Settings";
import ShareButton from "@/Components/Atoms/ShareButton";
import { ShareData } from "@/Types/WebShare";
import CopyGameCode from "@/Components/Molecules/CopyGameCode";
import JudgeIndicator from "@/Components/Molecules/JudgeIndicator";

const GameInfo: FC = () => {
  const {
    state: { game, blackCard },
  } = useGame();
  const {
    state: { players },
  } = usePlayers();
  const {
    state: { auth },
  } = useAuth();

  const [data] = useState<ShareData>({
    title: "Kards Against Humanity",
    text: "Come join my game!",
    url: `https://kardsagainsthumanity.ca/${game.code}`,
  });

  return (
    <div>
      <div className="flex flex-wrap items-center gap-y-2 md:flex-row md:justify-between">
        <PlayerNotificationBar users={players} judgeId={game.judgeId} />
        <div className="bg-white px-3 shadow-md rounded-full h-10 text-xl flex justify-center ml-2 md:hidden">
          <ShareButton data={data} />
        </div>
        <div className="shadow-md p-2 m-2 md:w-auto">
          <CopyGameCode code={game.code} />
        </div>
        <Settings className="grow md:grow-0 md:mr-5" players={players} />
      </div>
      <div className="pb-12 mx-auto my-2 pt-4 w-full px-6 flex flex-col items-center gap-y-4 md:w-1/2 lg:w-1/3">
        {auth.id === game.judgeId && <JudgeIndicator />}
        <BlackKard card={blackCard} />
      </div>
    </div>
  );
};

export default GameInfo;
