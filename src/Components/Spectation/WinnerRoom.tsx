import React, { FC, useEffect, useState } from "react";
import { User } from "@/Types/User";
import { WhiteCard } from "@/Types/WhiteCard";
import { BlackKard } from "@/Components/BlackKard";
import { blackCardFactory } from "@/Tests/Factories/BlackCardFactory";
import { PlayerSubmittedCard } from "@/Types/ResponseTypes";
import { CSSTransition, TransitionGroup } from "react-transition-group";
import { WhiteKard } from "@/Components/WhiteKard";

interface WinnerRoomProps {
  winner: User
  winnerCards: WhiteCard[]
  submissions: PlayerSubmittedCard[]
  onEnd?: () => void
  onShowWinner?: () => void
}

const WinnerRoom: FC<WinnerRoomProps> = (props) => {
  const {
    winner,
    winnerCards,
    submissions,
    onEnd = () => {},
    onShowWinner = () => {}
  } = props;
  const [showDrum, setShowDrum] = useState(true);
  const [submittedCards, setSubmittedCards] = useState([submissions[0]]);


  useEffect(() => {
    const timeout = setInterval(() => {
      setShowDrum(false)
      onShowWinner()
    }, 5000);

    return () => {
      clearInterval(timeout);
    }
  }, []);

  useEffect(() => {
    if (showDrum) {
      return
    }

    const timeout = setInterval(() => {
      onEnd()
    }, 10000);

    return () => {
      clearInterval(timeout);
    }
  }, [showDrum]);

  return <div className="flex flex-col justify-center items-center w-full" data-testid="display-winner">
    <div className="p-8">
      <BlackKard card={blackCardFactory()} />
    </div>
    <div className="flex flex-row justify-center items-center w-full">
    <TransitionGroup>
      {
        submissions.map(({ submitted_cards, user_id }) => (
            submitted_cards.map(card => (
              <CSSTransition key={card.id} timeout={10000} classNames="item">
                <div>
                  <WhiteKard hidePlayButton className="w-64" card={card} onClick={() => {}} />
                </div>
              </CSSTransition>
            ))
        ))
      }
    </TransitionGroup>
    </div>
    {/*<div className="p-8 h-full flex flex-col items-center gap-10">*/}
    {/*    <h1 data-testid={`user-${player.id}`} className="text-4xl text-center p-4 bg-white w-fit rounded-sm">The winner is: {player.name}</h1>*/}
    {/*    <div className="flex flex-wrap gap-2 justify-center">*/}
    {/*      {*/}
    {/*        cards.map(card =>*/}
    {/*          <WhiteKard key={card.id} hidePlayButton className="w-64" card={card} onClick={() => {}} />*/}
    {/*        )*/}
    {/*      }*/}
    {/*    </div>*/}
    {/*    <div className="absolute top-0 left-0 w-full">*/}
    {/*      <ReactConfetti width={window.innerWidth} height={window.innerHeight} numberOfPieces={2000} recycle={false}  />*/}
    {/*    </div>*/}
    {/*  </div>*/}
  </div>
}

export default WinnerRoom;