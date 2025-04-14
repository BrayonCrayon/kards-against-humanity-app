import { RoundWinner } from "@/Types/ResponseTypes";
import { submittedCardFactory } from "@/Tests/Factories/SubmittedCardFactory";
import { blackCardFactory } from "@/Tests/Factories/BlackCardFactory";
import { randNumber } from "@ngneat/falso";


export const RoundWinnerFactory = (overrides: Partial<RoundWinner> = {}): RoundWinner => {
  const black_card = blackCardFactory(overrides.black_card)
  return {
    user_id: randNumber(),
    submitted_cards: Array.from({ length: black_card.pick }).map(() => submittedCardFactory()),
    black_card,
    ...overrides
  };
}

export default RoundWinnerFactory;