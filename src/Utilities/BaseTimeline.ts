import {isNull} from "lodash";

export class BaseTimeline<T> {

    protected items: T[];
    private currentIdx: number|null;
    protected timeout: number;
    protected onIteratedCallback: (data: T|null) => void = () => {};

    constructor(items: T[] = [], timeout: number = 1000) {
        this.timeout = timeout
        this.items = items;
        this.currentIdx = -1;
    }

    public current(): T|null {
        return !isNull(this.currentIdx) && this.currentIdx >= 0 && this.currentIdx < this.items.length
            ? this.items[this.currentIdx]
            : null;
    }

    public next(): void {
        setTimeout(() => {
            if (isNull(this.currentIdx)) return;

            if (this.currentIdx === (this.items.length - 1)) {
                this.currentIdx = null;
                // TODO: Pass the current data at this time into the callback
                this.onIteratedCallback(this.current());
                return;
            }

            this.currentIdx++;
            // TODO: Pass the current data at this time into the callback
            this.onIteratedCallback(this.current());
        }, this.timeout)
    }

    public getItems(): T[] {
        return this.items;
    }

    public getTimeout(): number {
        return this.timeout;
    }

    public setOnIteratedCallback(onIteratedCallback: () => void): void {
        this.onIteratedCallback = onIteratedCallback;
    }

}