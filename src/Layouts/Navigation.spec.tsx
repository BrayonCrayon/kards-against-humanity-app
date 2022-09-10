import { spyOnUseGame } from "Tests/testHelpers";
import { gameStateExampleResponse } from "Api/fixtures/gameStateExampleResponse";
import { kardsRender } from "Tests/testRenders";
import Navigation from "Layouts/Navigation";

const {data: {game, blackCard}} = gameStateExampleResponse;

const renderComponent = () => {
  return kardsRender(<Navigation />);
}

describe("Navigation", () => {
  it("will show navigation", () => {
    const wrapper = renderComponent();
    expect(wrapper.container.querySelector('nav')).toBeInTheDocument();
  });

  it("will not show navigation when user is playing", () => {
    spyOnUseGame(jest.fn(), { game, blackCard });
    const wrapper = renderComponent();
    expect(wrapper.container.querySelector('nav')).not.toBeInTheDocument();
  });
})