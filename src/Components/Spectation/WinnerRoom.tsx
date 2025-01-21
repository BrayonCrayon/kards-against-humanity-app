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


  return <div>
    {
      showDrum &&
        <DrumIcon dataTestId="drum-icon" />
    }
    {
      !showDrum &&
      <div className="bg-white p-8 shadow-md border-2 rounded flex flex-col justify-center">
        <h1 data-testid={`user-${player.id}`} className="text-4xl text-center pb-4">The winner is: {player.name}</h1>
        <div>hello</div>
        {
          cards.map(card =>
            <WhiteKard key={card.id} card={card} onClick={() => {}} />
          )
        }
      </div>
    }
  </div>
}

export default WinnerRoom;