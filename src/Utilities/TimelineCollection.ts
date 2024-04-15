import { BaseTimeline } from "./BaseTimeline";
import { Card } from "Types/Card";

export class TimelineCollection {

  protected items: BaseTimeline<Card>[] = [];
  protected currentCard: Card | null = null;
  protected currentTimeline: BaseTimeline<Card> | null = null;
  // TODO: Be able to iterate over each timelines list of items with it's given timeout

  public add(timeline: BaseTimeline<Card>) {
    this.items.push(timeline);
  }

  public async start() {
    for (const [_, timeline] of this.items.entries()) {

      this.currentTimeline = timeline;
      await this.iterateOverTimelines();

    }
  }

  public async iterateOverTimelines() {
      for (let i = 0; i < this.currentTimeline!.getItems().length; i++) {
        this.currentCard = this.currentTimeline!.current();
        await this.currentTimeline!.next();
      }
  }

  public current() {
    return this.currentTimeline?.current();
  }

  getCurrentTimeout() {
    return this.currentTimeline?.getTimeout() ?? 0;
  }
}