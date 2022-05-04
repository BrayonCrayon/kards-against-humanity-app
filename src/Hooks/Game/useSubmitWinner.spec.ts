import { kardsHookRender } from "Tests/testRenders";
import { service } from "setupTests";
import useSubmitWinner from "Hooks/Game/useSubmitWinner";
import { happyToast } from "Utilities/toasts";

const gameId = "1j1j";
const playerId = 1;

describe("useSubmitWinner",() => {

  it("will call endpoint to submit winner", async () => {
    const { result } = kardsHookRender(useSubmitWinner);

    await result.current(gameId, playerId);

    expect(service.submitWinner).toHaveBeenCalledWith(gameId, playerId);
    expect(happyToast).toHaveBeenCalled();
  });

  it("will catch server error", async () => {
    service.submitWinner.mockRejectedValueOnce({});
    const consoleSpy = jest.spyOn(console, "error").mockImplementation(jest.fn());
    const { result } = kardsHookRender(useSubmitWinner);

    await result.current(gameId, playerId);

    expect(consoleSpy).toHaveBeenCalled();
  });
})