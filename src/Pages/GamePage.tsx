import React, { useCallback, useEffect, useMemo } from "react";
import { useParams } from "react-router-dom";
import { useGame } from "State/Game/useGame";
import useFetchGameState from "Hooks/Game/useFetchGameState";
import GameInfo from "Components/GameInfo";
import { VotingSection } from "Components/VotingSection";
import { RoundWinnerModal } from "Components/RoundWinnerModal";
import { Button } from "Components/Button";
import { usePlayers } from "State/Players/usePlayers";
import { useHand } from "State/Hand/useHand";
import { useAuth } from "State/Auth/useAuth";
import Hand from "Components/Hand";
import useListenOnEvents from "Hooks/Helpers/useListenOnEvents";
import useSubmitCards from "Hooks/Game/useSubmitCards";

const GamePage = () => {
  const {
    state: { game, blackCard },
  } = useGame();

  const {
    state: { hand },
  } = useHand();

  const {
    state: { players },
  } = usePlayers();

  const {
    state: { auth, hasSubmittedCards },
  } = useAuth();

  const { id } = useParams<{ id: string }>();

  const fetchGameState = useFetchGameState();
  const listenOnEvents = useListenOnEvents();
  const submitCards = useSubmitCards();

  const showVotingSection = useMemo(() => {
    const currentPlayers = players.filter((item) => item.id !== game.judgeId);
    return (
      currentPlayers.length > 0 &&
      currentPlayers.filter((item) => item.hasSubmittedWhiteCards).length ===
        currentPlayers.length
    );
  }, [players, game]);

  const canSubmitCards = useMemo(() => {
    return (
      hand.filter((item) => item.selected).length > 0 && !hasSubmittedCards
    );
  }, [hand, hasSubmittedCards]);

  const submitStyles = useMemo(() => {
    return !canSubmitCards ? "shadow-inner opacity-70 cursor-not-allowed" : "";
  }, [canSubmitCards]);

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
      {game.judgeId !== auth.id && !showVotingSection && (
        <>
          <Hand />
          {
            canSubmitCards ?
            <div className="flex justify-center">
              <Button
                text="Submit"
                onClick={onSubmit}
                dataTestid="white-card-submit-btn"
                className={submitStyles}
              />
            </div> : null
          }
        </>
      )}
      {showVotingSection && <VotingSection />}
      <RoundWinnerModal />
    </div>
  );
};

export default GamePage;
