import React, { useCallback, useContext, useEffect } from "react";
import { useParams } from "react-router-dom";
import { GameContext } from "../State/Game/GameContext";
import { Kard } from "../Components/Kard";
import { apiClient } from "../Api/apiClient";
import { Game } from "../Types/Game";

const GamePage = () => {
  const {
    setGame,
    setUser,
    setHand,
    setBlackCard,
    hand,
    game,
    user,
    blackCard,
  } = useContext(GameContext);

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
    setUser(data.data.current_user);
    setGame({
      id: data.data.id,
      judge_id: data.data.judge.id,
      name: data.data.name,
    } as Game);
    setHand(data.data.hand);
    setBlackCard(data.data.current_black_card);
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
      <div data-testid={`black-card-${blackCard.id}`}>{blackCard.text}</div>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 p-2">
        {hand.map((card) => (
          <Kard id={card.id} text={card.text} key={card.id} />
        ))}
      </div>
    </div>
  );
};

export default GamePage;
