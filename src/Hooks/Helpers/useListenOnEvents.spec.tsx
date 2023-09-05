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

const mockCallback = jest.fn();
jest.mock("Hooks/Game/State/useGameStateCallback", () => {
  return () => mockCallback;
});

jest.mock("Hooks/Helpers/useUserJoinsGameCallback", () => {
  return () => mockCallback;
});

describe("useListenOnEvents", () => {
  it("will listen on pusher events", async () => {
    const gameId = gameFixture.id;
    const userId = gameFixture.judgeId;
    const { result } = kardsHookRender(useListenOnEvents);

    result.current(gameId, userId);

    expect(listenWhenUserJoinsGame).toHaveBeenCalledWith(gameId, mockCallback);
    expect(listenWhenUserSubmittedCards).toHaveBeenCalledWith(
      gameId,
      mockCallback
    );
    expect(listenWhenGameRotates).toHaveBeenCalledWith(gameId, mockCallback);
    expect(listenWhenGameStart).toHaveBeenCalledWith(userId, mockCallback)
  });
});
