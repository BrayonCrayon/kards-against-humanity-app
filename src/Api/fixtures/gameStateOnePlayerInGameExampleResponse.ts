import { gameFactory } from "@/Tests/Factories/GameFactory";

export const gameStateOnePlayerInGameExampleResponse = {
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
        createdAt: "2021-10-27T19:33:43.000000Z",
        updatedAt: "2021-10-27T19:33:43.000000Z",
      },
    ],
    currentUser: {
      id: 1,
      name: "brady",
      score: 0,
      hasSubmittedWhiteCards: false,
      redrawCount: 0,
      createdAt: "2021-10-27T19:33:43.000000Z",
      updatedAt: "2021-10-27T19:33:43.000000Z",
    },
    blackCard: {
      id: 4624,
      pick: 1,
      text: "_ is the key to recovery.",
    },
    hand: [
      {
        id: 76,
        text: "A little boy who won't shut the fuck up about dinosaurs.",
        expansionId: 1,
        order: 0,
        selected: false,
      },
      {
        id: 3732,
        text: "Slapping a racist old lady.",
        expansionId: 26,
        order: 0,
        selected: false,
      },
      {
        id: 14182,
        text: "Staying off the fucking grass!",
        expansionId: 137,
        order: 0,
        selected: false,
      },
      {
        id: 4866,
        text: "A car seat.",
        expansionId: 73,
        order: 0,
        selected: false,
      },
      {
        id: 16856,
        text: "Tampon taxes.",
        expansionId: 152,
        order: 0,
        selected: false,
      },
      {
        id: 11786,
        text: "September 11th.",
        expansionId: 123,
        order: 0,
        selected: false,
      },
      {
        id: 8197,
        text: "The biggest booty shakin' float at Caribana",
        expansionId: 94,
        order: 0,
        selected: false,
      },
    ],
  },
};
