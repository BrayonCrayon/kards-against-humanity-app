import { renderHook } from "@testing-library/react-hooks";
import useKickPlayer from "./useKickPlayer";
import { VoteProvider } from "../../State/Vote/VoteContext";
import { apiClient } from "../../Api/apiClient";
import {gameFixture} from "../../Api/fixtures/gameFixture";

const renderUseKickPlayer = () => {
  return renderHook(useKickPlayer, {
    wrapper: ({ children }) => <VoteProvider>{children}</VoteProvider>,
  });
};

jest.mock("../../Api/apiClient");
const mockedAxios = apiClient as jest.Mocked<typeof apiClient>;

describe("useKickPlayer", () => {
  it("will call api to kick player", async () => {
    const {result} = renderUseKickPlayer();
    const gameId = gameFixture.id;
    const userId = 1;

    await result.current(gameId, userId);

    expect(mockedAxios.post).toHaveBeenCalledWith(`/api/game/${gameId}/player/${userId}/kick`);
  });
  it.todo("will catch error if call to api fails");
});
