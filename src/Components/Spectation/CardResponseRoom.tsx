import React, { FC, useCallback, useEffect, useMemo } from "react";
import useSwitchCard from "@/Hooks/Spectate/useSwitchCard";
import { isEmpty } from "lodash";
import { WhiteCard } from "@/Types/WhiteCard";
import { WhiteKard } from "@/Components/WhiteKard";
import { CardType, ICard } from "@/Types/Card";
import { useGame } from "@/State/Game/useGame";
import { BlackKard } from "@/Components/BlackKard";
import { BlackCard } from "@/Types/BlackCard";
import { useSpectate } from "@/State/Spectate/useSpectate";
import { ChangeStage } from "@/State/Spectate/SpectateActions";
import { Stage } from "@/State/Spectate/SpectateState";

interface CardResponseRoomProps {
  showAnswers: boolean;
  cards?: WhiteCard[][];
  dataTestId?: string;
}

const CardResponseRoom: FC<CardResponseRoomProps> = ({ showAnswers, cards = [], dataTestId = "" }) => {
  const {
    state: { blackCard },
  } = useGame();
  const { dispatch } = useSpectate();

  const onFinished = useCallback(() => {
    dispatch(new ChangeStage(Stage.DISPLAY_WAITING_ROOM));
  }, []);

  const {
    start,
    timeLines,
    cards: cardsToDisplay,
  } = useSwitchCard({
    whiteCards: cards,
    blackCards: [blackCard],
    timeout: 5000,
    onFinished,
  });

  const hasCardsToDisplay = useMemo(() => {
    return !!cardsToDisplay && cardsToDisplay.length > 0;
  }, [cardsToDisplay]);

  const isWhiteCard = useCallback((card: ICard) => {
    console.log(card);
    return card.getType() === CardType.White;
  }, []);

  useEffect(() => {
    if (!showAnswers || !timeLines || isEmpty(timeLines.items)) {
      return;
    }
    start();
  }, [showAnswers, timeLines]);

  return (
    <div className="h-auto flex flex-wrap justify-center max-w-full gap-2" data-testid={dataTestId}>
      {showAnswers &&
        hasCardsToDisplay &&
        cardsToDisplay!.map((card) =>
          isWhiteCard(card) ? (
            <WhiteKard
              key={(card as WhiteCard).id}
              card={card as WhiteCard}
              hidePlayButton
              className="w-64 animate-slide-in-and-slide-out"
              onClick={() => {}}
            />
          ) : (
            <BlackKard
              key={(card as BlackCard).id}
              card={card as BlackCard}
              hidePlayButton
              className="animate-slide-in-and-slide-out"
            />
          ),
        )}
    </div>
  );
};

export default CardResponseRoom;
