import { kardsHookRender } from "@/Tests/testRenders";
import useListenOnSpectatorEvents from "@/Hooks/Helpers/useListenOnSpectatorEvents";
import { gameFactory } from "@/Tests/Factories/GameFactory";
import { userFactory } from "@/Tests/Factories/UserFactory";
import {
  listenWhenGameRotates,
  listenWhenGameStart,
  listenWhenUserJoinsGame,
  listenWhenUserSubmittedCards
} from "@/Services/PusherService";

jest.mock("@/Services/PusherService");

const mockSpectatorStateCallback = jest.fn();
jest.mock("@/Hooks/Game/State/useSpectatorStateCallback", () => {
  return () => mockSpectatorStateCallback;
});

const mockJoinCallback = jest.fn();
jest.mock("@/Hooks/Helpers/useUserJoinsGameCallback", () => {
  return () => mockJoinCallback;
});

const mockRefreshPlayersCallback = jest.fn();
jest.mock("@/Hooks/Game/State/useRefreshPlayersStateCallback", () => {
  return () => mockRefreshPlayersCallback;
});

describe("useListenOnSpectatorEvents", () => {
  it("will listen on pusher events", () => {
    const game = gameFactory();
    const user = userFactory();

    const { result } = kardsHookRender(useListenOnSpectatorEvents);
    result.current(game.id, user.id);

    expect(listenWhenUserJoinsGame).toHaveBeenCalledWith(game.id, mockJoinCallback);
    expect(listenWhenUserSubmittedCards).toHaveBeenCalledWith(game.id, mockRefreshPlayersCallback);
    expect(listenWhenGameRotates).toHaveBeenCalledWith(game.id, mockSpectatorStateCallback);
    expect(listenWhenGameStart).toHaveBeenCalledWith(user.id, mockSpectatorStateCallback);
  });
})