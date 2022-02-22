import { customGameVoteRender } from "../Tests/testRenders";
import { RoundWinnerModal } from "./RoundWinnerModal";
import * as Vote from "../State/Vote/VoteContext";
import { submittedCardsResponse } from "../Api/fixtures/submittedCardsResponse";
import userEvent from "@testing-library/user-event";
import { CLEAR_STATE } from "../State/Vote/VoteActions";
import { gameStateAllPlayerSubmittedCardsExampleResponse } from "../Api/fixtures/gameStateAllPlayerSubmittedCardsExampleResponse";
import { Game } from "../Types/Game";
import { transformUser, transformUsers } from "../Types/User";

const game: Game = {
  id: gameStateAllPlayerSubmittedCardsExampleResponse.data.id,
  name: gameStateAllPlayerSubmittedCardsExampleResponse.data.name,
  code: gameStateAllPlayerSubmittedCardsExampleResponse.data.code,
  judge_id: gameStateAllPlayerSubmittedCardsExampleResponse.data.judge.id,
};
const props = {
  game,
  user: transformUser(
    gameStateAllPlayerSubmittedCardsExampleResponse.data.current_user
  ),
  users: transformUsers(
    gameStateAllPlayerSubmittedCardsExampleResponse.data.users
  ),
  judge: transformUser(
    gameStateAllPlayerSubmittedCardsExampleResponse.data.judge
  ),
  blackCard:
    gameStateAllPlayerSubmittedCardsExampleResponse.data.current_black_card,
  hand: gameStateAllPlayerSubmittedCardsExampleResponse.data.hand,
};
const renderComponent = () => {
  return customGameVoteRender(<RoundWinnerModal />, props);
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

  it("will display round winners name", () => {
    const winner = submittedCardsResponse.data[0];
    const winnerName = props.users.find((user) => {
      return user.id === winner.user_id;
    })!.name;
    jest.spyOn(Vote, "useVote").mockImplementation(() => ({
      dispatch: jest.fn,
      state: {
        selectedRoundWinner: winner,
        selectedPlayerId: 1,
      },
    }));
    const wrapper = renderComponent();

    expect(
      wrapper.getByText(`The winner is: ${winnerName}`)
    ).toBeInTheDocument();
  });

  it.todo("will call round rotation hook");
});
