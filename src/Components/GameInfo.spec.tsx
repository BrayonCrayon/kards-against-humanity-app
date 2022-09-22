import React from "react";
import { RenderResult } from "@testing-library/react";
import GameInfo from "./GameInfo";
import { gameStateJudgeExampleResponse } from "Api/fixtures/gameStateJudgeExampleResponse";
import { transformUser, transformUsers } from "Types/User";
import { kardsRender } from "Tests/testRenders";
import { spyOnUseAuth, spyOnUseGame, spyOnUsePlayers } from "Tests/testHelpers";

const { data: {game, users, currentUser, blackCard} } = gameStateJudgeExampleResponse;
const players = transformUsers(users);
const auth = transformUser(currentUser);
const hasSubmittedCards = false;

const renderer = async (): Promise<RenderResult> => {
  return kardsRender(<GameInfo />);
};

const mockKickPlayer = jest.fn();
jest.mock("Hooks/Game/Actions/useKickPlayer", () => {
  return () => {
    return mockKickPlayer;
  };
});

describe("GameInfo", () => {
  beforeEach(() => {
    spyOnUsePlayers(jest.fn(), { players });
    spyOnUseAuth(jest.fn(), { auth, hasSubmittedCards });
    spyOnUseGame(jest.fn(), { game, blackCard });
  });

  describe("Game box", () => {
    it("shows game name", async () => {
      const wrapper = await renderer();

      expect(wrapper.queryByTestId(`game-${game.id}-name`)).not.toBeNull();
      expect(wrapper.queryByTestId(`game-${game.id}-name`)).toHaveTextContent(
        game.name
      );
    });
  });
});
