import React, { FC, useCallback, useEffect, useMemo } from "react";
import useSwitchCard from "Hooks/Spectate/useSwitchCard";
import { isEmpty } from "lodash";
import { WhiteCard } from "Types/WhiteCard";
import { WhiteKard } from "Components/WhiteKard";
import { Card } from "Types/Card";
import { useGame } from "State/Game/useGame";
import { BlackKard } from "Components/BlackKard";
import { BlackCard } from "Types/BlackCard";


interface CardResponseDisplayProps {
  showAnswers: boolean;
  cards?: WhiteCard[][];
  dataTestId?: string;
}

const CardResponseDisplay: FC<CardResponseDisplayProps> = ({ showAnswers, cards = [], dataTestId = "" }) => {

  const { state: { blackCard } } = useGame()

  const { start, timeLines, cards: cardsToDisplay  } = useSwitchCard({
    whiteCards: cards, blackCards: [], timeout: 5000
  });

  const hasCardsToDisplay = useMemo(() => {
    return !!cardsToDisplay && cardsToDisplay.length > 0;
  }, [cardsToDisplay])

  const isWhiteCard = useCallback((card: Card) => {
    return card.constructor.name === "WhiteCard";
  }, [])

  useEffect(() => {
    if (!showAnswers || (!timeLines || isEmpty(timeLines.items))) {
      return;
    }
    start();
  }, [showAnswers, timeLines]);

  return <div className="h-auto flex flex-wrap justify-center max-w-full gap-2" data-testid={dataTestId}>
    {
      showAnswers && hasCardsToDisplay &&
      cardsToDisplay!.map((card) => (
          isWhiteCard(card)
            ? <WhiteKard key={(card as WhiteCard).id} card={card as WhiteCard} className="w-64 animate-slide-in-and-slide-out" onClick={() => {}} />
            : <BlackKard key={(card as BlackCard).id} card={card as BlackCard} className="animate-slide-in-and-slide-out"/>
      ))
    }
  </div>;
};

export default CardResponseDisplay;