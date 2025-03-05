import { blackCardFactory } from "@/Tests/Factories/BlackCardFactory";
import { whiteCardFactory } from "@/Tests/Factories/WhiteCardFactory";
import { transformWhiteCardArray } from "@/Types/WhiteCard";
import { kardsHookRender } from "@/Tests/testRenders";
import { useForceSubmitCards } from "@/Hooks/Game/Timer/useForceSubmitCards";
import { service } from "setupTests";
import { expectDispatch, spyOnUseAuth } from "@/Tests/testHelpers";

describe("useForceSubmitCards", () => {
    it.each([1, 2, 3])
    ("will select randomly select cards from a players hand", async (pickAmount: number) => {
        const mockedDispatch = vi.fn();
        const spy = spyOnUseAuth(mockedDispatch);
        const blackCard = blackCardFactory({ pick: pickAmount});
        const gameId = "429749324sdf";
        const hand = transformWhiteCardArray(
            Array.from({length: 7}).map((_, idx) => whiteCardFactory({order: idx + 1}))
        );

        const {result} = kardsHookRender(useForceSubmitCards);

        await result.current(gameId, hand, blackCard);

        expect(service.submitCards).toHaveBeenCalledWith(
          gameId,
          blackCard.pick,
          expect.arrayContaining([])
        );
        expect(service.submitCards.mock.calls[0][2]).toHaveLength(pickAmount);
        expectDispatch(mockedDispatch, true);
        spy.mockRestore();
    });

    it("will catch error when endpoint fails", async () => {
        const spy = spyOnUseAuth(vi.fn());
        const consoleSpy = vi.spyOn(console, "error").mockImplementationOnce(vi.fn());
        const blackCard = blackCardFactory();
        const gameId = "429749324sdf";
        const hand = transformWhiteCardArray(
          Array.from({ length: 7 }).map((_, idx) => whiteCardFactory({ order: idx + 1 }))
        );
        service.submitCards.mockRejectedValueOnce({});
        const { result } = kardsHookRender(useForceSubmitCards);

        await result.current(gameId, hand, blackCard);

        expect(consoleSpy).toHaveBeenCalled();
        spy.mockRestore();
    });
})