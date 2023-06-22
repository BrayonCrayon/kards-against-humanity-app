import {User} from "Types/User";
import {randFullName, randNumber} from "@ngneat/falso";

export const userFactory = (overrides?: Partial<User>): User => {
    return {
        id: randNumber({ min: 1 }),
        name: randFullName(),
        score: randNumber({ min: 0, max: 10 }),
        hasSubmittedWhiteCards: false,
        redrawCount: 0,
        ...overrides
    };
};