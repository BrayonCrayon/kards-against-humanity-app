import { kardsHookRender } from "@/Tests/testRenders";
import { service } from "@/setupTests";
import useSubmitWinner from "@/Hooks/Game/Actions/useSubmitWinner";
import { happyToast } from "@/Utilities/toasts";

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
    const consoleSpy = vi.spyOn(console, "error").mockImplementation(vi.fn());
    const { result } = kardsHookRender(useSubmitWinner);

    await result.current(gameId, playerId);

    expect(consoleSpy).toHaveBeenCalled();
  });
})