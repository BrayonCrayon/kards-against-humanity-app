import { kardsHookRender } from "Tests/testRenders";
import { gameFixture } from "Api/fixtures/gameFixture";
import {
  listenWhenGameRotates,
  listenWhenUserJoinsGame,
  listenWhenUserSubmittedCards,
} from "Services/PusherService";
import useListenOnEvents from "Hooks/Helpers/useListenOnEvents";

jest.mock("Services/PusherService");

const mockCallback = jest.fn();
jest.mock("Hooks/Game/useGameStateCallback", () => {
  return () => mockCallback;
});

jest.mock("Hooks/Helpers/useUserJoinsGameCallback", () => {
  return () => mockCallback;
});

describe("useListenOnEvents", () => {
  it("will listen on pusher events", async () => {
    const gameId = gameFixture.id;
    const { result } = kardsHookRender(useListenOnEvents);

    result.current(gameId);

    expect(listenWhenUserJoinsGame).toHaveBeenCalledWith(gameId, mockCallback);
    expect(listenWhenUserSubmittedCards).toHaveBeenCalledWith(
      gameId,
      mockCallback
    );
    expect(listenWhenGameRotates).toHaveBeenCalledWith(gameId, mockCallback);
  });
});
