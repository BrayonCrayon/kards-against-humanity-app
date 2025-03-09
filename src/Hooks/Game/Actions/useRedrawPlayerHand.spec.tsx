import { kardsHookRender } from "@/Tests/testRenders";
import { gameStateExampleResponse } from "@/Api/fixtures/gameStateExampleResponse";
import { expectDispatch, expectNoDispatch, spyOnUseAuth, spyOnUseHand } from "@/Tests/testHelpers";
import { transformWhiteCardArray } from "@/Types/WhiteCard";
import useRedrawPlayerHand from "@/Hooks/Game/Actions/useRedrawPlayerHand";
import { service } from "@/setupTests";
import { initialAuthState } from "@/State/Auth/AuthState";
import { initialHandState } from "@/State/Hand/HandState";

const {data: {hand, game}} = gameStateExampleResponse;
const mockDispatch = vi.fn();

describe('useRedrawPlayerHand', function () {
    beforeEach(() => {
       spyOnUseAuth(mockDispatch, initialAuthState);
       spyOnUseHand(mockDispatch, initialHandState);
    });

    it('will call redraw endpoint and set state', async () => {
        // @ts-ignore
        service.redraw.mockResolvedValue({ data: hand  });
        const {result} = kardsHookRender(useRedrawPlayerHand);

        await result.current(game.id);

        expect(service.redraw).toHaveBeenCalledWith(game.id);
        expectDispatch(mockDispatch, transformWhiteCardArray(hand, false, []));
        expectDispatch(mockDispatch, 1);
    });

    it("will catch server error when redraw hand fails", async () => {
        const errorMessage = {error: {message: "Server Error"}};
        const consoleSpy = vi.spyOn(console, "error")
            .mockImplementation(() => {});
        service.redraw.mockRejectedValue(errorMessage);
        const {result} = kardsHookRender(useRedrawPlayerHand);

        await result.current(game.id);

        expect(service.redraw).toHaveBeenCalledWith(game.id);
        expectNoDispatch(mockDispatch, transformWhiteCardArray(hand, false, []));
        expect(consoleSpy).toHaveBeenCalledWith(errorMessage);
    });
});