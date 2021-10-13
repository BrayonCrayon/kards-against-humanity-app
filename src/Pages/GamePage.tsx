import React, { useCallback } from "react";
import { GameContext } from "../State/Game/GameContext";

const GamePage = () => {
  const copyGameId = useCallback(async (id: string) => {
    try {
      await navigator.clipboard.writeText(id);
    } catch (error) {
      console.error(error);
    }
  }, []);

  return (
    <GameContext.Consumer>
      {({ hand, game, user }) => (
        <div>
          <div
            data-testid={`game-${game.id}`}
            onClick={() => copyGameId(game.id)}
          >
            {game.id}
          </div>
          <div>{user.name}</div>
          {hand.map((card) => (
            <div key={card.id} data-testid={`white-card-${card.id}`}>
              {card.text}
            </div>
          ))}
        </div>
      )}
    </GameContext.Consumer>
  );
};

export default GamePage;
