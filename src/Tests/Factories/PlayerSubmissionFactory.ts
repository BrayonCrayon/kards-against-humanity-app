import { PlayerSubmittedCard } from "Types/ResponseTypes";
import { randNumber } from "@ngneat/falso";
import { submittedCardFactory } from "Tests/Factories/SubmittedCardFactory";


export const playerSubmissionFactory = (overrides: Partial<PlayerSubmittedCard> = {}) => {
  return {
    user_id: randNumber(),
    submitted_cards: Array.from({ length: 2 }).map((_) => submittedCardFactory()),
    ...overrides,
  }
}

export default playerSubmissionFactory;