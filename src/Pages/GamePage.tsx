import React, { useCallback, useContext, useEffect } from "react";
import { useParams } from "react-router-dom";
import { GameContext } from "../State/Game/GameContext";
import { Kard } from "../Components/Kard";
import { apiClient } from "../Api/apiClient";
import { Game } from "../Types/Game";

const GamePage = () => {
  const { setGame, setUser, setHand, hand, game, user } =
    useContext(GameContext);

  const copyGameId = useCallback(async (id: string) => {
    try {
      await navigator.clipboard.writeText(id);
    } catch (error) {
      console.error(error);
    }
  }, []);

  const { id } = useParams<{ id: string }>();

  const fetchGameState = useCallback(async () => {
    const { data } = await apiClient.get(`/api/game/${id}`);
    console.log("game state", data);
    setUser(data.data.current_user);
    setGame({
      id: data.data.id,
      judge_id: data.data.judge.id,
      name: data.data.name,
    } as Game);
    setHand(data.data.hand);
  }, []);

  useEffect(() => {
    if (!game.id) {
      fetchGameState();
    }
  });

  return (
    <div>
      <div data-testid={`game-${game.id}`} onClick={() => copyGameId(game.id)}>
        {game.id}
      </div>
      <div>{user.name}</div>
      {hand.map((card) => (
        <Kard id={card.id} text={card.text} key={card.id} />
      ))}
    </div>
  );
};

export default GamePage;
