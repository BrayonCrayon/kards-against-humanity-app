import React, { useCallback, useEffect, useMemo } from "react";
import { useGame } from "State/Game/useGame";
import { useSpectate } from "State/Spectate/useSpectate";
import { Stage } from "State/Spectate/SpectateState";
import SpectatePlayerList from "Components/Spectation/SpectatePlayerList";
import { useParams } from "react-router-dom";
import { useAuth } from "State/Auth/useAuth";
import { usePlayers } from "State/Players/usePlayers";
import { ChangeStage } from "State/Spectate/SpectateActions";
import useFetchSpectatorState from "Hooks/Game/State/useFetchSpectatorState";
import useSubmittedCards from "Hooks/Game/State/useSubmittedCards";
import { userFactory } from "../Tests/Factories/UserFactory";
import { blackCardFactory } from "../Tests/Factories/BlackCardFactory";
import { SetPlayersAction } from "../State/Players/PlayersActions";
import { User } from "../Types/User";
import { gameFactory } from "../Tests/Factories/GameFactory";
import { Game } from "../Types/Game";
import { SetBlackCardAction, SetGameAction } from "../State/Game/GameActions";
import { BlackCard } from "../Types/BlackCard";
import moment from "moment";
import { BlackKard, CardSize } from "Components/BlackKard";
import Timer from "Components/Atoms/Timer";
import CardResponseDisplay from "Components/Spectation/CardResponseDisplay";
import ReviewRoom from "Pages/ReviewRoom";
import { submittedCardFactory } from "Tests/Factories/SubmittedCardFactory";

export const SpectatorPage: React.FC = () => {
    const {state: {players}, dispatch: playerDispatch} = usePlayers();
    const {state: {auth}} = useAuth();
    const {state: {game, blackCard}, dispatch: gameDispatch} = useGame();
    const {state: {stage}, dispatch} = useSpectate();
    const {id} = useParams<{ id: string }>();

    // TODO: remove this when you want real data
    // const testCard = blackCardFactory({
    //     text: "So this family circus act comes in to see a talent agent in Hoboken, and the agent askes what they do. The father of the act jumps up and starts to furiously beat off into a towel while his wife whips her hair back and forth to that famous song - originally sung by one of Will Smith's kids, \"I Whipe My Hair Bcak And Forth\" - which her twin daughters are singing while they braid each other's pubes, all while the twin BROTHERS are creating a real-estate bubble by purchasing houses and flipping them for needless profit, and all THIS is happening while the grandmother is peeing into a Smuckers jar and slapping her ass. The whole thing ends with the family spitting into each other's assholes. The talent agent can't believe it. He looks at the sweaty father who has just spit into his mother's asshole and says. \"WOW. This is great. Whaddya call yourselves?\" And the guy looks at him and says, \"We're _.\""
    // });


    useEffect(() => {
        // TODO: This is a temp setup
        // dispatch(new ChangeStage(Stage.DISPLAY_BLACK_CARD))
        dispatch(new ChangeStage(Stage.DISPLAY_SUBMISSIONS))

        const players: User[] = Array.from({length: 10}).map((_, idx) => userFactory({
          hasSubmittedWhiteCards: idx % 2 !== 0,
        }))
        playerDispatch(new SetPlayersAction(players))

        const game: Game = gameFactory({
            judgeId: players[0].id,
            selectionTimer: 60,
            selectionEndsAt: moment().add(60, "seconds").unix()
        })
        // const card: BlackCard = blackCardFactory({
        //   text: "So this family circus act comes in to see a talent agent in Hoboken, and the agent askes what they do. The father of the act jumps up and starts to furiously beat off into a towel while his wife whips her hair back and forth to that famous song - originally sung by one of Will Smith's kids, \"I Whipe My Hair Bcak And Forth\" - which her twin daughters are singing while they braid each other's pubes, all while the twin BROTHERS are creating a real-estate bubble by purchasing houses and flipping them for needless profit, and all THIS is happening while the grandmother is peeing into a Smuckers jar and slapping her ass. The whole thing ends with the family spitting into each other's assholes. The talent agent can't believe it. He looks at the sweaty father who has just spit into his mother's asshole and says. \"WOW. This is great. Whaddya call yourselves?\" And the guy looks at him and says, \"We're _.\""
        // })
        const card: BlackCard = blackCardFactory()
        gameDispatch(new SetBlackCardAction(card))
        gameDispatch(new SetGameAction(game))
        getSubmittedCards("a");
    }, []);

    const fetchSpectatorState = useFetchSpectatorState();
    // const listenOnEvents = useListenOnEvents();
    const {whiteCards, getSubmittedCards} = useSubmittedCards();

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
            <div className="flex w-3/4">
                <div className="flex flex-col h-full w-full">
                    <div className="flex flex-col flex-grow justify-center w-full items-center">
                        <BlackKard card={blackCard} size={CardSize.LARGE}/>
                    </div>
                    {
                        !!game.selectionEndsAt && !!game.selectionTimer &&
                        <Timer end={game.selectionEndsAt} />
                    }
                </div>
            </div>
        }
        {
            stage === Stage.DISPLAY_SUBMISSIONS &&
            <div className="flex w-3/4">
              <div className="flex flex-col h-full w-full">
                <div className="flex flex-col flex-grow justify-center w-full items-center">
                  <CardResponseDisplay showAnswers={true} dataTestId="submissions-display" cards={whiteCards} />
                </div>
              </div>
            </div>
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
        {/*{*/}
        {/*    stage === Stage.DISPLAY_VOTES &&*/}
        {/*    <div data-testid="votes-display"/>*/}
        {/*}*/}
        {/*{ haveAllPlayersSubmitted*/}
        {/*  ? <DisplaySubmittedCard cards={submittedCards} />*/}
        {/*  : null*/}
        {/*}*/}

        <SpectatePlayerList players={players} judgeId={game.judgeId}/>
    </div>
}