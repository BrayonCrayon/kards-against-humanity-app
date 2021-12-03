import { render, RenderResult, waitFor } from "@testing-library/react";
import { WhiteKard } from "./WhiteKard";
import userEvent from "@testing-library/user-event";
import { whiteCardFixture } from "../Api/fixtures/whiteCardFixture";

const card = whiteCardFixture[0];
const whiteCardTestId = `white-card-${card.id}`;

const selectableWhiteKardRender = (): RenderResult => {
  return render(<WhiteKard card={card} />);
};

const notSelectableWhiteKardRender = (): RenderResult => {
  return render(<WhiteKard card={card} disable={true} />);
};

describe("Kards", function () {
  it("can render a card", () => {
    const { getByText } = selectableWhiteKardRender();
    getByText(card.text);
  });

  it("does not allow white kard to be selected when disabled", async () => {
    const wrapper = notSelectableWhiteKardRender();

    userEvent.click(wrapper.getByTestId(whiteCardTestId));

    await waitFor(() => {
      expect(wrapper.getByTestId(whiteCardTestId)).not.toHaveClass("border-4");
      expect(wrapper.getByTestId(whiteCardTestId)).not.toHaveClass(
        "border-blue-400"
      );
    });
  });
});
