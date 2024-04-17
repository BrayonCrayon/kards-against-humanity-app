import React from "react";
import CardResponseDisplay from "Components/Spectation/CardResponseDisplay";

export const SpectatorPage: React.FC = () => {
  // const { state: { players } } = usePlayers();
  // const { state: { auth } } = useAuth();
  // const { state: { game, blackCard } } = useGame();
  // const { id } = useParams<{ id: string }>();

  // const fetchSpectatorState = useFetchSpectatorState();
  // const listenOnEvents = useListenOnEvents();
  // const {submittedCards, getSubmittedCards} = useSubmittedCards();

//// TODO: Make sure to not remove this piece of the code
  // const haveAllPlayersSubmitted = useMemo(() => {
  //   return players.filter(user => user.id !== game.judgeId)
  //     .every(user => user.hasSubmittedWhiteCards);
  // }, [players, game.judgeId]);
  //
  // const setup = useCallback(async () => {
  //   await fetchSpectatorState(id ?? "");
  //   await listenOnEvents(id ?? "", auth.id);
  // }, [id]);

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
//// TODO: End of the main setup of this page

// TODO: Determine when to show the answers and feed that threw the CardResponseDisplay
  // TODO: Move the blackKard to the left hand side of the page when showing answers

// TODO: After all answers have been shown, display the answers in never ending scroll listing animation

// TODO: Display Winner when winner is selected

  return <div className="flex w-full h-full flex-col bg-lukewarmGray-200">
    <iframe className="bg-lukewarmGray-200 w-full" src="https://lottie.host/embed/07bd7bac-9b50-4440-b5e1-38a7a9bcced9/oGrv9hk7Kj.json"></iframe>
    <div className="flex w-full justify-center">
      <div>
        <CardResponseDisplay showAnswers={false} />
      </div>
      {/*<div className="flex flex-grow justify-around">*/}
      {/*  <BlackKard card={blackCard} />*/}
      {/*</div>*/}
      {/*<SpectatePlayerList players={players} judgeId={game.judgeId} />*/}
      {/*{ haveAllPlayersSubmitted*/}
      {/*  ? <DisplaySubmittedCard cards={submittedCards} />*/}
      {/*  : null*/}
      {/*}*/}
    </div>
    </div>
}