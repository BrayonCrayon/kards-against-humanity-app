import React, { FC, useEffect } from "react";
import { WhiteCard } from "Types/WhiteCard";
import { WhiteKard } from "Components/WhiteKard";

interface TestingComponentProps {
  whiteCards: WhiteCard[]
}
export const TestingComponent: FC<TestingComponentProps> = (props) => {

  const { whiteCards } = props

  useEffect(() => {

  }, []);

  return <div className="h-auto flex flex-wrap justify-center max-w-full gap-2">
    {
      whiteCards && whiteCards.map(card =>
        <WhiteKard key={card.id} card={card} className="w-64 spectator-card-animation-slide-out" onClick={() => {}} />
      )
    }
  </div>


}

export default TestingComponent;