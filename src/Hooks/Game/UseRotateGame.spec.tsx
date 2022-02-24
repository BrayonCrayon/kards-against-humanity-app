import { apiClient } from "../../Api/apiClient";
import { gameFixture } from "../../Api/fixtures/gameFixture";
import { renderHook } from "@testing-library/react-hooks";
import { blackCardFixture } from "../../Api/fixtures/blackcardFixture";
import { UseRotateGame } from "./UseRotateGame";

describe("UseRotateGame", () => {
  it("will call round rotation api endpoint", async () => {
    const spyApiClient = jest.spyOn(apiClient, "post").mockResolvedValue({});
    const gameId = gameFixture.id;
    const blackCardId = blackCardFixture.id;
    const { result } = renderHook(() => UseRotateGame());

    await result.current(gameId, blackCardId);

    expect(spyApiClient).toHaveBeenCalledWith(`/api/game/${gameId}/rotate`, {
      blackCardId,
    });
  });
  it("will catch api call error", async () => {
    const mockErrorMessage = {
      code: 500,
      message: "server error",
    };
    const spyConsole = jest
      .spyOn(console, "error")
      .mockImplementation(jest.fn());
    const spyApiClient = jest
      .spyOn(apiClient, "post")
      .mockRejectedValue(mockErrorMessage);
    const gameId = gameFixture.id;
    const blackCardId = blackCardFixture.id;
    const { result } = renderHook(() => UseRotateGame());

    await result.current(gameId, blackCardId);

    expect(spyApiClient).toHaveBeenCalledWith(`/api/game/${gameId}/rotate`, {
      blackCardId,
    });
    expect(spyConsole).toHaveBeenCalledWith(mockErrorMessage);
  });
});
