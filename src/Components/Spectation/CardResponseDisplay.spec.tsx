import { kardsRender } from "Tests/testRenders";
import CardResponseDisplay from "Components/Spectation/CardResponseDisplay";
import { TimelineCollection } from "Utilities/TimelineCollection";
import { BaseTimeline } from "Utilities/BaseTimeline";
import { whiteCardFactory } from "Tests/Factories/WhiteCardFactory";
import { WhiteCard } from "Types/WhiteCard";
import { Card } from "Types/Card";

const mockHook = jest.fn();
jest.mock("Hooks/Spectate/useSwitchCard", () => () => mockHook());

const mockUseSwitchCard = (hasTimeLines: boolean = false, cardCount: number = 1) => {
  const mockStart = jest.fn();
  let timeLines: TimelineCollection | undefined;
  let cards: WhiteCard[] | undefined;

  if (hasTimeLines) {
    timeLines = new TimelineCollection();
    cards = Array.from({ length: cardCount }).map((_, idx) => whiteCardFactory({ id: idx + 1 }));
    timeLines.add(new BaseTimeline<Card[]>([cards]));
  }

  mockHook.mockImplementation(() => ({
    start: mockStart,
    timeLines,
    cards
  }));

  return {
    mockStart,
    timeLines,
    cards
  };
};

describe("CardResponseDisplay", () => {

  it("will not start iteration onload when timelines are provided", () => {
    const { mockStart } = mockUseSwitchCard();
    const displayAnswers = false;

    kardsRender(<CardResponseDisplay showAnswers={displayAnswers} />);

    expect(mockStart).not.toHaveBeenCalled();
  });

  it("will start iteration when enabled and when timelines are provided", async () => {
    const { mockStart } = mockUseSwitchCard(true);
    const displayAnswers = true;

    kardsRender(<CardResponseDisplay showAnswers={displayAnswers} />);

    expect(mockStart).toHaveBeenCalled();
  });

  it("will not start iteration when there are no timelines", () => {
    const { mockStart } = mockUseSwitchCard();
    kardsRender(<CardResponseDisplay showAnswers={true} />);

    expect(mockStart).not.toHaveBeenCalled();
  });

  it("will not show responses when show answers is false", () => {
    const { timeLines } = mockUseSwitchCard(true);
    const cards = timeLines?.currentCard as WhiteCard[];

    const wrapper = kardsRender(<CardResponseDisplay showAnswers={false} />);

    cards?.forEach((card) => {
      expect(wrapper.queryByText(card!.text)).toBeNull();
    })
  });

  it("will show responses when show answers is true", () => {
    const { cards } = mockUseSwitchCard(true);

    const wrapper = kardsRender(<CardResponseDisplay showAnswers={true} />);

    cards!.forEach((card) => {
      expect(wrapper.queryByText(card!.text)).toBeInTheDocument();
    })
  });

  it("will show multiple answers when present", () => {
    const { cards } = mockUseSwitchCard(true, 2);

    const wrapper = kardsRender(<CardResponseDisplay showAnswers={true} />);

    cards!.forEach((card) => {
      expect(wrapper.queryByText(card!.text)).toBeInTheDocument();
    })
  });
});