import {BaseTimeline} from "./BaseTimeline";
import {TimelineCollection} from "./TimelineCollection";

jest.useFakeTimers();

describe("TimelineCollection", () => {

    it("will be able to iterate over multiple base timelines", ()=>{
        const firstItems = Array(3).fill(0).map((_,idx) => idx + 1);
        const secondItems = Array(3).fill(0).map((_,idx) => idx + 1);
        const callback = jest.fn();
        const firstTarget = new BaseTimeline(firstItems);
        const secondTarget = new BaseTimeline(secondItems);
        const allTarget = new TimelineCollection([firstTarget, secondTarget])

        allTarget.forEach((item) => {
            allTarget.next();
            jest.advanceTimersByTime(target.getTimeout());
        })

        expect(callback).toHaveBeenCalledTimes(items.length);
    })
});