import {expectDispatch, spyOnUseAuth, spyOnUseGame, spyOnUseHand, spyOnUsePlayers} from "Tests/testHelpers";
import {service} from "setupTests";
import {gameStateExampleResponse} from "Api/fixtures/gameStateExampleResponse";
import {AxiosResponse} from "axios";
import {kardsHookRender} from "Tests/testRenders";
import useCreateGame from "Hooks/Game/Create/useCreateGame";
import {transformUser, transformUsers} from "Types/User";
import {ICreateGameOptions} from "Services/GameService";

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
    const name = "Frodo";
    const expansionIds = [1, 2];
    const timer = 180;
    const hasAnimations = false;
    const { result } = kardsHookRender(useCreateGame);
    const options: ICreateGameOptions = {name, expansionIds, timer, hasAnimations};

    await result.current(options);

    expect(service.createGame).toHaveBeenCalledWith(options);
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

    const options: ICreateGameOptions = { name: "bob", expansionIds: [1,2], timer: null, hasAnimations: false};

    await result.current(options);

    expect(mockedNavigate).not.toHaveBeenCalled();
    expect(dispatchSpy).not.toHaveBeenCalled();
    expect(consoleSpy).toHaveBeenCalledWith(errorMsg);
  });
});
