import { renderHook } from "@testing-library/react-hooks";
import UseFetchRoundWinner from "./UseFetchRoundWinner";
import { apiClient } from "../../Api/apiClient";

describe("UseFetchRoundWinner", () => {
  it("it will hit the api to fetch round winner", async () => {
    const { result } = renderHook(UseFetchRoundWinner);
    const getSpy = jest.spyOn(apiClient, "get").mockImplementation();
    const gameId = "abcd";
    await result.current({ gameId });
    expect(getSpy).toHaveBeenCalledWith(`/api/game/${gameId}/round/winner`);
  });
});
