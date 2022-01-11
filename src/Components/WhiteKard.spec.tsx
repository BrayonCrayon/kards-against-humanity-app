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
  it.todo("does not show the order indicator when 0");
});
