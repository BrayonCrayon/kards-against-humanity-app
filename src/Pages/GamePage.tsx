import React, { useCallback, useContext, useEffect, useMemo } from "react";
import { useParams } from "react-router-dom";
import { GameContext, useGame } from "../State/Game/GameContext";
import {
  listenWhenGameRotates,
  listenWhenUserJoinsGame,
  listenWhenUserSubmittedCards,
} from "../Services/PusherService";
import useFetchGameState from "../Hooks/Game/useFetchGameState";
import { apiClient } from "../Api/apiClient";
import GameInfo from "../Components/GameInfo";
import { VotingSection } from "../Components/VotingSection";
import { RoundWinnerModal } from "../Components/RoundWinnerModal";
import { Button } from "../Components/Button";
import { useUsers } from "../State/Users/UsersContext";
import { useHand } from "../State/Hand/HandContext";
import { useUser } from "../State/User/UserContext";
import { SetHasSubmittedCards } from "../State/User/UserActions";
import Hand from "../Components/Hand";
import useGameStateCallback from "../Hooks/Game/useGameStateCallback";

const GamePage = () => {
  const {
    state: { game, judge, blackCard },
  } = useGame();

  const {
    state: { hand },
  } = useHand();

  const {
    state: { users },
  } = useUsers();

  const {
    state: { user, hasSubmittedCards },
    dispatch: userDispatch,
  } = useUser();

  const { id } = useParams<{ id: string }>();

  const fetchGameState = useFetchGameState();
  const updateState = useGameStateCallback();

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
      userDispatch(new SetHasSubmittedCards(true));
    } catch (e) {
      console.error(e);
    }
  }, [blackCard, hand, game, hasSubmittedCards]);

  useEffect(() => {
    if (!game.id) {
      fetchGameState(id).then(() => {
        listenWhenUserJoinsGame(id, updateState);
        listenWhenUserSubmittedCards(id, updateState);
        listenWhenGameRotates(id, updateState);
      });
    } else {
      listenWhenGameRotates(game.id, updateState);
      listenWhenUserJoinsGame(game.id, updateState);
      listenWhenUserSubmittedCards(game.id, updateState);
    }
  }, [id]);

  return (
    <div>
      <GameInfo />
      {judge.id !== user.id && !showVotingSection && <Hand />}
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
