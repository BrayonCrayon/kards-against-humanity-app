import React, { useCallback, useContext, useEffect } from "react";
import { useParams } from "react-router-dom";
import { GameContext } from "../State/Game/GameContext";
import { Kard } from "../Components/Kard";
import { apiClient } from "../Api/apiClient";
import { Game } from "../Types/Game";
import { BlackKard } from "../Components/BlackKard";

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
  //TODO:
  //check to see if useCallBack is necessary for this functionality
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
      setGame({
        id: data.id,
        judge_id: data.judge.id,
        name: data.name,
        code: data.code,
      } as Game);
      setHand(data.hand);
      setBlackCard(data.current_black_card);
    } catch (error) {
      console.error(error);
    }
  }, []);

  useEffect(() => {
    if (!game.id) {
      fetchGameState();
    }
  });

  return (
    <div>
      <div
        data-testid={`game-${game.id}`}
        onClick={() => copyGameCode(game.code)}
      >
        {game.code}
      </div>
      <div>{user.name}</div>
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
