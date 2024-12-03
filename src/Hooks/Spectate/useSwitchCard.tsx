import { useCallback, useEffect, useState } from "react";
import { WhiteCard } from "Types/WhiteCard";
import { BlackCard } from "Types/BlackCard";
import { TimelineCollection } from "Utilities/TimelineCollection";
import { BaseTimeline } from "Utilities/BaseTimeline";
import { Card } from "Types/Card";

interface useSwitchCardProps {
    whiteCards: WhiteCard[][],
    blackCards: BlackCard[],
    timeout?: number;
}

interface useSwitchCardReturn {
    cards?: Card[] | null,
    timeLines?: TimelineCollection,
    start: () => void
}

const useSwitchCard = ({whiteCards = [], blackCards = [], timeout = 5000}: useSwitchCardProps): useSwitchCardReturn => {
    const [timeLines, setTimelines] = useState<TimelineCollection>();
    const [cards, setCards] = useState<Card[]|null|undefined>(null);

    const cardCallback = useCallback((data?: Card[] | null) => {
        setCards(data);
    }, []);

    useEffect(() => {
        if (timeLines) return;

        const collection = new TimelineCollection();

        const blackCardTimeline = new BaseTimeline<Card[]>([blackCards], 1000);
        blackCardTimeline.setOnIteratedCallback(cardCallback);
        collection.add(blackCardTimeline);

        const whiteCardTimeline = new BaseTimeline<Card[]>(whiteCards, timeout);
        whiteCardTimeline.setOnIteratedCallback(cardCallback);
        collection.add(whiteCardTimeline);

        setTimelines(collection);
        setCards(collection.currentCard);
    }, []);

    const start = useCallback(() => {
      if (!timeLines) return;

      timeLines.start();
    },[timeLines]);

    return {
        cards,
        timeLines,
        start
    }
}

export default useSwitchCard;