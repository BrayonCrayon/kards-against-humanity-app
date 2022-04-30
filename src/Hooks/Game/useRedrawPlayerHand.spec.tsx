import {kardsHookRender} from "Tests/testRenders";
import {gameStateExampleResponse} from "Api/fixtures/gameStateExampleResponse";
import gameService from "Services/GameService";
import {expectDispatch, expectNoDispatch} from "Tests/testHelpers";
import {transformWhiteCardArray} from "Types/WhiteCard";
import useRedrawPlayerHand from "./useRedrawPlayerHand";

const {data: {hand, code}} = gameStateExampleResponse;

jest.mock("Services/GameService");

const mockDispatch = jest.fn();
jest.mock("State/Hand/HandContext", () => ({
    ...jest.requireActual("State/Hand/HandContext"),
    useHand: () => ({
        dispatch: mockDispatch
    })
}));

jest.mock("State/User/UserContext", () => ({
    ...jest.requireActual("State/User/UserContext"),
    useUser: () => ({
        dispatch: mockDispatch
    })
}))

const mockedGameService = gameService as jest.Mocked<typeof gameService>;

describe('useRedrawPlayerHand', function () {

    it('will call redraw endpoint and set state', async () => {
        // @ts-ignore
        mockedGameService.redraw.mockResolvedValue({data: hand});
        const {result} = kardsHookRender(useRedrawPlayerHand);

        await result.current(code);

        expect(gameService.redraw).toHaveBeenCalledWith(code);
        expectDispatch(mockDispatch, transformWhiteCardArray(hand, false, []));
        expectDispatch(mockDispatch, 1);
    });

    it("will catch server error when redraw hand fails", async () => {
        const errorMessage = {error: {message: "Server Error"}};
        const consoleSpy = jest.spyOn(console, "error")
            .mockImplementation(() => {
            });
        mockedGameService.redraw.mockRejectedValue(errorMessage);
        const {result} = kardsHookRender(useRedrawPlayerHand);

        await result.current(code);

        expect(gameService.redraw).toHaveBeenCalledWith(code);
        expectNoDispatch(mockDispatch, transformWhiteCardArray(hand, false, []));
        expect(consoleSpy).toHaveBeenCalledWith(errorMessage);
    });
});