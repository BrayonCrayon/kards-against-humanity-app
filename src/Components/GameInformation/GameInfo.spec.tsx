import React from "react";
import { RenderResult, waitFor } from "@testing-library/react";
import GameInfo from "Components/GameInformation/GameInfo";
import { gameStateJudgeExampleResponse } from "Api/fixtures/gameStateJudgeExampleResponse";
import { transformUser, transformUsers } from "Types/User";
import { kardsRender } from "Tests/testRenders";
import { spyOnUseAuth, spyOnUseGame, spyOnUsePlayers } from "Tests/testHelpers";
import userEvent from "@testing-library/user-event";
import { happyToast } from "Utilities/toasts";

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

jest.mock("Utilities/toasts");

describe("GameInfo", () => {
  beforeEach(() => {
    spyOnUsePlayers(jest.fn(), { players });
    spyOnUseAuth(jest.fn(), { auth, hasSubmittedCards });
    spyOnUseGame(jest.fn(), { game, blackCard });
  });

  it("shows game code", async () => {
    const wrapper = await renderer();

    await waitFor(() => {
      const gameCodeDisplayElement = wrapper.queryByRole('copy') as HTMLElement;
      expect(gameCodeDisplayElement).not.toBeNull();
      expect(gameCodeDisplayElement).toHaveTextContent(game.code);
    });
  });

  it("copies game code to clipboard when clicked", async () => {
    jest.spyOn(navigator.clipboard, "writeText");
    const wrapper = await renderer();

    await waitFor(() => {
      userEvent.click(wrapper.getByRole('copy'));
    });

    await waitFor(() => {
      expect(navigator.clipboard.writeText).toBeCalledWith(game.code);
    });
  });

  it("displays notification when game code is clicked", async () => {
    const wrapper = await renderer();

    await waitFor(() => {
      userEvent.click(wrapper.getByRole('copy'));
    });

    await waitFor(() => {
      expect(happyToast).toHaveBeenCalledWith(
        "Game code copied!",
        "center"
      );
    });
  });
});
