import { renderHook, waitFor } from "@testing-library/react";
import useSwitchCard from "./useSwitchCard";
import { whiteCardFactory } from "@/Tests/Factories/WhiteCardFactory";
import { blackCardFactory } from "@/Tests/Factories/BlackCardFactory";
import { TimelineCollection } from "@/Utilities/TimelineCollection";

vi.useFakeTimers({ shouldAdvanceTime: true })
describe("useSwitchCard", () => {

    it("will setup timelines when hook is called", () => {
        const whiteCards = Array(1).fill({}).map(() => [whiteCardFactory()]);
        const blackCards = Array(1).fill({}).map(blackCardFactory);
        const { result } = renderHook(useSwitchCard, {
            initialProps: { whiteCards, blackCards }
        });

        const { timeLines } = result.current;

        expect(timeLines).toBeInstanceOf(TimelineCollection);
        expect(timeLines!.items).toHaveLength(2);
    });

    it("will set the first card when a list of cards are passed", () => {
        const whiteCards = Array(3).fill({}).map(() => [whiteCardFactory()]);
        const blackCards = Array(1).fill({}).map(blackCardFactory);
        const { result } = renderHook(useSwitchCard, {
            initialProps: {whiteCards, blackCards}
        });

        const { cards } = result.current;

        expect(cards).toEqual([blackCards[0]]);
    });

    it("will call ending callback when hook has iterated through all cards", async () => {
        const whiteCards = Array(1).fill({}).map(() => [whiteCardFactory()]);
        const blackCards = Array(1).fill({}).map(blackCardFactory);
        const onFinishedCallback = vi.fn();

        const { result } = renderHook(useSwitchCard, {
            initialProps: {whiteCards, blackCards, onFinished: onFinishedCallback, timeout: 100}
        });

        const { start } = result.current;

        start()
        vi.advanceTimersByTime(1000);

        await waitFor(() => {
            expect(onFinishedCallback).toHaveBeenCalled();
        })
    });
})