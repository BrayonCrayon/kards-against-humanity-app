import { gameFixture } from "@/Api/fixtures/gameFixture";
import useRefreshPlayers from "@/Hooks/Game/State/useRefreshPlayers";
import { expectDispatch, spyOnUsePlayers } from "@/Tests/testHelpers";
import { playersIndexExampleResponse } from "@/Api/fixtures/playersIndexExampleResponse";
import { transformUsers } from "@/Types/User";
import { initialPlayersState } from "@/State/Players/PlayersState";
import { service } from "setupTests";
import { kardsHookRender } from "@/Tests/testRenders";

const mockedDispatch = vi.fn();

describe("useRotateGame", () => {
  beforeEach(() => {
    spyOnUsePlayers(mockedDispatch, initialPlayersState);
  });

  it("will call game players endpoint", async () => {
    // @ts-ignore
    service.fetchPlayers.mockResolvedValue(playersIndexExampleResponse);
    const gameId = gameFixture.id;
    const { result } = kardsHookRender(useRefreshPlayers);

    await result.current(gameId);

    expect(service.fetchPlayers).toHaveBeenCalledWith(gameId);
    expectDispatch(mockedDispatch, transformUsers(playersIndexExampleResponse.data));
  });

  it("will catch api call error", async () => {
    const mockErrorMessage = {
      code: 500,
      message: "server error",
    };
    service.fetchPlayers.mockRejectedValueOnce(mockErrorMessage);
    const spyConsole = jest
      .spyOn(console, "error")
      .mockImplementation(vi.fn());
    const gameId = gameFixture.id;
    const { result } = kardsHookRender(useRefreshPlayers);

    await result.current(gameId);

    expect(spyConsole).toHaveBeenCalledWith(mockErrorMessage);
    spyConsole.mockRestore();
  });
});
