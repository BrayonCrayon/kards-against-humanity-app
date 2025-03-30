import { kardsHookRender } from "@/Tests/testRenders";
import useJoinAsSpectator from "@/Hooks/Game/Join/useJoinAsSpectator";
import { expectDispatch, spyOnUseAuth, spyOnUseGame, spyOnUsePlayers } from "@/Tests/testHelpers";
import { transformUser, transformUsers } from "@/Types/User";
import { gameSpectatorExampleResponse } from "@/Api/fixtures/gameSpectatorExampleResponse";
import { service } from "@/setupTests";
import { AxiosResponse } from "axios";

const {data: {users, user, game, blackCard} } = gameSpectatorExampleResponse;
const mockedDispatch = vi.fn();

describe("useJoinAsSpectator", () => {
  beforeEach(() => {
    service.joinAsSpectator.mockResolvedValue(gameSpectatorExampleResponse as AxiosResponse);
    spyOnUsePlayers(mockedDispatch);
    spyOnUseAuth(mockedDispatch);
    spyOnUseGame(mockedDispatch);
  });

  it("will call join spectator endpoint and set state", async () => {
    const { result } = kardsHookRender(useJoinAsSpectator);

    await result.current("1223");

    expectDispatch(mockedDispatch, transformUsers(users));
    expectDispatch(mockedDispatch, transformUser(user));
    expectDispatch(mockedDispatch, game);
    expectDispatch(mockedDispatch, blackCard);
    // expect(history.push).toHaveBeenCalledWith(`/game/${game.id}/spectate`);
  });

  it("will catch server error", async () => {
    const errorMessage = { message: "something happened"};
    const consoleSpy = vi.spyOn(console, "error")
      .mockImplementation(() => {});
    service.joinAsSpectator.mockRejectedValueOnce(errorMessage);

    const { result } = kardsHookRender(useJoinAsSpectator);

    await result.current("1234")

    expect(consoleSpy).toHaveBeenCalledWith(errorMessage)
  });

  it("will capitalize game code", async () => {
    const code = "1e4r"
    const { result } = kardsHookRender(useJoinAsSpectator);

    await result.current(code);

    expect(service.joinAsSpectator).toHaveBeenCalledWith(code.toUpperCase());
  });
})