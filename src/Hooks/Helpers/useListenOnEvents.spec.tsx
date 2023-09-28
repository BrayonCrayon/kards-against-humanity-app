import {kardsHookRender} from "Tests/testRenders";
import {gameFixture} from "Api/fixtures/gameFixture";
import {
  listenWhenGameRotates,
  listenWhenGameStart,
  listenWhenUserJoinsGame,
  listenWhenUserSubmittedCards
} from "Services/PusherService";
import useListenOnEvents from "Hooks/Helpers/useListenOnEvents";

jest.mock("Services/PusherService");

const mockGameStateCallback = jest.fn();
jest.mock("Hooks/Game/State/useGameStateCallback", () => {
  return () => mockGameStateCallback;
});

const mockJoinCallback = jest.fn();
jest.mock("Hooks/Helpers/useUserJoinsGameCallback", () => {
  return () => mockJoinCallback;
});

const mockRefreshPlayersCallback = jest.fn();
jest.mock("Hooks/Game/State/useRefreshPlayersStateCallback", () => {
  return () => mockRefreshPlayersCallback;
});

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
