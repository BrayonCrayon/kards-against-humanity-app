import React, { useCallback, useEffect, useMemo } from "react";
import { useParams } from "react-router-dom";
import { useGame } from "@/State/Game/useGame";
import useFetchGameState from "@/Hooks/Game/State/useFetchGameState";
import GameInfo from "@/Components/GameInformation/GameInfo";
import { VotingSection } from "@/Components/VotingSection";
import { RoundWinnerModal } from "@/Components/RoundWinnerModal";
import { usePlayers } from "@/State/Players/usePlayers";
import { useHand } from "@/State/Hand/useHand";
import { useAuth } from "@/State/Auth/useAuth";
import Hand from "@/Components/Hand";
import useListenOnEvents from "@/Hooks/Helpers/useListenOnEvents";
import useSubmitCards from "@/Hooks/Game/Actions/useSubmitCards";
import { PreGameModal } from "@/Components/PreGameModal";
import SelectionRoundTimer from "@/Components/Molecules/SelectionRoundTimer";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faMugHot } from "@fortawesome/free-solid-svg-icons";
import PlayerDrumRollModal from "@/Components/PlayerDrumRollModal";
import KAHNotification from "@/Components/Molecules/KAHNotification";
import { useNotifications } from "@/State/Notifications/useNotifications";

const GamePage = () => {
  const {
    state: { game, blackCard, hasSpectator },
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

  const {
    state: { notifications },
  } = useNotifications();

  const { id } = useParams<{ id: string }>();

  const fetchGameState = useFetchGameState();
  const listenOnEvents = useListenOnEvents();
  const submitCards = useSubmitCards();

  const showVotingSection = useMemo(() => {
    const currentPlayers = players.filter((item) => item.id !== game.judgeId);
    return currentPlayers.length > 0 && currentPlayers.every((user) => user.hasSubmittedWhiteCards);
  }, [players, game]);

  const onSubmit = useCallback(async () => {
    if (hasSubmittedCards) return;

    await submitCards(game.id, blackCard.pick, hand);
  }, [blackCard, hand, game, hasSubmittedCards]);

  useEffect(() => {
    if (game.id) {
      listenOnEvents(game.id, auth.id);
      return;
    }

    fetchGameState(id ?? "").then(() => {
      listenOnEvents(id ?? "", auth.id);
    });
  }, [id]);

  return (
    <div className="h-full relative">
      <GameInfo />
      {notifications.map((notification) => (
        <KAHNotification message={notification.message} />
      ))}
      {game.judgeId !== auth.id && !hasSubmittedCards && (
        <div className="bg-lukewarmGray-300">
          <Hand onSubmit={onSubmit} />
        </div>
      )}
      {!showVotingSection && hasSubmittedCards ? (
        <div className="flex flex-col justify-center items-center mt-10 px-4">
          <p className="text-lg font-bold text-center self-center">
            You have submitted your cards, sit tight for judging.
          </p>
          <FontAwesomeIcon icon={faMugHot} size="3x" className="pb-2 ml-2" />
        </div>
      ) : null}
      {showVotingSection && <VotingSection />}
      {!hasSpectator && <RoundWinnerModal />}
      {hasSpectator && <PlayerDrumRollModal />}
      <PreGameModal />
      {!showVotingSection && <SelectionRoundTimer className="fixed bottom-2 left-2 w-20" />}
    </div>
  );
};

export default GamePage;
