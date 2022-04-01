import { renderHook } from "@testing-library/react-hooks";
import useKickPlayer from "./useKickPlayer";
import { VoteProvider } from "../../State/Vote/VoteContext";
import { apiClient } from "../../Api/apiClient";
import { gameFixture } from "../../Api/fixtures/gameFixture";
import { gameStateExampleResponse } from "../../Api/fixtures/gameStateExampleResponse";
import { transformUsers } from "../../Types/User";
import * as Users from "../../State/Users/UsersContext";
import { UsersProvider } from "../../State/Users/UsersContext";

const renderUseKickPlayer = () => {
  return renderHook(useKickPlayer, {
    wrapper: ({ children }) => (
      <VoteProvider>
        <UsersProvider>
          {children}
        </UsersProvider>
      </VoteProvider>
    ),
  });
};

jest.mock("../../Api/apiClient");
const mockedAxios = apiClient as jest.Mocked<typeof apiClient>;

const gameId = gameFixture.id;
const userId = 1;

describe("useKickPlayer", () => {
  it("will call api to kick player", async () => {
    const { result } = renderUseKickPlayer();

    await result.current(gameId, userId);

    expect(mockedAxios.post).toHaveBeenCalledWith(
      `/api/game/${gameId}/player/${userId}/kick`
    );
  });

  it("will catch error if call to api fails", async () => {
    let errorMessage = { code: 500, message: "server error" };
    mockedAxios.post.mockRejectedValueOnce(errorMessage);
    const consoleSpy = jest
      .spyOn(console, "error")
      .mockImplementation(() => {});
    const { result } = renderUseKickPlayer();

    await result.current(gameId, userId);

    expect(consoleSpy).toHaveBeenCalledWith(errorMessage);
  });

  it("will dispatch to remove player from the game", async () => {
    const mockDispatch = jest.fn();
    jest.spyOn(Users, "useUsers").mockImplementation(() => ({
      dispatch: mockDispatch,
      state: {
        users: transformUsers(gameStateExampleResponse.data.users),
      },
    }));
    const { result } = renderUseKickPlayer();

    await result.current(gameId, userId);

    expect(mockDispatch).toHaveBeenCalledWith(
      expect.objectContaining({
        execute: expect.any(Function),
        payload: userId,
      })
    );
  });
});
