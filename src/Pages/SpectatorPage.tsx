import React, {useCallback, useMemo, useState} from "react";
import {usePlayers} from "State/Players/usePlayers";
import {useGame} from "State/Game/useGame";
import useFetchSpectatorState from "Hooks/Game/State/useFetchSpectatorState";
import {useParams} from "react-router-dom";
import useListenOnEvents from "Hooks/Helpers/useListenOnEvents";
import useSubmittedCards from "Hooks/Game/State/useSubmittedCards";
import {useAuth} from "../State/Auth/useAuth";
import {WhiteKard} from "../Components/WhiteKard";
import {WhiteCard} from "../Types/WhiteCard";

export const SpectatorPage: React.FC = () => {
  const { state: { players } } = usePlayers();
  const { state: { auth } } = useAuth();
  const { state: { game, blackCard } } = useGame();
  const { id } = useParams<{ id: string }>();
  const whiteCard = new WhiteCard(0, "I am a white card", 0, false);
  const [show, setShow] = useState(false);

  const fetchSpectatorState = useFetchSpectatorState();
  const listenOnEvents = useListenOnEvents();
  const {submittedCards, getSubmittedCards} = useSubmittedCards();

  const haveAllPlayersSubmitted = useMemo(() => {
    return players.filter(user => user.id !== game.judgeId)
      .every(user => user.hasSubmittedWhiteCards);
  }, [players, game.judgeId]);

  const setup = useCallback(async () => {
    await fetchSpectatorState(id ?? "");
    await listenOnEvents(id ?? "", auth.id);
  }, [id]);

  // useEffect(() => {
  //   if (game.id) {
  //     listenOnEvents(game.id, auth.id);
  //     return;
  //   }
  //
  //   setup();
  // }, []);
  //
  // useEffect(() => {
  //   if (game.id && haveAllPlayersSubmitted) {
  //     getSubmittedCards(game.id);
  //   }
  // },[game, haveAllPlayersSubmitted]);

  return <div className="flex w-full h-full bg-lukewarmGray-200">
    {/*<CSSTransition in={show} timeout={300} unmountOnExit classNames={"spectator-card-slide"}>*/}
    {/*  <WhiteKard card={whiteCard} onClick={() => {}} />*/}
    {/*</CSSTransition>*/}
    <div className="spectator-card-animation">
        <WhiteKard card={whiteCard} onClick={() => {}} />
    </div>
    <button onClick={() => setShow(!show)}>Show</button>
    {/*<div className="flex flex-grow justify-around">*/}
    {/*  <BlackKard card={blackCard} />*/}
    {/*</div>*/}
    {/*<SpectatePlayerList players={players} judgeId={game.judgeId} />*/}
    {/*{ haveAllPlayersSubmitted*/}
    {/*  ? <DisplaySubmittedCard cards={submittedCards} />*/}
    {/*  : null*/}
    {/*}*/}
  </div>
}