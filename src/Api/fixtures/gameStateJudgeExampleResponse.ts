import { gameFactory } from "@/Tests/Factories/GameFactory";

export const gameStateJudgeExampleResponse = {
  data: {
    game: gameFactory({ judgeId: 1 }),
    hasSubmittedWhiteCards: false,
    submittedWhiteCardIds: [],
    users: [
      {
        id: 1,
        name: "brady",
        score: 0,
        hasSubmittedWhiteCards: false,
        redrawCount: 0,
      },
      {
        id: 2,
        name: "Rick",
        score: 0,
        hasSubmittedWhiteCards: false,
        redrawCount: 0,
      },
      {
        id: 3,
        name: "Morty",
        score: 0,
        hasSubmittedWhiteCards: false,
        redrawCount: 0,
      },
    ],
    currentUser: {
      id: 1,
      name: "brady",
      score: 0,
      hasSubmittedWhiteCards: false,
      redrawCount: 0,
    },
    blackCard: {
      id: 4624,
      pick: 1,
      text: "_ is the key to recovery.",
      expansionId: 1,
    },
    hand: [
      {
        id: 76,
        text: "A little boy who won't shut the fuck up about dinosaurs.",
        expansionId: 1,
        selected: false,
        order: 0,
      },
      {
        id: 3732,
        text: "Slapping a racist old lady.",
        expansionId: 26,
        selected: false,
        order: 0,
      },
      {
        id: 14182,
        text: "Staying off the fucking grass!",
        expansionId: 137,
        selected: false,
        order: 0,
      },
      {
        id: 4866,
        text: "A car seat.",
        expansionId: 73,
        selected: false,
        order: 0,
      },
      {
        id: 16856,
        text: "Tampon taxes.",
        expansionId: 152,
        selected: false,
        order: 0,
      },
      {
        id: 11786,
        text: "September 11th.",
        expansionId: 123,
        selected: false,
        order: 0,
      },
      {
        id: 8197,
        text: "The biggest booty shakin' float at Caribana",
        expansionId: 94,
        selected: false,
        order: 0,
      },
    ],
  },
};
