import {BaseTimeline} from "./BaseTimeline";

jest.useFakeTimers();

describe("BaseTimeline", () => {

    it("will set defaults if none are provided", () => {
        const target = new BaseTimeline();

        expect(target.getTimeout()).toEqual(1000);
        expect(target.getItems()).toEqual([]);
    });

    it("will be able to iterate over to the next item in the list", () => {
        const items = Array(3)
            .fill(0)
            .map((_,idx) => idx + 1);
        const timeout = 3000;
        const target = new BaseTimeline(items, timeout);

        expect(target.getItems()).toEqual(items);

        expect(target.current()).toEqual(null);
        target.next();
        jest.advanceTimersByTime(timeout/2);
        expect(target.current()).toEqual(null);
        jest.advanceTimersByTime(timeout/2 + 1);

        items.forEach((item) => {
            expect(target.current()).toEqual(item);
            target.next();
            jest.advanceTimersByTime(timeout/2);
            expect(target.current()).toEqual(item);
            jest.advanceTimersByTime(timeout/2);
        })

        expect(target.current()).toEqual(null);
    });

    it("will be able to accept a callback and call it on each iteration", () => {
        const items = Array(3).fill(0).map((_,idx) => idx + 1);
        const callback = jest.fn();
        const target = new BaseTimeline(items);
        target.setOnIteratedCallback(callback);

        items.forEach((item) => {
            target.next();
            jest.advanceTimersByTime(target.getTimeout());
        })

        expect(callback).toHaveBeenCalledTimes(items.length);
        items.forEach((item) => expect(callback).toHaveBeenCalledWith(item));
    });
});