import { BaseTimeline } from "./BaseTimeline";
import { TimelineCollection } from "./TimelineCollection";
import { blackCardFactory } from "Tests/Factories/BlackCardFactory";
import { whiteCardFactory } from "Tests/Factories/WhiteCardFactory";
import { Card } from "Types/Card";
import { WhiteCard } from "Types/WhiteCard";
import { BlackCard } from "Types/BlackCard";

jest.setTimeout(1000000);
describe("TimelineCollection", () => {

    it("will be able to iterate over multiple base timelines", async ()=>{
        const whiteCards = Array(3)
            .fill(0)
            .map((_,idx) => whiteCardFactory({ id: idx + 1 }));
        const blackCards = Array(3)
            .fill(0)
            .map((_,idx) => blackCardFactory({ id: idx + 1 }));
        const whiteCardTimeline = new BaseTimeline<WhiteCard>(whiteCards, 5);
        const blackCardTimeline = new BaseTimeline<BlackCard>(blackCards, 5);
        const whiteCardTester = jest.fn();
        const whiteCardCallback = (data?: Card|null) => { whiteCardTester(data) };
        whiteCardTimeline.setOnIteratedCallback(whiteCardCallback);

        const blackCardTester = jest.fn();
        const blackCardCallback = (data?: Card|null) => { blackCardTester(data) };
        blackCardTimeline.setOnIteratedCallback(blackCardCallback);

        const timelines = new TimelineCollection();
        timelines.add(blackCardTimeline);
        timelines.add(whiteCardTimeline);

        await timelines.start();

        blackCards.forEach((card) => {
            expect(blackCardTester).toHaveBeenCalledWith(card);
        })

        whiteCards.forEach((card) => {
            expect(whiteCardTester).toHaveBeenCalledWith(card);
        })

        expect(whiteCardTester).toHaveBeenCalledTimes(3);
        expect(blackCardTester).toHaveBeenCalledTimes(3);
    })
});