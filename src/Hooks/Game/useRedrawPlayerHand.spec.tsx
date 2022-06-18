import { kardsHookRender } from "Tests/testRenders";
import { gameStateExampleResponse } from "Api/fixtures/gameStateExampleResponse";
import { expectDispatch, expectNoDispatch, spyOnUseAuth, spyOnUseHand } from "Tests/testHelpers";
import { transformWhiteCardArray } from "Types/WhiteCard";
import useRedrawPlayerHand from "./useRedrawPlayerHand";
import { service } from "setupTests";
import { initialAuthState } from "State/Auth/AuthState";
import { initialHandState } from "State/Hand/HandState";

const {data: {hand, id}} = gameStateExampleResponse;
const mockDispatch = jest.fn();

describe('useRedrawPlayerHand', function () {
    beforeEach(() => {
       spyOnUseAuth(initialAuthState, mockDispatch);
       spyOnUseHand(initialHandState, mockDispatch);
    });

    it('will call redraw endpoint and set state', async () => {
        // @ts-ignore
        service.redraw.mockResolvedValue({ data: hand  });
        const {result} = kardsHookRender(useRedrawPlayerHand);

        await result.current(id);

        expect(service.redraw).toHaveBeenCalledWith(id);
        expectDispatch(mockDispatch, transformWhiteCardArray(hand, false, []));
        expectDispatch(mockDispatch, 1);
    });

    it("will catch server error when redraw hand fails", async () => {
        const errorMessage = {error: {message: "Server Error"}};
        const consoleSpy = jest.spyOn(console, "error")
            .mockImplementation(() => {});
        service.redraw.mockRejectedValue(errorMessage);
        const {result} = kardsHookRender(useRedrawPlayerHand);

        await result.current(id);

        expect(service.redraw).toHaveBeenCalledWith(id);
        expectNoDispatch(mockDispatch, transformWhiteCardArray(hand, false, []));
        expect(consoleSpy).toHaveBeenCalledWith(errorMessage);
    });
});