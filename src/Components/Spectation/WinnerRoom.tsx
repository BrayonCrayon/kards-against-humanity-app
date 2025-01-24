import React, { FC, useEffect, useState } from "react";
import { User } from "Types/User";
import { WhiteCard } from "Types/WhiteCard";
import DrumIcon from "Components/Icons/DrumIcon";
import { WhiteKard } from "Components/WhiteKard";
import { useSpectate } from "State/Spectate/useSpectate";
import { ChangeStage } from "State/Spectate/SpectateActions";
import { Stage } from "State/Spectate/SpectateState";

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

  const [showDrum, setShowDrum] = useState(true);

  useEffect(() => {
    const timeout = setInterval(() => {
      setShowDrum(false)
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
      dispatch(new ChangeStage(Stage.DISPLAY_BLACK_CARD))
    }, 10000);

    return () => {
      clearInterval(timeout);
    }
  }, [showDrum]);


  // return   <DotLottieReact
  //   src="public/lottie/confetti.lottie"
  //   loop
  //   autoplay
  // />

  return <div className="flex justify-center items-center w-full">
    {
      showDrum &&
        <DrumIcon className="w-1/2"  dataTestId="drum-icon" />
    }
    {
      !showDrum &&
      <div className="p-8 h-full flex flex-col items-center gap-10">
        <h1 data-testid={`user-${player.id}`} className="text-4xl text-center p-4 bg-white w-fit rounded">The winner is: {player.name}</h1>
        <div className="flex flex-wrap gap-2 justify-center">
          {
            cards.map(card =>
              <WhiteKard key={card.id} className="w-64" card={card} onClick={() => {}} />
            )
          }
        </div>
      </div>
    }
  </div>
}

export default WinnerRoom;