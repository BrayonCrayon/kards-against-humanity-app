import { FC, useContext, useEffect } from "react";
import { apiClient } from "../Api/apiClient";
import { GameContext } from "../State/Game/GameContext";

export const VotingSection: FC = () => {
  const { game } = useContext(GameContext);

  const getSubmittedCards = async () => {
    try {
      const { data } = await apiClient.get(
        `/api/game/${game.id}/submitted/cards`
      );
    } catch (error) {
      throw error;
    }
  };

  useEffect(() => {
    getSubmittedCards();
  });

  return <div data-testid={"voting-section"}>Voting</div>;
};
