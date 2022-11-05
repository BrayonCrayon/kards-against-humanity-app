import { gameStateExampleResponse } from "Api/fixtures/gameStateExampleResponse";

export const gameStatePickTwoExampleResponse = {
  data: {
    ...gameStateExampleResponse.data,
    blackCard: {
      id: 4624,
      pick: 2,
      text: "_ is the key to recovery and _ is the key to my bum hole.",
      expansionId: 1
    },
  }
}