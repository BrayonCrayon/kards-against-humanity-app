import { customGameVoteRender } from "../Tests/testRenders";
import { RoundWinnerModal } from "./RoundWinnerModal";
import * as Vote from "../State/Vote/VoteContext";
import { submittedCardsResponse } from "../Api/fixtures/submittedCardsResponse";

const renderComponent = () => {
  return customGameVoteRender(<RoundWinnerModal />);
};
describe("RoundWinnerModal", () => {
  it("will render the modal", async () => {
    jest.spyOn(Vote, "useVote").mockImplementation(() => ({
      dispatch: jest.fn(),
      state: {
        selectedPlayerId: 1,
        selectedRoundWinner: submittedCardsResponse.data[0],
      },
    }));
    const wrapper = renderComponent();
    expect(
      await wrapper.findByTestId("round-winner-modal")
    ).toBeInTheDocument();
  });
});
