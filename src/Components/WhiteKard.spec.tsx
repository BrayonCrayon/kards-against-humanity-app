import { render, RenderResult } from "@testing-library/react";
import { WhiteKard } from "./WhiteKard";
import { whiteCardFixture } from "../Api/fixtures/whiteCardFixture";

const card = whiteCardFixture[0];

const selectableWhiteKardRender = (): RenderResult => {
  return render(<WhiteKard card={card} />);
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
    const wrapper = selectableWhiteKardRender();
    expect(wrapper.queryByTestId(`white-card-${card.id}-order`)).toBeNull();
  });
});
