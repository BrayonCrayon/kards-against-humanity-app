import { Game } from "../../Types/Game";
import { randFullName, randNumber, randUuid, randWord } from "@ngneat/falso";

export const gameFactory = (overrides?: Partial<Game>): Game => {
  return {
    name: randFullName(),
    code: randWord(),
    id: randUuid(),
    judgeId: randNumber(),
    redrawLimit: 2,
    selectionTimer: null,
    judgeTimer: null,
  };
};
