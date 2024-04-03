import { BaseTimeline } from "./BaseTimeline";
import { TimelineCollection } from "./TimelineCollection";
import { whiteCardFactory } from "Tests/Factories/WhiteCardFactory";
import { blackCardFactory } from "Tests/Factories/BlackCardFactory";
import { WhiteCard } from "Types/WhiteCard";
import { BlackCard } from "Types/BlackCard";

jest.useFakeTimers();

describe("TimelineCollection", () => {

    it("will be able to iterate over multiple base timelines", ()=>{
        const whiteCards = Array(3)
            .fill(0)
            .map((_,idx) => whiteCardFactory({ id: idx + 1 }));
        const blackCards = Array(3)
            .fill(0)
            .map((_,idx) => blackCardFactory({ id: idx + 1 }));
        const whiteCardTimeline = new BaseTimeline(whiteCards);
        const blackCardTimeline = new BaseTimeline(blackCards);

        const whiteCardTester = jest.fn();
        const whiteCardCallback = (data?: WhiteCard|null) => { whiteCardTester(data) };
        whiteCardTimeline.setOnIteratedCallback(whiteCardCallback);

        const blackCardTester = jest.fn();
        const blackCardCallback = (data?: BlackCard|null) => { blackCardTester(data) };
        blackCardTimeline.setOnIteratedCallback(blackCardCallback);

        const timelines = new TimelineCollection();
        timelines.add(BlackCard.name, blackCardTimeline);
        timelines.add(WhiteCard.name, whiteCardTimeline);

        /**
         * 1
         * 1000 -> iterate
         * 2
         * 1000 -> iterate
         * 3
         * 1000 -> iterate
         */

        timelines.start();

        expect(timelines.current()).toEqual(blackCards[0]);
        jest.advanceTimersByTime(timelines.getCurrentTimeout());

        for (let i = 1; i < blackCards.length; ++i) {
            expect(timelines.current()).toEqual(blackCards[i]);
            jest.advanceTimersByTime(timelines.getCurrentTimeout());
            expect(blackCardTester).toHaveBeenCalledWith(blackCards[i]);
        }
        // blackCards.forEach((card) => {
        //     expect(timelines.current()).toEqual(card);
        //     jest.advanceTimersByTime(timelines.getCurrentTimeout());
        //     expect(blackCardTester).toHaveBeenCalledWith(card);
        // })

        whiteCards.forEach((card) => {
            expect(timelines.current()).toEqual(card);
            jest.advanceTimersByTime(timelines.getCurrentTimeout());
            expect(whiteCardTester).toHaveBeenCalledWith(card);
        })


        expect(whiteCardTester).toHaveBeenCalledTimes(3);
        expect(blackCardTester).toHaveBeenCalledTimes(3);
    })
});