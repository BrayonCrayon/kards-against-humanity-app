import React, { useCallback, useContext, useEffect, useMemo } from "react";
import { useParams } from "react-router-dom";
import { GameContext } from "../State/Game/GameContext";
import { WhiteKard } from "../Components/WhiteKard";
import { BlackKard } from "../Components/BlackKard";
import { listenWhenUserJoinsGame } from "../Services/PusherService";
import useFetchGameState from "../Hooks/Game/UseFetchGameState";
import { happyToast } from "../Utilities/toasts";
import { apiClient } from "../Api/apiClient";
import GameInfo from "../Components/GameInfo";

const GamePage = () => {
  const {
    hand,
    game,
    user,
    blackCard,
    hasSubmittedCards,
    judge,
    userJoinedGameCallback,
    setUsers,
    setUser,
    setGame,
    setHand,
    setBlackCard,
    setHasSubmittedCards,
    setJudge,
  } = useContext(GameContext);

  const fetchGameState = useFetchGameState(
    setUsers,
    setUser,
    setGame,
    setHand,
    setBlackCard,
    setHasSubmittedCards,
    setJudge
  );

  const canSubmitCards = useMemo(() => {
    return (
      hand.filter((item) => item.selected).length > 0 && !hasSubmittedCards
    );
  }, [hand, hasSubmittedCards]);

  const onSubmit = useCallback(async () => {
    if (hasSubmittedCards) return;

    try {
      await apiClient.post(`/api/game/${game.id}/submit`, {
        submitAmount: blackCard.pick,
        whiteCardIds: hand
          .filter((card) => card.selected)
          .map((card) => card.id),
      });
      setHasSubmittedCards(true);
    } catch (e) {
      console.error(e);
    }
  }, [blackCard, hand, game, setHasSubmittedCards, hasSubmittedCards]);

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
      <GameInfo />
      {judge.id !== user.id && (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 p-2">
          {hand.map((card) => (
            <WhiteKard card={card} key={card.id} />
          ))}
        </div>
      )}
      {judge.id !== user.id && (
        <div className="flex justify-center">
          <button
            onClick={onSubmit}
            data-testid="white-card-submit-btn"
            className={`bg-gray-300 p-2 text-gray-900 font-semibold rounded shadow mt-4 ${
              !canSubmitCards
                ? "shadow-inner opacity-70 cursor-not-allowed"
                : "hover:bg-gray-200"
            }`}
            disabled={!canSubmitCards}
          >
            Submit
          </button>
        </div>
      )}
    </div>
  );
};

export default GamePage;
