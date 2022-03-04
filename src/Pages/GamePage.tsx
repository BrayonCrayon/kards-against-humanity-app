import React, { useCallback, useContext, useEffect, useMemo } from "react";
import { useParams } from "react-router-dom";
import { GameContext } from "../State/Game/GameContext";
import { WhiteKard } from "../Components/WhiteKard";
import {
  listenWhenGameRotates,
  listenWhenUserJoinsGame,
  listenWhenUserSubmittedCards,
} from "../Services/PusherService";
import useFetchGameState from "../Hooks/Game/UseFetchGameState";
import { apiClient } from "../Api/apiClient";
import GameInfo from "../Components/GameInfo";
import { VotingSection } from "../Components/VotingSection";
import { useVote } from "../State/Vote/VoteContext";
import { RoundWinnerModal } from "../Components/RoundWinnerModal";
import { Button } from "../Components/Button";

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
        listenWhenGameRotates(id, updateGameStateCallback);
      });
    } else {
      listenWhenGameRotates(game.id, updateGameStateCallback);
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
          <Button
            text="Submit"
            onClick={onSubmit}
            dataTestid="white-card-submit-btn"
            className={
              !canSubmitCards
                ? "shadow-inner opacity-70 cursor-not-allowed"
                : ""
            }
            disabled={!canSubmitCards}
          />
        </div>
      )}
      {showVotingSection && <VotingSection />}
      <RoundWinnerModal />
    </div>
  );
};

export default GamePage;
