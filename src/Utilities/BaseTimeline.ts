import { delay, isNull } from "lodash";

export class BaseTimeline<T> {

  protected items: T[];
  private currentIdx: number | null;
  protected timeout: number;
  protected onIteratedCallback: (data?: T | null) => void = () => {
  };

  constructor(items: T[] = [], timeout: number = 1000) {
    this.timeout = timeout;
    this.items = items;
    this.currentIdx = this.items.length > 0 ? 0 : -1;
  }

  public current(): T | null {
    return !isNull(this.currentIdx) && this.currentIdx >= 0 && this.currentIdx < this.items.length
      ? this.items[this.currentIdx]
      : null;
  }

  public async next(): Promise<void> {
    // TODO: try using delay instead
    return new Promise((reject, resolve) => {
      delay(() => {
        if (isNull(this.currentIdx)) {
          resolve()
          return
        }

        console.log(this.currentIdx, this.items.length)
        if (this.currentIdx === (this.items.length - 1)) {
          this.onIteratedCallback(this.current());
          this.currentIdx = null;
          resolve()
          return;
        }

        this.currentIdx++;
        console.log(this.currentIdx)
        this.onIteratedCallback(this.current());
        resolve()
      }, this.timeout)
  })
  }

  public getItems(): T[] {
    return this.items;
  }

  public getTimeout(): number {
    return this.timeout;
  }

  public setOnIteratedCallback(onIteratedCallback: (data?: T | null) => void): void {
    this.onIteratedCallback = onIteratedCallback;
  }
}