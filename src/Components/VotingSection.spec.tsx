import { submittedCardsResponse } from "../Api/fixtures/submittedCardsResponse";
import { gameStateAllPlayerSubmittedCardsExampleResponse } from "../Api/fixtures/gameStateAllPlayerSubmittedCardsExampleResponse";
import {
  customGameWrapperRender,
  gameWrapperRender,
} from "../Tests/testRenders";
import GamePage from "../Pages/GamePage";
import { RenderResult, waitFor } from "@testing-library/react";
import { apiClient } from "../Api/apiClient";
import { IGameContext, initialState } from "../State/Game/GameContext";
import { userFixture } from "../Api/fixtures/userFixture";
import { transformUser, transformUsers } from "../Types/User";
import { gameStateExampleResponse } from "../Api/fixtures/gameStateExampleResponse";
import { whiteCardFixture as cardsInHand } from "../Api/fixtures/whiteCardFixture";
import { blackCardFixture } from "../Api/fixtures/blackcardFixture";
import { VotingSection } from "./VotingSection";
import { constructWhiteCardArray } from "../Types/WhiteCard";

jest.mock("../Api/apiClient");

const mockedAxios = apiClient as jest.Mocked<typeof apiClient>;

const gameFixture = {
  id: "063a4fa2-7ab7-46d5-b59f-f0d15bb17f65",
  code: "1234",
  name: "Puzzled Penguin",
  judge_id: gameStateAllPlayerSubmittedCardsExampleResponse.data.judge.id,
};

const renderer = (value?: Partial<IGameContext>): RenderResult => {
  return customGameWrapperRender(<VotingSection />, {
    ...initialState,
    game: gameFixture,
    user: transformUser(
      gameStateAllPlayerSubmittedCardsExampleResponse.data.current_user
    ),
    users: transformUsers(
      gameStateAllPlayerSubmittedCardsExampleResponse.data.users
    ),
    hand: constructWhiteCardArray(
      gameStateAllPlayerSubmittedCardsExampleResponse.data.hand,
      false,
      []
    ),
    blackCard:
      gameStateAllPlayerSubmittedCardsExampleResponse.data.current_black_card,
    ...value,
  });
};

describe("VotingSection", () => {
  it("calls backend api for submitted cards", async () => {
    mockedAxios.get.mockResolvedValueOnce(submittedCardsResponse);

    renderer();

    await waitFor(() => {
      expect(mockedAxios.get).toHaveBeenCalledWith(
        `/api/game/${gameStateAllPlayerSubmittedCardsExampleResponse.data.id}/submitted/cards`
      );
    });
  });
});
