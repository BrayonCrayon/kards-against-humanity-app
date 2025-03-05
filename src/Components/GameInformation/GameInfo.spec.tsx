import React from "react";
import { fireEvent, RenderResult, waitFor } from "@testing-library/react";
import GameInfo from "@/Components/GameInformation/GameInfo";
import { gameStateJudgeExampleResponse } from "@/Api/fixtures/gameStateJudgeExampleResponse";
import { transformUser, transformUsers } from "@/Types/User";
import { kardsRender } from "@/Tests/testRenders";
import { spyOnUseAuth, spyOnUseGame, spyOnUsePlayers } from "@/Tests/testHelpers";
import userEvent from "@testing-library/user-event";
import { happyToast } from "@/Utilities/toasts";
import { gameFactory } from "@/Tests/Factories/GameFactory";

const { data: {game, users, currentUser, blackCard} } = gameStateJudgeExampleResponse;
const players = transformUsers(users);
const auth = transformUser(currentUser);
const hasSubmittedCards = false;

const renderer = async (): Promise<RenderResult> => {
  return kardsRender(<GameInfo />);
};

const mockKickPlayer = vi.fn();
vi.mock("@/Hooks/Game/Actions/useKickPlayer", () => {
  return () => {
    return mockKickPlayer;
  };
});

const mockUpdateGameSettings = vi.fn();
vi.mock("@/Hooks/Game/State/useUpdateGameSettings", () => {
  return () => {
    return mockUpdateGameSettings;
  }
})

vi.mock("@/Utilities/toasts");

describe("GameInfo", () => {
  beforeEach(() => {
    spyOnUsePlayers(vi.fn(), { players });
    spyOnUseAuth(vi.fn(), { auth, hasSubmittedCards });
    spyOnUseGame(vi.fn(), { game, blackCard });
  });

  it("shows game code", async () => {
    const wrapper = await renderer();

    await waitFor(() => {
      const gameCodeDisplayElement = wrapper.queryByRole("copy") as HTMLElement;
      expect(gameCodeDisplayElement).not.toBeNull();
      expect(gameCodeDisplayElement).toHaveTextContent(game.code);
    });
  });

  it("copies game code to clipboard when clicked", async () => {
    vi.spyOn(navigator.clipboard, "writeText");
    const wrapper = await renderer();

    await waitFor(() => {
      userEvent.click(wrapper.getByRole("copy"));
    });

    await waitFor(() => {
      expect(navigator.clipboard.writeText).toBeCalledWith(game.code);
    });
  });

  it("displays notification when game code is clicked", async () => {
    const wrapper = await renderer();

    await waitFor(() => {
      userEvent.click(wrapper.getByRole("copy"));
    });

    await waitFor(() => {
      expect(happyToast).toHaveBeenCalledWith(
        "Game code copied!",
        "center"
      );
    });
  });

  it("will update game settings when user clicks update in timer settings", async () => {
    const seconds = 300;
    const callbackSpy = spyOnUseGame(
        vi.fn(),
        {game: gameFactory({selectionTimer: 200, selectionEndsAt: 5000}), blackCard}
    );
    const wrapper = await renderer();

    await userEvent.click(wrapper.getByTestId("game-settings"));
    await userEvent.click(wrapper.getByTestId("settings"));

    await waitFor(() => {
      fireEvent.change(wrapper.getByTestId("range-timer"), {
        target: {
          value: seconds.toString(),
        },
      });
    });

    await userEvent.click(wrapper.getByTestId("update-settings"));

    await waitFor(() => {
      expect(mockUpdateGameSettings).toHaveBeenCalled();
      callbackSpy.mockRestore();
    });
  });
});
