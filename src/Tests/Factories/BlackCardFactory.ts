import {randNumber, randText} from "@ngneat/falso";
import {BlackCard} from "Types/BlackCard";

export const blackCardFactory = (overrides?: Partial<BlackCard>): BlackCard => {
    return {
        id: randNumber({ min: 1 }),
        text: randText(),
        pick: randNumber({ min: 1, max: 3 }),
        expansionId: randNumber({ min: 1, max: 100 }),
        ...overrides
    };
};