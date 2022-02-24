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
  it.todo("will catch api call error");
});
