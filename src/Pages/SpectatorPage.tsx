import React, { useCallback, useEffect, useMemo } from "react";
import { useGame } from "@/State/Game/useGame";
import { useSpectate } from "@/State/Spectate/useSpectate";
import SpectatePlayerList from "@/Components/Spectation/SpectatePlayerList";
import { useParams } from "react-router-dom";
import { useAuth } from "@/State/Auth/useAuth";
import { usePlayers } from "@/State/Players/usePlayers";
import useFetchSpectatorState from "@/Hooks/Game/State/useFetchSpectatorState";
import useSubmittedCards from "@/Hooks/Game/State/useSubmittedCards";
import WinnerRoom from "@/Components/Spectation/WinnerRoom";
import useListenOnSpectatorEvents from "@/Hooks/Helpers/useListenOnSpectatorEvents";
import { Stage } from "@/State/Spectate/SpectateState";
import ReviewRoom from "@/Components/Spectation/ReviewRoom";
import CardResponseRoom from "@/Components/Spectation/CardResponseRoom";
import { BlackKard } from "@/Components/BlackKard";
import { cardSize, nonJudgePlayers } from "@/Utilities/helpers";
import Timer from "@/Components/Atoms/Timer";
import { useSwitchStages } from "@/Hooks/Spectate/useSwitchStages";
import useDetermineWinner from "@/Hooks/Spectate/useDetermineWinner";

export const SpectatorPage: React.FC = () => {
  const { state: { players } } = usePlayers();
  const { state: { auth } } = useAuth();
  const { state: { game, blackCard } } = useGame();
  const { state: { stage } } = useSpectate();
  const { id } = useParams<{ id: string }>();

  useSwitchStages(nonJudgePlayers(game.judgeId, players), stage);
  const fetchSpectatorState = useFetchSpectatorState();
  const listenOnEvents = useListenOnSpectatorEvents();
  const { whiteCards, submittedCards, getSubmittedCards } = useSubmittedCards();
  const { winner, winnerCards } = useDetermineWinner(players)

  const haveAllPlayersSubmitted = useMemo(() => {
    return players.filter(user => user.id !== game.judgeId)
      .every(user => user.hasSubmittedWhiteCards);
  }, [players, game.judgeId]);

  const setup = useCallback(async () => {
    await fetchSpectatorState(id ?? "");
    listenOnEvents(id ?? "", auth.id);
  }, [id]);

  useEffect(() => {
    if (game.id) {
      listenOnEvents(game.id, auth.id);
      return;
    }

    setup();
  }, []);

  useEffect(() => {
    if (game.id && haveAllPlayersSubmitted) {
      getSubmittedCards(game.id);
    }
  }, [game, haveAllPlayersSubmitted]);

  return (
    <div className="flex w-full h-full bg-lukewarmGray-300">
      <div className="flex w-3/4 relative">
        {
          stage === Stage.DISPLAY_BLACK_CARD &&
          <div className="flex flex-col h-full w-full">
            <div className="flex flex-col grow justify-center w-full items-center">
              <BlackKard card={blackCard} size={cardSize(blackCard.text)} hidePlayButton />
            </div>
            {
              !!game.selectionEndsAt && !!game.selectionTimer &&
              <Timer end={game.selectionEndsAt} />
            }
          </div>
        }
        {
          stage === Stage.DISPLAY_SUBMISSIONS && whiteCards.length &&
          <div className="flex flex-col h-full w-full grow justify-center items-center">
            <CardResponseRoom showAnswers={true} dataTestId="submissions-display" cards={whiteCards} />
          </div>
        }
        {
          stage === Stage.DISPLAY_WAITING_ROOM &&
          <ReviewRoom
            gameId={game.id}
            blackCard={blackCard}
            submissions={submittedCards}
          />
        }
        {
          stage === Stage.DISPLAY_WINNER &&
          winner &&
          <WinnerRoom player={winner} cards={winnerCards} />
        }
      </div>
      <SpectatePlayerList players={players} judgeId={game.judgeId} />
    </div>
  );
};