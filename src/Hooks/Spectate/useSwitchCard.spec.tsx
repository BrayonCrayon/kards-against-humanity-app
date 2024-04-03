import { renderHook } from "@testing-library/react";
import useSwitchCard from "./useSwitchCard";
import { whiteCardFactory } from "Tests/Factories/WhiteCardFactory";
import { act } from "react-dom/test-utils";
import { WhiteCard } from "Types/WhiteCard";

jest.useFakeTimers()
describe("useSwitchCard", () => {

    it("will to set the first card when a list of cards is passed", () => {
        const initialCards = Array(6).fill(whiteCardFactory())
        const { result } = renderHook(useSwitchCard<WhiteCard>, {
            initialProps: {initialCards}
        });

        const { card } = result.current;

        expect(card).toEqual(initialCards[0]);
    });

    it("will be able to switch to the next card after 5000ms by default", async () => {
        const initialCards = Array(3).fill({}).map(whiteCardFactory);
        const timeout = 3000;

        const { result, rerender } = renderHook(useSwitchCard<WhiteCard>, {
            initialProps: {initialCards, timeout}
        });

        const { card } = result.current;
        expect(card).toEqual(initialCards[0]);

        act(() => jest.advanceTimersByTime(5000));
        rerender({initialCards, timeout});
        const { card: secondCard } = result.current;
        expect(secondCard).toEqual(initialCards[1])

        act(() => jest.advanceTimersByTime(5000));
        rerender({initialCards, timeout});
        const { card: thirdCard } = result.current;
        expect(thirdCard).toEqual(initialCards[2]);
    });

    it("will be able to switch to the next card based on the timeout prop", async () => {
        const initialCards = Array(3).fill({}).map(whiteCardFactory);
        const timeout = 3000;

        const { result, rerender } = renderHook(useSwitchCard<WhiteCard>, {
            initialProps: {initialCards, timeout}
        });

        const { card } = result.current;
        expect(card).toEqual(initialCards[0]);

        act(() => jest.advanceTimersByTime(timeout));
        rerender({initialCards, timeout});
        const { card: secondCard } = result.current;
        expect(secondCard).toEqual(initialCards[1])

        act(() => jest.advanceTimersByTime(timeout));
        rerender({initialCards, timeout});
        const { card: thirdCard } = result.current;
        expect(thirdCard).toEqual(initialCards[2]);
    });
})