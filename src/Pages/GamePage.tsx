import React, { useCallback, useContext, useEffect } from "react";
import { useParams } from "react-router-dom";
import { GameContext } from "../State/Game/GameContext";
import { Kard } from "../Components/Kard";
import { apiClient } from "../Api/apiClient";
import { Game } from "../Types/Game";
import { BlackKard } from "../Components/BlackKard";
import { listenWhenUserJoinsGame } from "../Services/PusherService";

const GamePage = () => {
  const {
    setGame,
    setUser,
    setUsers,
    setHand,
    setBlackCard,
    hand,
    game,
    user,
    users,
    blackCard,
    userJoinedGameCallback,
  } = useContext(GameContext);

  const copyGameCode = useCallback(async (code: string) => {
    try {
      await navigator.clipboard.writeText(code);
    } catch (error) {
      console.error(error);
    }
  }, []);

  const { id } = useParams<{ id: string }>();

  const fetchGameState = useCallback(async () => {
    try {
      const { data } = await apiClient.get(`/api/game/${id}`);
      setUser(data.current_user);
      setUsers(data.users);
      setGame({
        id: data.id,
        judge_id: data.judge.id,
        name: data.name,
        code: data.code,
      } as Game);
      setHand(data.hand);
      setBlackCard(data.current_black_card);
      listenWhenUserJoinsGame(data.id, userJoinedGameCallback);
    } catch (error) {
      console.error(error);
    }
  }, []);

  useEffect(() => {
    if (!game.id) {
      fetchGameState();
    } else {
      listenWhenUserJoinsGame(game.id, userJoinedGameCallback);
    }
  }, []);

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
