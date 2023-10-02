import {randNumber, randText} from "@ngneat/falso";
import {IWhiteCard} from "Types/WhiteCard";


export const whiteCardFactory = (overrides?: Partial<IWhiteCard>): IWhiteCard => {
    return {
        id: randNumber({ min: 1 }),
        text: randText(),
        expansionId: 0,
        order: 0,
        selected: false,
        ...overrides
    };
};