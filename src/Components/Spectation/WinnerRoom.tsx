import React, { FC, useState } from "react";
import { User } from "Types/User";
import { WhiteCard } from "Types/WhiteCard";
import DrumIcon from "Components/Icons/DrumIcon";
import { WhiteKard } from "Components/WhiteKard";
import { useSpectate } from "State/Spectate/useSpectate";
import ReactConfetti from "react-confetti";

interface WinnerRoomProps {
  player: User
  cards: WhiteCard[]
}

const WinnerRoom: FC<WinnerRoomProps> = (props) => {
  const {
    player,
    cards
  } = props;
  const { dispatch } = useSpectate();
  const [showDrum, setShowDrum] = useState(false);


  // useEffect(() => {
  //   const timeout = setInterval(() => {
  //     setShowDrum(false)
  //   }, 5000);
  //
  //   return () => {
  //     clearInterval(timeout);
  //   }
  // }, []);
  //
  // useEffect(() => {
  //   if (showDrum) {
  //     return
  //   }
  //
  //   const timeout = setInterval(() => {
  //     dispatch(new ChangeStage(Stage.DISPLAY_BLACK_CARD))
  //   }, 10000);
  //
  //   return () => {
  //     clearInterval(timeout);
  //   }
  // }, [showDrum]);

  return <div className="flex justify-center items-center w-full">
    {
      showDrum &&
      <DrumIcon className="w-1/2" dataTestId="drum-icon" />
    }
    {
      !showDrum &&
      <div className="relative p-8 h-full flex flex-col items-center gap-10">
        <h1 data-testid={`user-${player.id}`} className="text-4xl text-center p-4 bg-white w-fit rounded">The winner is: {player.name}</h1>
        <div className="flex flex-wrap gap-2 justify-center">
          {
            cards.map(card =>
              <WhiteKard key={card.id} className="w-64" card={card} onClick={() => {}} />
            )
          }
        </div>
        {/* will appear at the center of the parent div*/}
        <div className="absolute top-0 left-0 w-full">
          <ReactConfetti width={window.innerWidth} height={window.innerHeight} numberOfPieces={2000} recycle={false}  />
        </div>
      </div>
    }
  </div>
}

export default WinnerRoom;