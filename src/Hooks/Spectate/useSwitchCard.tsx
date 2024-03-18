import {useCallback, useEffect, useState} from "react";
import {WhiteCard} from "Types/WhiteCard";
import EventEmitter from "eventemitter3";
import {BlackCard} from "Types/BlackCard";

type Card = WhiteCard | BlackCard;
type UseSwitchCard = ({ initialCards, timeout }: { initialCards: Card[], timeout?: number }) => { card: Card | null }
const useSwitchCard: UseSwitchCard = ({initialCards, timeout= 5000}) => {

    const [cards] = useState(initialCards);
    const [card, setCard] = useState<null|Card>(initialCards?.length ? initialCards[0] : null);
    const [switchCardTimeout, setSwitchCardTimeout] = useState<NodeJS.Timeout|null>(null);
    const [events] = useState(new EventEmitter());

    const switchCard = useCallback(() => {
        if(card === null) {
            setCard(cards[0]);
            switchCardCallback();
            return;
        }

        const playedCardIdx = cards.findIndex((item) => item.id === card.id);

        if ((playedCardIdx + 1) > (cards.length - 1)) {
            setCard(null);
            setSwitchCardTimeout(null);
            return;
        }

        switchCardCallback();
        setCard(cards[playedCardIdx + 1]);
    }, [card]);

    useEffect(() => {
        if (events.listenerCount("switchCard") > 0) {
            events.removeAllListeners();
        }

        events.on("switchCard", switchCard, this);
    }, [events, card]);

    const switchCardCallback = useCallback(() => {
        const timeoutId = setTimeout(() => {
            events.emit("switchCard");
            if (switchCardTimeout) clearTimeout(switchCardTimeout);
        }, timeout)

        setSwitchCardTimeout(timeoutId)
    }, [switchCardTimeout]);

    useEffect(() => {
        if(!switchCardTimeout) {switchCardCallback();}
    }, []);

    return {
        card
    }
}

export default useSwitchCard;