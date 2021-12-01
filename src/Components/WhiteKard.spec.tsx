import { render, RenderResult, waitFor } from "@testing-library/react";
import { WhiteKard } from "./WhiteKard";
import userEvent from "@testing-library/user-event";
import { whiteCardFixture } from "../Api/fixtures/whiteCardFixture";
import { GameContext, initialState } from "../State/Game/GameContext";
import { blackCardFixture } from "../Api/fixtures/blackcardFixture";

const card = whiteCardFixture[0];
const whiteCardTestId = `white-card-${card.id}`;

const blackCard = {
  ...blackCardFixture,
  pick: 0,
};

const selectableWhiteKardRender = (): RenderResult => {
  return render(
    <GameContext.Provider
      value={{
        ...initialState,
        hand: whiteCardFixture,
        blackCard,
      }}
    >
      <WhiteKard card={card} />
    </GameContext.Provider>
  );
};

const notSelectableWhiteKardRender = (): RenderResult => {
  return render(<WhiteKard card={card} disable={true} />);
};

describe("Kards", function () {
  it("can render a card", () => {
    const { getByText } = selectableWhiteKardRender();
    getByText(card.text);
  });

  it("can be selected", async () => {
    const wrapper = selectableWhiteKardRender();

    userEvent.click(wrapper.getByTestId(whiteCardTestId));

    await waitFor(() => {
      expect(wrapper.getByTestId(whiteCardTestId)).toHaveClass("border-4");
      expect(wrapper.getByTestId(whiteCardTestId)).toHaveClass(
        "border-blue-400"
      );
    });
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
