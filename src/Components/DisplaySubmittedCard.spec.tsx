import DisplaySubmittedCard from "./DisplaySubmittedCard";
import { submittedCardsResponse } from "Api/fixtures/submittedCardsResponse";
import { kardsRender } from "Tests/testRenders";
import { spyOnUseGame } from "Tests/testHelpers";
import { gameStateAllPlayerSubmittedCardsExampleResponse } from "Api/fixtures/gameStateAllPlayerSubmittedCardsExampleResponse";

const {data} = submittedCardsResponse;
const {data: {game, blackCard}} = gameStateAllPlayerSubmittedCardsExampleResponse;

const renderComponent = () => {
  return kardsRender(<DisplaySubmittedCard cards={data} />);
}

describe("Submitted Card", function () {
  beforeEach(() => {
    spyOnUseGame(jest.fn(), { game, blackCard })
  })

  it("render submitted card", () => {
    const wrapper = renderComponent();
    expect(wrapper).not.toBeNull();

    const submittedCards = wrapper.queryAllByRole('playerSubmittedCard');

    expect(submittedCards).toHaveLength(data.length);
  });
});
