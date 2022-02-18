import { customGameVoteRender } from "../Tests/testRenders";
import { RoundWinnerModal } from "./RoundWinnerModal";
import * as Vote from "../State/Vote/VoteContext";
import { submittedCardsResponse } from "../Api/fixtures/submittedCardsResponse";
import userEvent from "@testing-library/user-event";
import { CLEAR_STATE } from "../State/Vote/VoteActions";

const renderComponent = () => {
  return customGameVoteRender(<RoundWinnerModal />);
};

describe("RoundWinnerModal", () => {
  beforeEach(() => {
    jest.spyOn(Vote, "useVote").mockImplementation(() => ({
      dispatch: jest.fn(),
      state: {
        selectedRoundWinner: submittedCardsResponse.data[0],
        selectedPlayerId: 1,
      },
    }));
  });

  it("will render the modal", async () => {
    const wrapper = renderComponent();
    expect(
      await wrapper.findByTestId("round-winner-modal")
    ).toBeInTheDocument();
  });

  it("will render a button to close modal", () => {
    const wrapper = renderComponent();
    expect(
      wrapper.queryByTestId("round-winner-modal-close-button")
    ).toBeInTheDocument();
  });

  it("will close model when user clicks close button", async () => {
    const dispatchSpy = jest.fn();
    jest.spyOn(Vote, "useVote").mockImplementation(() => ({
      dispatch: dispatchSpy,
      state: {
        selectedRoundWinner: submittedCardsResponse.data[0],
        selectedPlayerId: 1,
      },
    }));

    const wrapper = renderComponent();

    userEvent.click(
      await wrapper.findByTestId("round-winner-modal-close-button")
    );

    expect(dispatchSpy).toHaveBeenCalledWith({
      type: CLEAR_STATE,
    });

    expect(
      wrapper.queryByTestId("round-winner-modal-close-button")
    ).toBeInTheDocument();
  });
});
