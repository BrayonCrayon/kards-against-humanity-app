import React, { useCallback, useEffect, useMemo } from "react";
import { usePlayers } from "State/Players/usePlayers";
import { useGame } from "State/Game/useGame";
import useFetchSpectatorState from "Hooks/Game/useFetchSpectatorState";
import { useParams } from "react-router-dom";
import useListenOnEvents from "Hooks/Helpers/useListenOnEvents";
import SpectatePlayerList from "Components/Spectation/SpectatePlayerList";
import { BlackKard } from "Components/BlackKard";
import DisplaySubmittedCard from "Components/DisplaySubmittedCard";
import useSubmittedCards from "Hooks/Game/useSubmittedCards";

export const SpectatorPage: React.FC = () => {
  const { state: { players } } = usePlayers();
  const { state: { game, blackCard } } = useGame();
  const { id } = useParams<{ id: string }>();

  const fetchSpectatorState = useFetchSpectatorState();
  const listenOnEvents = useListenOnEvents();
  const {submittedCards, getSubmittedCards} = useSubmittedCards();

  const haveAllPlayersSubmitted = useMemo(() => {
    return players.filter(user => user.id !== game.judgeId)
      .every(user => user.hasSubmittedWhiteCards);
  }, [players, game.judgeId]);

  const setup = useCallback(async () => {
    await fetchSpectatorState(id)
    await listenOnEvents(id);
  }, [id]);

  useEffect(() => {
    if (game.id) {
      listenOnEvents(game.id);
      return;
    }

    setup();
  }, []);

  useEffect(() => {
    if (game.id && haveAllPlayersSubmitted) {
      getSubmittedCards(game.id);
    }
  },[game, haveAllPlayersSubmitted]);

  return <>
    <SpectatePlayerList players={players} judgeId={game.judgeId} />
    <div className="flex justify-around">
      <BlackKard card={blackCard} />
    </div>
    { haveAllPlayersSubmitted &&
      <DisplaySubmittedCard cards={submittedCards} />
    }
  </>
}