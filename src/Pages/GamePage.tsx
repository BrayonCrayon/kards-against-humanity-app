import React, { useCallback, useContext, useEffect } from "react";
import { useParams } from "react-router-dom";
import { GameContext } from "../State/Game/GameContext";
import { WhiteKard } from "../Components/WhiteKard";
import { BlackKard } from "../Components/BlackKard";
import { listenWhenUserJoinsGame } from "../Services/PusherService";
import useFetchGameState from "../Hooks/Game/UseFetchGameState";

const GamePage = () => {
  const {
    hand,
    game,
    user,
    users,
    blackCard,
    userJoinedGameCallback,
    setUsers,
    setUser,
    setGame,
    setHand,
    setBlackCard,
  } = useContext(GameContext);

  const fetchGameState = useFetchGameState(
    setUsers,
    setUser,
    setGame,
    setHand,
    setBlackCard
  );

  const copyGameCode = useCallback(async (code: string) => {
    try {
      await navigator.clipboard.writeText(code);
    } catch (error) {
      console.error(error);
    }
  }, []);

  const { id } = useParams<{ id: string }>();

  useEffect(() => {
    if (!game.id) {
      fetchGameState(id).then(() =>
        listenWhenUserJoinsGame(id, userJoinedGameCallback)
      );
    } else {
      listenWhenUserJoinsGame(game.id, userJoinedGameCallback);
    }
  }, [game, fetchGameState, id, userJoinedGameCallback]);

  return (
    <div>
      <div className="flex justify-between items-start">
        <div
          data-testid={`game-${game.id}`}
          onClick={() => copyGameCode(game.code)}
          className="border-2 border-gray-300 shadow-md p-2 m-2 rounded font-semibold"
        >
          <span className="text-gray-700">Game Code:</span> {game.code}
        </div>

        <div className="border-2 border-gray-300 shadow-md p-2 m-2 rounded font-semibold">
          <span className="text-gray-700">You:</span> {user.name}
        </div>
        <div className="border-2 border-gray-300 shadow-md p-2 m-2 rounded flex-col">
          <h1 className="text-gray-700 text-xl border-b-2 border-gray-500">
            Users
          </h1>
          {users.map((user) => (
            <div className="py-2 text-center font-semibold" key={user.id}>
              <p>{user.name}</p>
            </div>
          ))}
        </div>
      </div>
      <div className="mx-auto my-2 w-1/3">
        <BlackKard card={blackCard} />
      </div>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 p-2">
        {hand.map((card) => (
          <WhiteKard card={card} key={card.id} />
        ))}
      </div>
    </div>
  );
};

export default GamePage;
