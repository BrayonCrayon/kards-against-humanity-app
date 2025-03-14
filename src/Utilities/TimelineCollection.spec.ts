import { BaseTimeline } from "./BaseTimeline";
import { TimelineCollection } from "./TimelineCollection";
import { blackCardFactory } from "@/Tests/Factories/BlackCardFactory";
import { whiteCardFactory } from "@/Tests/Factories/WhiteCardFactory";
import { Card } from "@/Types/Card";

vi.useFakeTimers({ shouldAdvanceTime: true });
describe("TimelineCollection", () => {

    it("will be able to iterate over multiple base timelines", async ()=>{
        const whiteCards = Array(3)
            .fill(0)
            .map((_,idx) => [whiteCardFactory({ id: idx + 1 })]);
        const blackCards = Array(3)
            .fill(0)
            .map((_,idx) => [blackCardFactory({ id: idx + 1 })]);
        const whiteCardTimeline = new BaseTimeline<Card[]>(whiteCards, 5);
        const blackCardTimeline = new BaseTimeline<Card[]>(blackCards, 5);
        const whiteCardTester = vi.fn();
        const whiteCardCallback = (data?: Card|null) => { whiteCardTester(data) };
        whiteCardTimeline.setOnIteratedCallback(whiteCardCallback);

        const blackCardTester = vi.fn();
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

        expect(blackCardTester).toHaveBeenCalledTimes(3);
        expect(whiteCardTester).toHaveBeenCalledTimes(4);
    })

    it("will set the first timeline to only the first timeline that was added", () => {
        const whiteCards = Array(1).fill({}).map(() => [whiteCardFactory()]);
        const blackCards = Array(1).fill({}).map(() => [blackCardFactory()]);
        const target = new BaseTimeline<Card[]>(whiteCards, 5);
        const other = new BaseTimeline<Card[]>(blackCards, 5);
        const timeLineCollection = new TimelineCollection();

        timeLineCollection.add(target);
        timeLineCollection.add(other);

        expect(timeLineCollection.currentTimeline).not.toBeNull();
        expect(timeLineCollection.currentTimeline).toEqual(target);
    });

    it("will set the current card to the first item of the first timeline that was added", () => {
        const whiteCards = Array(1).fill({}).map(() => [whiteCardFactory()]);
        const blackCards = Array(1).fill({}).map(() => [blackCardFactory()]);
        const target = new BaseTimeline<Card[]>(whiteCards, 5);
        const other = new BaseTimeline<Card[]>(blackCards, 5);
        const timeLineCollection = new TimelineCollection();

        timeLineCollection.add(target);
        timeLineCollection.add(other);

        expect(timeLineCollection.currentCard).not.toBeNull();
        expect(timeLineCollection.currentCard).toEqual(whiteCards[0]);
    });
});