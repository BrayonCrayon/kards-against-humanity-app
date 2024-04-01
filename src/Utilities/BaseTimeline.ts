import {isNull} from "lodash";

export class BaseTimeline<T> {

    protected items: T[];
    private currentIdx: number|null;
    protected timeout: number;
    protected onIteratedCallback: () => void = () => {};

    constructor(items: T[] = [], timeout: number = 1000) {
        this.timeout = timeout
        this.items = items;
        this.currentIdx = this.items.length > 0 ? 0 : null;
    }

    public current(): T|null {
        return !isNull(this.currentIdx) ? this.items[this.currentIdx] : null;
    }

    public next(): void {
        setTimeout(() => {
            if (isNull(this.currentIdx)) return;

            if (this.currentIdx === (this.items.length - 1)) {
                this.currentIdx = null;
                // TODO: Pass the current data at this time into the callback
                this.onIteratedCallback();
                return;
            }

            this.currentIdx++;
            // TODO: Pass the current data at this time into the callback
            this.onIteratedCallback();
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