import { Expansion } from "Types/Expansion";

interface IGetExpansionsExampleResponse {
  data: Expansion[];
}

export const getExpansionsExampleResponse: IGetExpansionsExampleResponse = {
  data: [
    {
      id: 1,
      name: "Base set",
      cardCount: 255,
    },
    {
      id: 2,
      name: "Christmas Set",
      cardCount: 20,
    },
  ],
};
