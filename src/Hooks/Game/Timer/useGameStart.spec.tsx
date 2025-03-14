import { renderHook } from "@testing-library/react";
import { gameFactory } from "@/Tests/Factories/GameFactory";
import { service } from "@/setupTests";
import useGameStart from "./useGameStart";

const mocks = vi.hoisted(() => ({ fetchGameCallback: vi.fn() }))

vi.mock("@/Hooks/Game/State/useFetchGameState", () => ({
    default: () => mocks.fetchGameCallback
}));

describe("useGameStart", () => {

    it("will call start game endpoint then refresh game state", async () => {
        const game = gameFactory();
        const { result} = renderHook(useGameStart);

        await result.current(game.id);

        expect(service.startGame).toHaveBeenCalledWith(game.id);
        expect(mocks.fetchGameCallback).toHaveBeenCalledWith(game.id);
    });

    it("will catch server errors", async () => {
        const error = { message: "Something went wrong" };
        service.startGame.mockRejectedValueOnce(error);
        const consoleSpy = vi.spyOn(console, "error").mockImplementationOnce(vi.fn());
        const game = gameFactory();
        const {result} = renderHook(useGameStart);

        await result.current(game.id);

        expect(consoleSpy).toHaveBeenCalledWith(error);
        consoleSpy.mockRestore();
    });
});