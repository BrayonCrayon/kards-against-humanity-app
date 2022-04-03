import { kardsRender } from "../Tests/testRenders";
import PlayerNotificationBar from "./PlayerNotificationBar";

const renderComponent = () => {
  return kardsRender(<PlayerNotificationBar />);
};

describe("PlayerNotificationBar", () => {
  it("renders", () => {
    const wrapper = renderComponent();
    expect(wrapper).toBeTruthy();
  });

  it("will show zero out of zero if only the judge is in the game", () => {
    const wrapper = renderComponent();

    expect(wrapper.queryByTestId("player-submitted-info")).toBeInTheDocument();
    expect(wrapper.queryByTestId("player-submitted-info")?.textContent).toEqual(
      "0/0 Players Submitted"
    );
  });
});
