import { render, RenderResult } from "@testing-library/react";
import { WhiteKard } from "./WhiteKard";
import { whiteCardFixture } from "Api/fixtures/whiteCardFixture";
import { whiteCardFactory } from "Tests/Factories/WhiteCardFactory";

const card = whiteCardFixture[0];

const selectableWhiteKardRender = (): RenderResult => {
  return render(<WhiteKard card={card} onClick={() => {}} />);
};

describe("Kards", function () {
  it("can render a card", () => {
    const { getByText } = selectableWhiteKardRender();
    getByText(card.text);
  });

  it("does not show the order indicator when 0", () => {
    const wrapper = selectableWhiteKardRender();
    expect(wrapper.queryByTestId(`white-card-${card.id}-order`)).toBeNull();
  });

  it("shows order indicator when greater then 0", () => {
    card.selected = true;
    card.order = 1;
    const wrapper = selectableWhiteKardRender();
    expect(wrapper.queryByTestId(`white-card-${card.id}-order`)).not.toBeNull();
  });

  it("will hide play button", () => {
    const card = whiteCardFactory();

    const wrapper = render(<WhiteKard card={card} onClick={() => {}} hidePlayButton />);

    expect(wrapper.queryByTestId("play-button")).not.toBeInTheDocument();
  });
});
