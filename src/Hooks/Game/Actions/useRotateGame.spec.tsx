import { gameFixture } from "@/Api/fixtures/gameFixture";
import useRotateGame from "@/Hooks/Game/Actions/useRotateGame";
import { service } from "setupTests";
import {renderHook} from "@testing-library/react";

describe("useRotateGame", () => {
  beforeEach(() => {
    // @ts-ignore
    service.rotate.mockResolvedValue({});
  });

  it("will call round rotation api endpoint", async () => {
    const gameId = gameFixture.id;
    const { result } = renderHook(() => useRotateGame());

    await result.current(gameId);

    expect(service.rotate).toHaveBeenCalledWith(gameId);
  });

  it("will catch api call error", async () => {
    const mockErrorMessage = {
      code: 500,
      message: "server error",
    };
    service.rotate.mockRejectedValueOnce(mockErrorMessage);
    const spyConsole = jest
      .spyOn(console, "error")
      .mockImplementation(jest.fn());
    const gameId = gameFixture.id;
    const { result } = renderHook(() => useRotateGame());

    await result.current(gameId);

    expect(service.rotate).toHaveBeenCalledWith(gameId);
    expect(spyConsole).toHaveBeenCalledWith(mockErrorMessage);
    spyConsole.mockRestore();
  });
});
