import React, { useCallback, useContext, useEffect, useMemo } from "react";
import { useParams } from "react-router-dom";
import { GameContext } from "../State/Game/GameContext";
import { WhiteKard } from "../Components/WhiteKard";
import {
  listenWhenUserJoinsGame,
  listenWhenUserSubmittedCards,
} from "../Services/PusherService";
import useFetchGameState from "../Hooks/Game/UseFetchGameState";
import { apiClient } from "../Api/apiClient";
import GameInfo from "../Components/GameInfo";
import { VotingSection } from "../Components/VotingSection";
import { useVote } from "../State/Vote/VoteContext";
import { RoundWinnerModal } from "../Components/RoundWinnerModal";

const GamePage = () => {
  const {
    hand,
    game,
    users,
    user,
    blackCard,
    hasSubmittedCards,
    judge,
    updateGameStateCallback,
    setUsers,
    setUser,
    setGame,
    setHand,
    setBlackCard,
    setHasSubmittedCards,
    setJudge,
  } = useContext(GameContext);

  const {
    state: { selectedRoundWinner },
  } = useVote();

  const { id } = useParams<{ id: string }>();

  const fetchGameState = useFetchGameState(
    setUsers,
    setUser,
    setGame,
    setHand,
    setBlackCard,
    setHasSubmittedCards,
    setJudge
  );

  const showVotingSection = useMemo(() => {
    const players = users.filter((item) => item.id !== judge.id);
    return (
      players.length > 0 &&
      players.filter((item) => item.hasSubmittedWhiteCards).length ===
        players.length
    );
  }, [users, judge]);

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
          .sort((leftCard, rightCard) => leftCard.order - rightCard.order)
          .map((card) => card.id),
      });
      setHasSubmittedCards(true);
    } catch (e) {
      console.error(e);
    }
  }, [blackCard, hand, game, setHasSubmittedCards, hasSubmittedCards]);

  useEffect(() => {
    if (!game.id) {
      fetchGameState(id).then(() => {
        listenWhenUserJoinsGame(id, updateGameStateCallback);
        listenWhenUserSubmittedCards(id, updateGameStateCallback);
      });
    } else {
      listenWhenUserJoinsGame(game.id, updateGameStateCallback);
      listenWhenUserSubmittedCards(game.id, updateGameStateCallback);
    }
  }, [fetchGameState, id]);

  return (
    <div>
      <GameInfo />
      {judge.id !== user.id && !showVotingSection && (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 p-2">
          {hand.map((card) => (
            <WhiteKard card={card} key={card.id} />
          ))}
        </div>
      )}
      {judge.id !== user.id && !showVotingSection && (
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
      {showVotingSection && <VotingSection />}
      <RoundWinnerModal />
    </div>
  );
};

export default GamePage;
