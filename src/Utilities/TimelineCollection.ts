import { BaseTimeline } from "./BaseTimeline";
import { WhiteCard } from "Types/WhiteCard";
import { BlackCard } from "Types/BlackCard";

export class TimelineCollection {

  protected items: Map<string, (BaseTimeline<BlackCard> | BaseTimeline<WhiteCard>)> = new Map;
  protected currentCard: BlackCard | WhiteCard | null = null;
  protected currentTimeline: BaseTimeline<BlackCard> | BaseTimeline<WhiteCard> | null = null;
  // TODO: Be able to iterate over each timelines list of items with it's given timeout

  public add(key: string, timeline: BaseTimeline<BlackCard> | BaseTimeline<WhiteCard>) {
    // if (this.items.has(key)) {
    //   this.items.get(key) = (timeline);
    //   return;
    // }

    this.items.set(key, timeline);
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