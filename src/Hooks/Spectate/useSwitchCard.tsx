import {useCallback, useEffect, useState} from "react";
import {WhiteCard} from "Types/WhiteCard";
import EventEmitter from "eventemitter3";

// TODO: Write tests for this hook
// useSwitchCardProps
type UseSwitchCard = ({ cards, timeout }: { cards: WhiteCard[], timeout: number }) => { whiteCard: WhiteCard | null }
const useSwitchCard: UseSwitchCard = ({cards, timeout= 5000}) => {

    const [whiteCards, setWhiteCards] = useState(cards);
    const [whiteCard, setWhiteCard] = useState<null|WhiteCard>(cards.length ? cards[0] : null);
    const [switchCardTimeout, setSwitchCardTimeout] = useState<NodeJS.Timeout|null>(null);
    const [events, setEvents] = useState(new EventEmitter());

    const switchCard = useCallback(() => {
        if(whiteCard === null) {
            setWhiteCard(whiteCards[0]);
            switchCardCallback();
            return;
        }

        const playedCardIdx = whiteCards.findIndex((card) => card.id === whiteCard.id);

        if ((playedCardIdx + 1) > (whiteCards.length - 1)) {
            setWhiteCard(null);
            setSwitchCardTimeout(null);
            return;
        }

        switchCardCallback();
        setWhiteCard(whiteCards[playedCardIdx + 1]);
    }, [whiteCard]);

    useEffect(() => {
        if (events.listenerCount("switchCard") > 0) {
            events.removeAllListeners();
        }

        events.on("switchCard", switchCard, this);
    }, [events, whiteCard]);

    const switchCardCallback = useCallback(() => {
        const timeoutId = setTimeout(() => {
            events.emit("switchCard");
            if (switchCardTimeout) clearTimeout(switchCardTimeout);
        }, 5000)

        setSwitchCardTimeout(timeoutId)
    }, [switchCardTimeout]);

    useEffect(() => {
        if(!switchCardTimeout) {switchCardCallback();}
    }, []);

    return {
        whiteCard
    }
}

export default useSwitchCard;