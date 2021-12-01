import React, { useCallback, useContext, useEffect } from "react";
import { useParams } from "react-router-dom";
import { GameContext } from "../State/Game/GameContext";
import { Kard } from "../Components/Kard";
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
          className="border p-2 m-2"
        >
          <span className="font-bold">Game Code</span> {game.code}
        </div>

        <div className="border p-2 m-2">
          <span className="font-bold">You</span> {user.name}
        </div>
        <div className="border p-2 m-2">
          <h1 className="font-bold">Users</h1>
          {users.map((user) => (
            <div key={user.id}>
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
          <Kard id={card.id} text={card.text} key={card.id} />
        ))}
      </div>
    </div>
  );
};

export default GamePage;
