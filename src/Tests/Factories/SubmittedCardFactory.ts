import { randNumber, randText } from "@ngneat/falso";
import { SubmittedCard } from "Types/SubmittedCard";


export const submittedCardFactory = (overrides?: Partial<SubmittedCard>): SubmittedCard => {
  return new SubmittedCard({
    id: randNumber(),
    text: randText(),
    expansionId: randNumber(),
    order: randNumber({ min: 0, max: 1 }),
    ...overrides
  });
};
