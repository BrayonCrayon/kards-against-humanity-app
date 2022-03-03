import { RoundWinnerResponse } from "../../Types/ResponseTypes";

export const roundWinnerExampleResponse: RoundWinnerResponse = {
  data: {
    user_id: 1,
    submitted_cards: [
      {
        id: 76,
        text: "A little boy who won't shut the fuck up about dinosaurs.",
        expansion_id: 1,
        order: 2,
      },
      {
        id: 3732,
        text: "Slapping a racist old lady.",
        expansion_id: 26,
        order: 1,
      },
    ],
    blackCard: {
      id: 1234,
      pick: 2,
      text: "_____ is what you tell cheap hookers.",
      expansion_id: 69,
    },
  },
};
