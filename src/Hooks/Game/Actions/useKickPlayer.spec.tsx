import useKickPlayer from "@/Hooks/Game/Actions/useKickPlayer";
import { gameFixture } from "@/Api/fixtures/gameFixture";
import { kardsHookRender } from "@/Tests/testRenders";
import { service } from "@/setupTests";
import { expectDispatch, spyOnUsePlayers } from "@/Tests/testHelpers";
import { initialPlayersState } from "@/State/Players/PlayersState";
import { act } from "react";

const mockedDispatch = vi.fn();
const gameId = gameFixture.id;
const userId = 1;

const renderUseKickPlayer = () => {
  spyOnUsePlayers(mockedDispatch, initialPlayersState);
  return kardsHookRender(useKickPlayer);
};

describe("useKickPlayer", () => {
  it("will call api to kick player", async () => {
    const { result } = renderUseKickPlayer();

    await act(async () => {
      await result.current(gameId, userId);
    });

    expect(service.kick).toHaveBeenCalledWith(gameId, userId);
    expectDispatch(mockedDispatch, userId);
  });

  it("will catch error if call to api fails", async () => {
    let errorMessage = { code: 500, message: "server error" };
    service.kick.mockRejectedValueOnce(errorMessage);
    const consoleSpy = vi
      .spyOn(console, "error")
      .mockImplementation(() => {});
    const { result } = renderUseKickPlayer();

    await act(async () => {
      await result.current(gameId, userId);
    });

    expect(consoleSpy).toHaveBeenCalledWith(errorMessage);
  });
});
