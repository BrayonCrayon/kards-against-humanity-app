import WinnerRoom from "Components/Spectation/WinnerRoom";
import { render } from "@testing-library/react";
import { userFactory } from "Tests/Factories/UserFactory";
import { whiteCardFactory } from "Tests/Factories/WhiteCardFactory";
import { whiteCardTestId } from "Tests/selectors";


describe("WinnerRoom", () => {
  it("will render out component", () => {
    const winner = userFactory();
    const cards = Array.from({length: 3}).map(() => whiteCardFactory())
    const wrapper = render(<WinnerRoom player={winner} cards={cards} />);

    expect(wrapper.queryByText(winner.name)).toBeInTheDocument();
    cards.forEach((card) => {
      expect(wrapper.queryByTestId(whiteCardTestId(card.id))).toBeInTheDocument();
    })
  });
})