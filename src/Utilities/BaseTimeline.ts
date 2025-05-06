import { isNull } from "lodash";

function sleep(ms: number) {
  return new Promise(resolve => setTimeout(resolve, ms));
}

export class BaseTimeline<T> {

  protected items: T[];
  private currentIdx: number | null;
  protected timeout: number;
  protected onIteratedCallback: (data?: T | null) => void = () => {};

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

    await sleep(this.timeout);

    if (isNull(this.currentIdx)) {
      this.onIteratedCallback(null);
      return;
    }

    if (this.currentIdx === (this.items.length - 1)) {
      this.onIteratedCallback(this.current());
      this.currentIdx = null;

      return;
    }

    this.onIteratedCallback(this.current());
    this.currentIdx++;
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