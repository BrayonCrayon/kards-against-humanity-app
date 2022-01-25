import { SubmittedCardsResponse } from "../../Types/ResponseTypes";

export const submittedCardsResponse: SubmittedCardsResponse = {
  data: [
    {
      submitted_cards: [
        {
          id: 76,
          text: "A little boy who won't shut the fuck up about dinosaurs.",
          expansion_id: 1,
          order: 2,
          selected: true,
        },
        {
          id: 3732,
          text: "Slapping a racist old lady.",
          expansion_id: 26,
          order: 1,
          selected: true,
        },
      ],
      user_id: 1,
    },
    {
      submitted_cards: [
        {
          id: 14182,
          text: "Staying off the fucking grass!",
          expansion_id: 137,
          order: 1,
          selected: true,
        },
        {
          id: 4866,
          text: "A car seat.",
          expansion_id: 73,
          order: 2,
          selected: true,
        },
      ],
      user_id: 2,
    },
    {
      submitted_cards: [
        {
          id: 16856,
          text: "Tampon taxes.",
          expansion_id: 152,
          order: 1,
          selected: true,
        },
        {
          id: 11786,
          text: "September 11th.",
          expansion_id: 123,
          order: 2,
          selected: true,
        },
      ],
      user_id: 3,
    },
  ],
};
