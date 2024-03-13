import {renderHook} from "@testing-library/react";
import useSwitchCard from "./useSwitchCard";
import {whiteCardFactory} from "Tests/Factories/WhiteCardFactory";
import {act} from "react-dom/test-utils";

jest.useFakeTimers()
describe("useSwitchCard", () => {

    it("will to set the first card when a list of cards is passed", () => {
        const cards = Array(6).fill(whiteCardFactory())
        const { result } = renderHook(useSwitchCard, {
            initialProps: cards
        });

        const { whiteCard } = result.current;

        expect(whiteCard).toEqual(cards[0]);
    });

    it("will be able to switch to the next card after 5000ms by default", async () => {
        const cards = Array(3).fill({}).map(whiteCardFactory);
        const { result, rerender } = renderHook(useSwitchCard, {
            initialProps: cards
        });

        const { whiteCard } = result.current;
        expect(whiteCard).toEqual(cards[0]);

        act(() => jest.advanceTimersByTime(5000));
        rerender();
        const { whiteCard: secondWhiteCard } = result.current;
        expect(secondWhiteCard).toEqual(cards[1])

        act(() => jest.advanceTimersByTime(5000));
        rerender();
        const { whiteCard: thirdWhiteCard } = result.current;
        expect(thirdWhiteCard).toEqual(cards[2]);
    });

    // TODO: Tests are failing fix it!!!!!!
    it("will be able to switch to the next card based on the timeout prop", async () => {
        const cards = Array(3).fill({}).map(whiteCardFactory);
        const timeout = 3000

        const { result, rerender } = renderHook(useSwitchCard, {
            initialProps: {cards, timeout}
        });

        const { whiteCard } = result.current;
        expect(whiteCard).toEqual(cards[0]);

        act(() => jest.advanceTimersByTime(timeout));
        rerender();
        const { whiteCard: secondWhiteCard } = result.current;
        expect(secondWhiteCard).toEqual(cards[1])

        act(() => jest.advanceTimersByTime(timeout));
        rerender();
        const { whiteCard: thirdWhiteCard } = result.current;
        expect(thirdWhiteCard).toEqual(cards[2]);
    });
})