import { kardsHookRender } from "Tests/testRenders";
import { service } from "setupTests";
import useLeaveGame from "Hooks/Game/Actions/useLeaveGame";
import { AxiosResponse } from "axios";
import {
  expectDispatch,
  spyOnUseAuth,
  spyOnUseGame,
  spyOnUseHand,
  spyOnUsePlayers,
  spyOnUseVote
} from "Tests/testHelpers";
import { initialGameState } from "State/Game/GameState";
import { initialPlayersState } from "State/Players/PlayersState";
import { initialHandState } from "State/Hand/HandState";

const dispatch = jest.fn();

describe("useLeaveGame", () => {
  beforeEach(() => {
    spyOnUseGame(dispatch);
    spyOnUseAuth(dispatch);
    spyOnUsePlayers(dispatch);
    spyOnUseHand(dispatch);
    spyOnUseVote(dispatch);
  })

  it("will call endpoint for user to leave a game", async () => {
    service.leaveGame.mockResolvedValue({} as AxiosResponse);
    const gameId = "2342klh34o3i2u432j";
    const { result } = kardsHookRender(useLeaveGame);

    await result.current(gameId);

    expect(service.leaveGame).toHaveBeenCalledWith(gameId);
    // expect(history.push).toHaveBeenCalledWith("/");
    expectDispatch(dispatch, initialGameState.game);
    expectDispatch(dispatch, initialGameState.blackCard);
    expectDispatch(dispatch, false);
    expectDispatch(dispatch, initialPlayersState.players);
    expectDispatch(dispatch, initialHandState.hand);
    expectDispatch(dispatch, undefined);
  });

  it("will catch error from endpoint call", async () => {
    const errorMessage = { error: "500 server error" };
    service.leaveGame.mockRejectedValueOnce(errorMessage);
    const gameId = "2342klh34o3i2u432j";
    const consoleSpy = jest.spyOn(console, "error").mockImplementationOnce(() => {});
    const { result } = kardsHookRender(useLeaveGame);

    await result.current(gameId);

    expect(consoleSpy).toHaveBeenCalledWith(errorMessage);
    // expect(history.push).not.toHaveBeenCalled();
  });
});