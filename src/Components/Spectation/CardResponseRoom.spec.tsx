import { kardsRender } from "Tests/testRenders";
import CardResponseRoom from "Components/Spectation/CardResponseRoom";
import { TimelineCollection } from "Utilities/TimelineCollection";
import { BaseTimeline } from "Utilities/BaseTimeline";
import { whiteCardFactory } from "Tests/Factories/WhiteCardFactory";
import { WhiteCard } from "Types/WhiteCard";
import { Card } from "Types/Card";
import { useSwitchCardProps } from "Hooks/Spectate/useSwitchCard";
import { expectDispatch, spyOnUseSpectate } from "Tests/testHelpers";
import { Stage } from "State/Spectate/SpectateState";
import { waitFor } from "@testing-library/react";

const mockHook = jest.fn();
jest.mock("Hooks/Spectate/useSwitchCard", () => (props: useSwitchCardProps) => mockHook(props));

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

describe("CardResponseRoom", () => {

  it("will not start iteration onload when timelines are provided", () => {
    const { mockStart } = mockUseSwitchCard();
    const displayAnswers = false;

    kardsRender(<CardResponseRoom showAnswers={displayAnswers} />);

    expect(mockStart).not.toHaveBeenCalled();
  });

  it("will start iteration when enabled and when timelines are provided", async () => {
    const { mockStart } = mockUseSwitchCard(true);
    const displayAnswers = true;

    kardsRender(<CardResponseRoom showAnswers={displayAnswers} />);

    expect(mockStart).toHaveBeenCalled();
  });

  it("will not start iteration when there are no timelines", () => {
    const { mockStart } = mockUseSwitchCard();
    kardsRender(<CardResponseRoom showAnswers={true} />);

    expect(mockStart).not.toHaveBeenCalled();
  });

  it("will not show responses when show answers is false", () => {
    const { timeLines } = mockUseSwitchCard(true);
    const cards = timeLines?.currentCard as WhiteCard[];

    const wrapper = kardsRender(<CardResponseRoom showAnswers={false} />);

    cards?.forEach((card) => {
      expect(wrapper.queryByText(card!.text)).toBeNull();
    })
  });

  it("will show responses when show answers is true", () => {
    const { cards } = mockUseSwitchCard(true);

    const wrapper = kardsRender(<CardResponseRoom showAnswers={true} />);

    cards!.forEach((card) => {
      expect(wrapper.queryByText(card!.text)).toBeInTheDocument();
    })
  });

  it("will show multiple answers when present", () => {
    const { cards } = mockUseSwitchCard(true, 2);

    const wrapper = kardsRender(<CardResponseRoom showAnswers={true} />);

    cards!.forEach((card) => {
      expect(wrapper.queryByText(card!.text)).toBeInTheDocument();
    })
  });

  it("will update spectator stage when switch card hook onFinished is called", async () => {
    const mockedDispatch = spyOnUseSpectate()
    mockHook.mockImplementation((props: useSwitchCardProps) => {
      props?.onFinished!()
      return {
        start: () => {},
        timeLines: [],
        cards: []
      }
    });

    kardsRender(<CardResponseRoom showAnswers={true} />);

    await waitFor(() => {
      expectDispatch(mockedDispatch, Stage.DISPLAY_WAITING_ROOM)
    })
  });
});