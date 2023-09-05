import {kardsHookRender} from "Tests/testRenders";
import {service} from "setupTests";
import useUpdateGameSettings from "./useUpdateGameSettings";
import {gameFactory} from "Tests/Factories/GameFactory";
import {AxiosResponse} from "axios";

const mockedCallback = jest.fn();
jest.mock("Hooks/Game/State/useFetchGameState", () => {
    return () => mockedCallback;
})

describe("useUpdateGameSettings", () => {

    it("will update game settings", async () => {
        service.updateSettings.mockResolvedValue({} as AxiosResponse);
        const selectionTimer = 219;
        const game = gameFactory();
        const {result} = kardsHookRender(useUpdateGameSettings);

        await result.current(game.id, selectionTimer);

        expect(service.updateSettings).toHaveBeenCalledWith(game.id, selectionTimer);
        expect(mockedCallback).toHaveBeenCalledWith(game.id);
    });

    it("will catch server error if it occurs", async () => {
        service.updateSettings.mockRejectedValueOnce({});
        const consoleSpy = jest.spyOn(console, "error").mockImplementationOnce(jest.fn());
        const selectionTimer = 219;
        const game = gameFactory();
        const {result} = kardsHookRender(useUpdateGameSettings);

        await result.current(game.id, selectionTimer);

        expect(consoleSpy).toHaveBeenCalled();
        consoleSpy.mockRestore();
    });
})