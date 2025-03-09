import { kardsHookRender } from "@/Tests/testRenders";
import { gameFixture } from "@/Api/fixtures/gameFixture";
import {
  listenWhenGameRotates,
  listenWhenGameStart,
  listenWhenUserJoinsGame,
  listenWhenUserSubmittedCards
} from "@/Services/PusherService";
import useListenOnEvents from "@/Hooks/Helpers/useListenOnEvents";

vi.mock("@/Services/PusherService");

const mockGameStateCallback = vi.fn();
vi.mock("@/Hooks/Game/State/useGameStateCallback", () => ({
  default: () => mockGameStateCallback
}));

const mockJoinCallback = vi.fn();
vi.mock("@/Hooks/Helpers/useUserJoinsGameCallback", () => ({
  default: () => mockJoinCallback
}));

const mockRefreshPlayersCallback = vi.fn();
vi.mock("@/Hooks/Game/State/useRefreshPlayersStateCallback", () => ({
  default: () => mockRefreshPlayersCallback
}));

describe("useListenOnEvents", () => {
  it("will listen on pusher events", async () => {
    const gameId = gameFixture.id;
    const userId = gameFixture.judgeId;
    const { result } = kardsHookRender(useListenOnEvents);

    result.current(gameId, userId);

    expect(listenWhenUserJoinsGame).toHaveBeenCalledWith(gameId, mockJoinCallback);
    expect(listenWhenUserSubmittedCards).toHaveBeenCalledWith(gameId, mockRefreshPlayersCallback);
    expect(listenWhenGameRotates).toHaveBeenCalledWith(gameId, mockGameStateCallback);
    expect(listenWhenGameStart).toHaveBeenCalledWith(userId, mockGameStateCallback);
  });
});
