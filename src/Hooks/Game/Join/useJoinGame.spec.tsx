import { expectDispatch, spyOnUseAuth, spyOnUseGame, spyOnUseHand, spyOnUsePlayers } from "@/Tests/testHelpers";
import { kardsHookRender } from "@/Tests/testRenders";
import useJoinGame from "@/Hooks/Game/Join/useJoinGame";
import { mockedUsedNavigate, service } from "@/setupTests";
import { gameStateExampleResponse } from "@/Api/fixtures/gameStateExampleResponse";
import { AxiosResponse } from "axios";
import { transformUser, transformUsers } from "@/Types/User";
import { errorToast } from "@/Utilities/toasts";
import { transformWhiteCardArray } from "@/Types/WhiteCard";

const {data} = gameStateExampleResponse;
const code = "1k2k";
const userName = "Frodo";
const dispatchSpy = vi.fn();

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
    expectDispatch(dispatchSpy, transformWhiteCardArray(data.hand));
    expect(mockedUsedNavigate).toHaveBeenCalledWith(`/game/${data.game.id}`);
  });

  it("will catch server error", async () => {
    const errorMessage = { message: "No Api" };
    service.joinGame.mockRejectedValueOnce(errorMessage);
    console.error = vi.fn();
    const consoleSpy = vi.spyOn(console, "error").mockImplementation(() => {});

    const { result } = kardsHookRender(useJoinGame);

    await result.current(code, userName);

    expect(consoleSpy).toHaveBeenCalledWith(errorMessage);
    expect(errorToast).toHaveBeenCalledWith("Game does not exist");
  });
});