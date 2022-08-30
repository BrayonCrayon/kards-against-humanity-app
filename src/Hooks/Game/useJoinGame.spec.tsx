import { expectDispatch, spyOnUseAuth, spyOnUseGame, spyOnUseHand, spyOnUsePlayers } from "Tests/testHelpers";
import { history, kardsHookRender } from "Tests/testRenders";
import useJoinGame from "Hooks/Game/useJoinGame";
import { service } from "setupTests";
import { gameStateExampleResponse } from "Api/fixtures/gameStateExampleResponse";
import { AxiosResponse } from "axios";
import { transformUser, transformUsers } from "Types/User";
import { errorToast } from "Utilities/toasts";

const {data} = gameStateExampleResponse;
const code = "1k2k";
const userName = "Frodo";
const dispatchSpy = jest.fn();

describe("useJoinGame", () => {
  beforeEach(() => {
    service.joinGame.mockResolvedValue(gameStateExampleResponse as AxiosResponse);
    spyOnUseGame(dispatchSpy);
    spyOnUsePlayers(dispatchSpy);
    spyOnUseHand(dispatchSpy);
    spyOnUseAuth(dispatchSpy);
  })

  it("will call endpoint and set state", async () => {
    const { result } = kardsHookRender(useJoinGame);

    await result.current(code, userName);

    expectDispatch(dispatchSpy, data.game);
    expectDispatch(dispatchSpy, transformUser(data.currentUser));
    expectDispatch(dispatchSpy, transformUsers(data.users));
    expectDispatch(dispatchSpy, data.hand);
    expect(history.push).toHaveBeenCalledWith(`/game/${data.game.id}`);
  });

  it("will catch server error", async () => {
    const errorMessage = { message: "No Api" };
    service.joinGame.mockRejectedValueOnce(errorMessage);
    console.error = jest.fn();
    const consoleSpy = jest.spyOn(console, "error").mockImplementation(() => {});

    const { result } = kardsHookRender(useJoinGame);

    await result.current(code, userName);

    expect(consoleSpy).toHaveBeenCalledWith(errorMessage);
    expect(errorToast).toHaveBeenCalledWith("Game does not exist");
  });
});