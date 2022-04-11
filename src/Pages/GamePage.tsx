import React, { useCallback, useEffect, useMemo } from "react";
import { useParams } from "react-router-dom";
import { useGame } from "State/Game/GameContext";
import useFetchGameState from "Hooks/Game/useFetchGameState";
import GameInfo from "Components/GameInfo";
import { VotingSection } from "Components/VotingSection";
import { RoundWinnerModal } from "Components/RoundWinnerModal";
import { Button } from "Components/Button";
import { useUsers } from "State/Users/UsersContext";
import { useHand } from "State/Hand/HandContext";
import { useUser } from "State/User/UserContext";
import Hand from "Components/Hand";
import useListenOnEvents from "Hooks/Helpers/useListenOnEvents";
import useSubmitCards from "Hooks/Game/useSubmitCards";

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
  } = useUser();

  const { id } = useParams<{ id: string }>();

  const fetchGameState = useFetchGameState();
  const listenOnEvents = useListenOnEvents();
  const submitCards = useSubmitCards();

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

    await submitCards(game.id, blackCard.pick, hand);
  }, [blackCard, hand, game, hasSubmittedCards]);

  useEffect(() => {
    if (game.id) {
      listenOnEvents(game.id);
      return;
    }

    fetchGameState(id).then(() => {
      listenOnEvents(id);
    });
  }, [id]);

  return (
    <div>
      <GameInfo />
      {judge.id !== user.id && !showVotingSection && (
        <>
          <Hand />
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
        </>
      )}
      {showVotingSection && <VotingSection />}
      <RoundWinnerModal />
    </div>
  );
};

export default GamePage;
