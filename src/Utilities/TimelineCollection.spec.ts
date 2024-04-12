import { BaseTimeline } from "./BaseTimeline";
import { TimelineCollection } from "./TimelineCollection";
import { whiteCardFactory } from "Tests/Factories/WhiteCardFactory";
import { blackCardFactory } from "Tests/Factories/BlackCardFactory";
import { BlackCard } from "Types/BlackCard";

// jest.useFakeTimers();
jest.setTimeout(1000000);
describe("TimelineCollection", () => {

    it("will be able to iterate over multiple base timelines", async ()=>{
        const whiteCards = Array(3)
            .fill(0)
            .map((_,idx) => whiteCardFactory({ id: idx + 1 }));
        const blackCards = Array(3)
            .fill(0)
            .map((_,idx) => blackCardFactory({ id: idx + 1 }));
        // const whiteCardTimeline = new BaseTimeline(whiteCards);
        const blackCardTimeline = new BaseTimeline(blackCards);

        const whiteCardTester = jest.fn();
        // const whiteCardCallback = (data?: WhiteCard|null) => { whiteCardTester(data) };
        // whiteCardTimeline.setOnIteratedCallback(whiteCardCallback);

        const blackCardTester = jest.fn();
        const blackCardCallback = (data?: BlackCard|null) => { blackCardTester(data) };
        blackCardTimeline.setOnIteratedCallback(blackCardCallback);

        const timelines = new TimelineCollection();
        timelines.add(BlackCard.name, blackCardTimeline);
        // timelines.add(WhiteCard.name, whiteCardTimeline);

        await timelines.start();

        blackCards.forEach((card) => {
            expect(blackCardTester).toHaveBeenCalledWith(card);
        })

        // whiteCards.forEach((card) => {
        //     expect(timelines.current()).toEqual(card);
        //     jest.advanceTimersByTime(timelines.getCurrentTimeout());
        //     expect(whiteCardTester).toHaveBeenCalledWith(card);
        // })


        expect(whiteCardTester).toHaveBeenCalledTimes(3);
        expect(blackCardTester).toHaveBeenCalledTimes(3);
    })
});