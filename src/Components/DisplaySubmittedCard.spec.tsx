import DisplaySubmittedCard from "./DisplaySubmittedCard";
import { submittedCardsResponse } from "@/Api/fixtures/submittedCardsResponse";
import { kardsRender } from "@/Tests/testRenders";
import { spyOnUseGame } from "@/Tests/testHelpers";
import {
  gameStateAllPlayerSubmittedCardsExampleResponse
} from "@/Api/fixtures/gameStateAllPlayerSubmittedCardsExampleResponse";

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
    const userIds = data.map(item => item.user_id);
    const wrapper = renderComponent();
    expect(wrapper).not.toBeNull();

    userIds.forEach(id => {
      expect(wrapper.queryByTestId(`player-submitted-response-${id}`)).toBeInTheDocument();
    })
  });
});
