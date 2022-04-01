import React, { useCallback, useContext, useEffect, useMemo } from "react";
import { useParams } from "react-router-dom";
import { GameContext } from "../State/Game/GameContext";
import { WhiteKard } from "../Components/WhiteKard";
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

const GamePage = () => {
  const {
    game,
    blackCard,
    judge,
    updateGameStateCallback,
    setGame,
    setBlackCard,
    setJudge,
  } = useContext(GameContext);

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

  const fetchGameState = useFetchGameState(setGame, setBlackCard, setJudge);

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
      // setHasSubmittedCards(true);
      userDispatch(new SetHasSubmittedCards(true));
    } catch (e) {
      console.error(e);
    }
  }, [blackCard, hand, game, hasSubmittedCards]);

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
  }, [id]);

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
