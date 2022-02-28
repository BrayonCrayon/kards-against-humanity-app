import { apiClient } from "../../Api/apiClient";
import { gameFixture } from "../../Api/fixtures/gameFixture";
import { renderHook } from "@testing-library/react-hooks";
import { useRotateGame } from "./useRotateGame";

jest.mock("../../Api/apiClient");
const mockedAxios = apiClient as jest.Mocked<typeof apiClient>;

describe("useRotateGame", () => {
  beforeEach(() => {
    mockedAxios.post.mockResolvedValue({});
  });

  it("will call round rotation api endpoint", async () => {
    const gameId = gameFixture.id;
    const { result } = renderHook(() => useRotateGame());

    await result.current(gameId);

    expect(mockedAxios.post).toHaveBeenCalledWith(`/api/game/${gameId}/rotate`);
  });

  it("will catch api call error", async () => {
    const mockErrorMessage = {
      code: 500,
      message: "server error",
    };
    mockedAxios.post.mockRejectedValueOnce(mockErrorMessage);
    const spyConsole = jest
      .spyOn(console, "error")
      .mockImplementation(jest.fn());
    const gameId = gameFixture.id;
    const { result } = renderHook(() => useRotateGame());

    await result.current(gameId);

    expect(mockedAxios.post).toHaveBeenCalledWith(`/api/game/${gameId}/rotate`);
    expect(spyConsole).toHaveBeenCalledWith(mockErrorMessage);
    spyConsole.mockRestore();
  });
});
