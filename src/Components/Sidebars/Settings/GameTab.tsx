import React, { FC, useCallback } from "react";
import useLeaveGame from "Hooks/Game/Actions/useLeaveGame";
import useLoading from "Hooks/Game/Shared/useLoading";

const GameTab: FC<{ gameId: string }> = ({ gameId }) => {
  const leaveGame = useLeaveGame();
  const { loading, setLoading } = useLoading();

  const leave = useCallback(async () => {
    setLoading(true);
    await leaveGame(gameId);
  }, [gameId]);

  return (
    <div className="flex justify-center">
      {
        <button
          className="bg-black w-full self-center py-3 mt-20 px-4 text-white font-bold shadow hover:bg-gray-800 "
          onClick={() => leave()}
          role="leave-game-button"
        >
          <i className="fa-solid fa-door-open pr-2"></i>
          Leave Game
          {loading ? <i className="ml-2 fa-solid fa-spinner animate-spin" /> : null}
        </button>
      }
    </div>
  );
};

export default GameTab;
