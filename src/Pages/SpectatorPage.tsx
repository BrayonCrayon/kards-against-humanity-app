import React, { useCallback, useEffect, useState } from "react";
import { WhiteKard } from "../Components/WhiteKard";
import { WhiteCard } from "../Types/WhiteCard";
import useReadText from "Hooks/Helpers/useReadText";

export const SpectatorPage: React.FC = () => {
  // const { state: { players } } = usePlayers();
  // const { state: { auth } } = useAuth();
  // const { state: { game, blackCard } } = useGame();
  // const { id } = useParams<{ id: string }>();

  // const fetchSpectatorState = useFetchSpectatorState();
  // const listenOnEvents = useListenOnEvents();
  // const {submittedCards, getSubmittedCards} = useSubmittedCards();
  const [whiteCard, setWhiteCard] = useState<null|WhiteCard>(null)

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

  const {setOnEnd, play} = useReadText();
  const tempWhiteCards = [
    new WhiteCard(0, "1", 0, false),
    new WhiteCard(1, "2", 0, false),
    new WhiteCard(2, "3", 0, false),
  ]

  const renderWhiteCards = useCallback(async () => {
    if (!whiteCard) return;
    // for(let i = 0; i < tempWhiteCards.length; i++){
    //   setWhiteCard(tempWhiteCards[i]);
      await play(whiteCard.text);


      // if (tempWhiteCards[i + 1]) {
      //   setOnEnd(() => play(tempWhiteCards[i + 1].text))
      // }
    // }
  }, []);

  const setupNextCard = useCallback(() => {
    if (!whiteCard) return;
    setWhiteCard(null);

    const idx = tempWhiteCards.findIndex((card) => card.id === whiteCard.id);

    if ((idx + 1) >= tempWhiteCards.length) {
      setWhiteCard(null);
    }

    setWhiteCard(tempWhiteCards[idx + 1]);
  }, [whiteCard]);

  useEffect(() => {
    setOnEnd(() => {
      setTimeout(() => {
        setupNextCard();
      }, 10000);
    });
  }, [whiteCard]);
  useEffect(() => {
    // add ify block here that ties to button press
    // document.body.click()
    renderWhiteCards();
    // renderWhiteCards();
  }, [whiteCard]);

  console.log(whiteCard);

  return <div className="flex w-full h-full flex-col bg-lukewarmGray-200">
    <iframe className="bg-lukewarmGray-200 w-full" src="https://lottie.host/embed/07bd7bac-9b50-4440-b5e1-38a7a9bcced9/oGrv9hk7Kj.json"></iframe>
    <div className="flex w-full justify-center">
      {/*<CSSTransition in={show} timeout={300} unmountOnExit classNames={"spectator-card-slide"}>*/}
      {/*  <WhiteKard card={whiteCard} onClick={() => {}} />*/}
      {/*</CSSTransition>*/}
      <div>
        {
          whiteCard &&
          <div className="spectator-card-animation border-b-4 h-auto border-black">
            <WhiteKard card={whiteCard} onClick={() => {}} />
          </div>
        }
        <button onClick={() => setWhiteCard(tempWhiteCards[0])}>click me to read the card</button>
      </div>
      {/*<button onClick={() => setShow(!show)}>Show</button>*/}
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