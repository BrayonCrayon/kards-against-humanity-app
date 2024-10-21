import React, { FC, useCallback, useEffect, useMemo, useState } from "react";
import useSwitchCard from "Hooks/Spectate/useSwitchCard";
import { isEmpty } from "lodash";
import { WhiteCard } from "Types/WhiteCard";
import { WhiteKard } from "Components/WhiteKard";
import { blackCardFactory } from "Tests/Factories/BlackCardFactory";
import { BlackKard } from "Components/BlackKard";
import { BlackCard } from "Types/BlackCard";
import { Card } from "Types/Card";


interface CardResponseDisplayProps {
  showAnswers: boolean;
  cards?: WhiteCard[][];
  dataTestId?: string;
}

const CardResponseDisplay: FC<CardResponseDisplayProps> = ({ showAnswers, cards = [], dataTestId = "" }) => {

  const [tempBlackCards] = useState([
    blackCardFactory()
  ])

  const { start, timeLines, cards: cardsToDisplay  } = useSwitchCard({
    whiteCards: cards, blackCards: tempBlackCards
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

  return <div className="border-b-4 h-auto border-black" data-testid={dataTestId}>
    {
      showAnswers && hasCardsToDisplay &&
      cardsToDisplay!.map((card) => (
          isWhiteCard(card)
            ? <WhiteKard key={(card as WhiteCard).id} card={card as WhiteCard} onClick={() => {}} />
            : <BlackKard key={(card as BlackCard).id} card={card as BlackCard} />
      ))
    }
  </div>;
};

export default CardResponseDisplay;