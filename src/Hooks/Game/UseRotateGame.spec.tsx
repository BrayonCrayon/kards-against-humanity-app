import { apiClient } from "../../Api/apiClient";
import { gameFixture } from "../../Api/fixtures/gameFixture";
import { renderHook } from "@testing-library/react-hooks";
import { blackCardFixture } from "../../Api/fixtures/blackcardFixture";
import { UseRotateGame } from "./UseRotateGame";

jest.mock("../../Api/apiClient");
const mockedAxios = apiClient as jest.Mocked<typeof apiClient>;

describe("UseRotateGame", () => {
  beforeEach(() => {
    mockedAxios.post.mockResolvedValue({});
  });

  it("will call round rotation api endpoint", async () => {
    const gameId = gameFixture.id;
    const blackCardId = blackCardFixture.id;
    const { result } = renderHook(() => UseRotateGame());

    await result.current(gameId, blackCardId);

    expect(mockedAxios.post).toHaveBeenCalledWith(
      `/api/game/${gameId}/rotate`,
      {
        blackCardId,
      }
    );
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
    const blackCardId = blackCardFixture.id;
    const { result } = renderHook(() => UseRotateGame());

    await result.current(gameId, blackCardId);

    expect(mockedAxios.post).toHaveBeenCalledWith(
      `/api/game/${gameId}/rotate`,
      {
        blackCardId,
      }
    );
    expect(spyConsole).toHaveBeenCalledWith(mockErrorMessage);
    spyConsole.mockRestore();
  });
});
