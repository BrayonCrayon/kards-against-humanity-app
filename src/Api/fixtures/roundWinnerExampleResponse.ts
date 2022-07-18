import { RoundWinnerResponse } from "../../Types/ResponseTypes";

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
    black_card: {
      id: 1234,
      pick: 2,
      text: "_ is what you tell cheap hookers when they leave _.",
      expansionId: 69,
    },
  },
};
