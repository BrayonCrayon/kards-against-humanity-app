import { BaseTimeline } from "./BaseTimeline";

jest.setTimeout(1000000);
describe("BaseTimeline", () => {

    it("will set defaults if none are provided", () => {
        const target = new BaseTimeline();

        expect(target.getTimeout()).toEqual(1000);
        expect(target.getItems()).toEqual([]);
    });

    it("will be able to iterate over to the next item in the list", async () => {
        const items = Array(3)
            .fill(0)
            .map((_,idx) => idx + 1);
        const timeout = 5;
        const target = new BaseTimeline(items, timeout);

        expect(target.getItems()).toEqual(items);

        expect(target.current()).toEqual(items[0]);
        await target.next();
        expect(target.current()).toEqual(items[1]);
        await target.next();
        expect(target.current()).toEqual(items[2]);
        await target.next();

        expect(target.current()).toEqual(null);
    });

    it("will be able to accept a callback and call it on each iteration", async () => {
        const items = Array(3).fill(0).map((_,idx) => idx + 1);
        const callback = jest.fn();
        const target = new BaseTimeline(items, 5);
        target.setOnIteratedCallback(callback);

        for (let i = 0; i < items.length; ++i) {
            await target.next();
        }

        expect(callback).toHaveBeenCalledTimes(items.length);
        items.forEach((item) => expect(callback).toHaveBeenCalledWith(item));
    });
});