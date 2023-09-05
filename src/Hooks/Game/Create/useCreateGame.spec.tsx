import { expectDispatch, spyOnUseAuth, spyOnUseGame, spyOnUseHand, spyOnUsePlayers } from "Tests/testHelpers";
import { service } from "setupTests";
import { gameStateExampleResponse } from "Api/fixtures/gameStateExampleResponse";
import { AxiosResponse } from "axios";
import { kardsHookRender } from "Tests/testRenders";
import useCreateGame from "Hooks/Game/Create/useCreateGame";
import { transformUser, transformUsers } from "Types/User";

const mockedNavigate = jest.fn();
jest.mock("react-router-dom", () => ({
  useNavigate: () => mockedNavigate
}))
const dispatchSpy = jest.fn();
const { data } = gameStateExampleResponse;

describe("useCreateGame", () => {
  beforeEach(() => {
    spyOnUseGame(dispatchSpy);
    spyOnUseAuth(dispatchSpy);
    spyOnUsePlayers(dispatchSpy);
    spyOnUseHand(dispatchSpy);
  });

  it("will create game and set state", async () => {
    service.createGame.mockResolvedValue(gameStateExampleResponse as AxiosResponse);
    const userName = "Frodo";
    const expansionIds = [1, 2];
    const timer = 180;
    const { result } = kardsHookRender(useCreateGame);

    await result.current(userName, expansionIds, timer);

    expect(service.createGame).toHaveBeenCalledWith({ name: userName, expansionIds, timer });
    expect(mockedNavigate).toHaveBeenCalledWith(`/game/${data.game.id}`);
    expectDispatch(dispatchSpy, data.game);
    expectDispatch(dispatchSpy, data.blackCard);
    expectDispatch(dispatchSpy, transformUsers(data.users));
    expectDispatch(dispatchSpy, transformUser(data.currentUser));
    expectDispatch(dispatchSpy, false);
    expectDispatch(dispatchSpy, data.hand);
  });

  it("will handle server error", async () => {
    const errorMsg = { status: 500 };
    const consoleSpy = jest.spyOn(console, "error").mockImplementation(() => {});
    service.createGame.mockRejectedValueOnce(errorMsg);
    const { result } = kardsHookRender(useCreateGame);

    await result.current("bob", [1, 2]);

    expect(mockedNavigate).not.toHaveBeenCalled();
    expect(dispatchSpy).not.toHaveBeenCalled();
    expect(consoleSpy).toHaveBeenCalledWith(errorMsg);
  });
});
