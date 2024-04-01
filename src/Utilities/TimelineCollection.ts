import {BaseTimeline} from "./BaseTimeline";

export class TimelineCollection<T> {

    protected items: BaseTimeline<T>[];
    protected timeout: number;

    constructor(items: BaseTimeline<T>[] = [], timeout: number = 1000) {
        this.timeout = timeout
        this.items = items;
    }

    // TODO: Be able to iterate over each timelines list of items with it's given timeout

}