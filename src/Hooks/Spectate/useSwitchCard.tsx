import {useState} from "react";
import {WhiteCard} from "Types/WhiteCard";

// TODO: Write tests for this hook
const useSwitchCard = () => {

    const [whiteCard, setWhiteCard] = useState<null|WhiteCard>(null)

    return {
        whiteCard,
        setWhiteCard
    }
}

export default useSwitchCard;