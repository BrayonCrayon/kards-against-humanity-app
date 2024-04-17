import { renderHook } from "@testing-library/react";
import useSwitchCard from "./useSwitchCard";
import { whiteCardFactory } from "Tests/Factories/WhiteCardFactory";
import { blackCardFactory } from "Tests/Factories/BlackCardFactory";
import { TimelineCollection } from "Utilities/TimelineCollection";

jest.useFakeTimers()
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
})