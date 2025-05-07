import { RoundWinnerResponse } from "@/Types/ResponseTypes";
import { BlackCard } from "@/Types/BlackCard";

export const roundWinnerExampleResponse: RoundWinnerResponse = {
  data: {
    user_id: 1,
    submitted_cards: [
      {
        id: 76,
        text: "A little boy who won't shut the fuck up about dinosaurs.",
        expansionId: 1,
        order: 2,
      },
      {
        id: 3732,
        text: "Slapping a racist old lady.",
        expansionId: 26,
        order: 1,
      },
    ],
    black_card: new BlackCard(1234, "_ is what you tell cheap hookers when they leave _.", 2, 69),
  },
};
