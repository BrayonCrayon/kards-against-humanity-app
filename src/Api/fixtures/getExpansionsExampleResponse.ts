import { Expansion } from "../../Types/Expansion";

interface IGetExpansionsExampleResponse {
  data: Expansion[];
}

export const getExpansionsExampleResponse: IGetExpansionsExampleResponse = {
  data: [
    {
      id: 1,
      name: "Base set",
    },
    {
      id: 2,
      name: "Christmas Set",
    },
  ],
};
