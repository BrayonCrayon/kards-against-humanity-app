import {gameFixture} from "Api/fixtures/gameFixture";
import {renderHook} from "@testing-library/react-hooks";
import useRotateGame from "./useRotateGame";
import useRefreshPlayers from "./useRefreshPlayers";
import {expectDispatch} from "Tests/testHelpers";
import {playersIndexExampleResponse} from "Api/fixtures/playersIndexExampleResponse";
import {transformUsers} from "Types/User";
import {mockedAxios} from "setupTests";


let mockDispatch = jest.fn();
jest.mock("State/Users/UsersContext", () => ({
  ...jest.requireActual("State/Users/UsersContext"),
  useUsers: () => ({
    state: {
      users: [],
    },
    dispatch: mockDispatch,
  }),
}));

describe("useRotateGame", () => {
  beforeEach(() => {
    mockedAxios.get.mockResolvedValue({});
  });

  it("will call game players endpoint", async () => {
    mockedAxios.get.mockResolvedValue(playersIndexExampleResponse);
    const gameId = gameFixture.id;
    const { result } = renderHook(() => useRefreshPlayers());

    await result.current(gameId);

    expect(mockedAxios.get).toHaveBeenCalledWith(
        `/api/game/${gameId}/players`
    );
    expectDispatch(
      mockDispatch,
      transformUsers(playersIndexExampleResponse.data)
    );
  });

  it("will catch api call error", async () => {
    const mockErrorMessage = {
      code: 500,
      message: "server error",
    };
    mockedAxios.get.mockRejectedValueOnce(mockErrorMessage);
    const spyConsole = jest
      .spyOn(console, "error")
      .mockImplementation(jest.fn());
    const gameId = gameFixture.id;
    const { result } = renderHook(() => useRefreshPlayers());

    await result.current(gameId);

    expect(mockedAxios.get).toHaveBeenCalledWith(
        `/api/game/${gameId}/players`
    );
    expect(spyConsole).toHaveBeenCalledWith(mockErrorMessage);
    spyConsole.mockRestore();
  });
});
