import useFetchSpectatorState from "@/Hooks/Game/State/useFetchSpectatorState";
import { gameSpectatorExampleResponse } from "@/Api/fixtures/gameSpectatorExampleResponse";
import { fetchSpectatorState } from "@/Services/GameService";
import { expectDispatch, spyOnUseAuth, spyOnUseGame, spyOnUsePlayers } from "@/Tests/testHelpers";
import { initialAuthState } from "@/State/Auth/AuthState";
import { service } from "@/setupTests";
import { AxiosResponse } from "axios";
import { initialPlayersState } from "@/State/Players/PlayersState";
import { initialGameState } from "@/State/Game/GameState";
import { renderHook } from "@testing-library/react";
import { transformBlackCard } from "@/Types/BlackCard";

let mockedDispatch = vi.fn();
const gameId = "tacoGameId";

describe("useFetchSpectatorState", () => {
  beforeEach(() => {
    spyOnUseAuth(mockedDispatch, initialAuthState);
    spyOnUsePlayers(mockedDispatch, initialPlayersState);
    spyOnUseGame(mockedDispatch, initialGameState);

    service.fetchSpectatorState.mockResolvedValue(gameSpectatorExampleResponse as AxiosResponse);
  });

  it("will call endpoint to set state", async () => {
    const { result } = renderHook(useFetchSpectatorState);
    const { data } = gameSpectatorExampleResponse;

    await result.current(gameId);

    expect(fetchSpectatorState).toHaveBeenCalledWith(gameId);
    expectDispatch(mockedDispatch, data.user);
    expectDispatch(mockedDispatch, data.users);
    expectDispatch(mockedDispatch, data.game);
    expectDispatch(mockedDispatch, transformBlackCard(data.blackCard));
  });

  it("will catch server error", async () => {
    const consoleSpy = vi.spyOn(console, "error").mockImplementation(() => {});
    const serverError = { message: "500 server error" };
    service.fetchSpectatorState.mockRejectedValueOnce(serverError);
    const { result } = renderHook(useFetchSpectatorState);

    await result.current(gameId);

    expect(consoleSpy).toHaveBeenCalledWith(serverError);
  });
});
