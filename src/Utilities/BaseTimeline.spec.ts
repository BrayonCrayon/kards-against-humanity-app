import {BaseTimeline} from "./BaseTimeline";

class TestClass extends BaseTimeline<number> {

}

jest.useFakeTimers();

describe("BaseTimeline", () => {

    it("will set defaults if none are provided", () => {
        const target = new TestClass();

        expect(target.getTimeout()).toEqual(1000);
        expect(target.getItems()).toEqual([]);
    });

    it("will be able to iterate over to the next item in the list", () => {
        const items = Array(3).fill(0).map((_,idx) => idx + 1);
        const target = new TestClass(items);

        expect(target.getItems()).toEqual(items);

        items.forEach((item) => {
            expect(target.current()).toEqual(item);
            target.next();
            jest.advanceTimersByTime(target.getTimeout());
        })

        expect(target.current()).toEqual(null);
    });

});