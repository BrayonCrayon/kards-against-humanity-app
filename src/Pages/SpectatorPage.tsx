import React, {useCallback, useEffect, useMemo} from "react";
import {BlackKard} from "Components/BlackKard";
import {useGame} from "State/Game/useGame";
import {useSpectate} from "State/Spectate/useSpectate";
import {Stage} from "State/Spectate/SpectateState";
import CardResponseDisplay from "Components/Spectation/CardResponseDisplay";
import SpectatePlayerList from "Components/Spectation/SpectatePlayerList";
import {useParams} from "react-router-dom";
import {useAuth} from "State/Auth/useAuth";
import {usePlayers} from "State/Players/usePlayers";
import {ChangeStage} from "State/Spectate/SpectateActions";
import useFetchSpectatorState from "Hooks/Game/State/useFetchSpectatorState";
import useSubmittedCards from "Hooks/Game/State/useSubmittedCards";
import ReviewRoom from "./ReviewRoom";
import {submittedCardFactory} from "../Tests/Factories/SubmittedCardFactory";
import {userFactory} from "../Tests/Factories/UserFactory";

export const SpectatorPage: React.FC = () => {
    const {state: {players}} = usePlayers();
    const {state: {auth}} = useAuth();
    const {state: {game, blackCard}} = useGame();
    const {state: {stage}, dispatch} = useSpectate();
    const {id} = useParams<{ id: string }>();

    useEffect(() => {
        dispatch(new ChangeStage(Stage.DISPLAY_WAITING_ROOM))
    }, []);

    const fetchSpectatorState = useFetchSpectatorState();
    // const listenOnEvents = useListenOnEvents();
    const {submittedCards, getSubmittedCards} = useSubmittedCards();

    const haveAllPlayersSubmitted = useMemo(() => {
      return players.filter(user => user.id !== game.judgeId)
        .every(user => user.hasSubmittedWhiteCards);
    }, [players, game.judgeId]);

    const setup = useCallback(async () => {
      await fetchSpectatorState(id ?? "");
      // await listenOnEvents(id ?? "", auth.id); // TODO: Bring this back when ready to test locally
    }, [id]);

    useEffect(() => {
      if (game.id) {
        // listenOnEvents(game.id, auth.id); // TODO: Bring this back when ready to test locally
        return;
      }

      setup();
    }, []);

    useEffect(() => {
      if (game.id && haveAllPlayersSubmitted) {
        getSubmittedCards(game.id);
      }
    },[game, haveAllPlayersSubmitted]);

// TODO: Determine when to show the answers and feed that threw the CardResponseDisplay
    // TODO: Move the blackKard to the left hand side of the page when showing answers

// TODO: After all answers have been shown, display the answers in never ending scroll listing animation

// TODO: Display Winner when winner is selected

    return <div className="flex w-full h-full bg-lukewarmGray-200">
        {
            stage === Stage.DISPLAY_BLACK_CARD &&
            <div className="flex flex-grow justify-around">
                <BlackKard card={blackCard}/>
            </div>
        }
        {
            stage === Stage.DISPLAY_SUBMISSIONS &&
            <CardResponseDisplay showAnswers={false} dataTestId="submissions-display"/>
            // <iframe className="bg-lukewarmGray-200 w-full" src="https://lottie.host/embed/07bd7bac-9b50-4440-b5e1-38a7a9bcced9/oGrv9hk7Kj.json"></iframe>
        }
        {
            stage === Stage.DISPLAY_WAITING_ROOM &&
            <ReviewRoom blackCard={blackCard} submissions={Array.from({ length: 4 })
                .map(() => {
                    return {
                        user_id: userFactory().id,
                        submitted_cards: Array.from({ length: 2 }).map(() => submittedCardFactory())
                    }
                })} />
        }
        {
            stage === Stage.DISPLAY_VOTES &&
            <div data-testid="votes-display"/>
        }
        {/*{ haveAllPlayersSubmitted*/}
        {/*  ? <DisplaySubmittedCard cards={submittedCards} />*/}
        {/*  : null*/}
        {/*}*/}
        <SpectatePlayerList players={players} judgeId={game.judgeId}/>
    </div>
}