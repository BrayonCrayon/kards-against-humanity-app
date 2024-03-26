import {isNull} from "lodash";

export abstract class BaseTimeline<T> {

    protected items: T[];
    private currentIdx: number|null;
    protected timeout = 1000;

    constructor(items: T[] = []) {
        this.items = items;
        this.currentIdx = this.items.length > 0 ? 0 : null;
    }

    public current(): T|null {
        return !isNull(this.currentIdx) ? this.items[this.currentIdx] : null;
    }

    public next(): void {
        if (isNull(this.currentIdx)) return;

        if (this.currentIdx === (this.items.length - 1)) {
            this.currentIdx = null;
            return;
        }

        this.currentIdx++;
    }

    public getItems(): T[] {
        return this.items;
    }

    public getTimeout(): number {
        return this.timeout;
    }

}