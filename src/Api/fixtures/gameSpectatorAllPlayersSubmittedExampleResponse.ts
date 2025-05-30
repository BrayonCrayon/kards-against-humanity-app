import { gameFactory } from "@/Tests/Factories/GameFactory";

export const gameSpectatorAllPlayersSubmittedExampleResponse = {
  data: {
    game: gameFactory({ judgeId: 1 }),
    user: {
      id: 5,
      name: "SpectatorX",
      score: 0,
      redrawCount: 0,
      hasSubmittedWhiteCards: false,
    },
    users: [
      {
        id: 1,
        name: "brady",
        whiteCards: [],
        score: 0,
        redrawCount: 0,
        hasSubmittedWhiteCards: false,
      },
      {
        id: 2,
        name: "Rick",
        whiteCards: [],
        score: 0,
        redrawCount: 0,
        hasSubmittedWhiteCards: true,
      },
      {
        id: 3,
        name: "Morty",
        whiteCards: [],
        score: 0,
        redrawCount: 0,
        hasSubmittedWhiteCards: true,
      },
      {
        id: 4,
        name: "Tommis",
        score: 23,
        redrawCount: 0,
        hasSubmittedWhiteCards: true,
      },
    ],
    blackCard: {
      id: 4624,
      pick: 1,
      text: "_ is the key to recovery.",
      expansionId: 1,
    },
  },
};
