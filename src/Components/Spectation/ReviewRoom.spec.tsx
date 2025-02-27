import { kardsRender } from "Tests/testRenders";
import ReviewRoom from "Components/Spectation/ReviewRoom";
import { blackCardFactory } from "Tests/Factories/BlackCardFactory";
import { submittedCardFactory } from "Tests/Factories/SubmittedCardFactory";
import { userFactory } from "Tests/Factories/UserFactory";
import { PlayerSubmittedCard } from "Types/ResponseTypes";
import { playerSubmittedCardTestId } from "Tests/selectors";
import { submittedCardsResponse } from "Api/fixtures/submittedCardsResponse";
import { expectDispatch, spyOnUseSpectate } from "Tests/testHelpers";
import { Stage } from "State/Spectate/SpectateState";
import { waitFor } from "@testing-library/react";
import { listenWhenWinnerIsSelected } from "Services/PusherService";
import { act } from "react-dom/test-utils";

jest.mock("Services/PusherService");
jest.useFakeTimers();

describe("ReviewRoom", () => {
  it("Renders the black card", () => {
    const blackCard = blackCardFactory();
    const wrapper = kardsRender(<ReviewRoom gameId="394732k4jh2i3h4i23" blackCard={blackCard} submissions={[]} />);

    expect(wrapper.queryByTestId(`black-card-${blackCard.id}`)).toBeInTheDocument();
  });

  it("Renders the white cards", async () => {
    const usersSubmission: PlayerSubmittedCard[] = Array.from({ length: 5 })
      .map(() => ({
        user_id: userFactory().id,
        submitted_cards: Array.from({ length: 2 }).map(() => submittedCardFactory())
      }));
    const blackCard = blackCardFactory();

    const wrapper = kardsRender(<ReviewRoom gameId="394732k4jh2i3h4i23" blackCard={blackCard}
                                            submissions={usersSubmission} />);

    usersSubmission.forEach(submission => {
      expect(wrapper.queryByTestId(playerSubmittedCardTestId(submission.user_id))).toBeInTheDocument();
      act(() => {
        jest.advanceTimersByTime(5000);
      });
    });
  });

  it("will switch to winner stage when a winner has been selected", async () => {
    const usersSubmission: PlayerSubmittedCard[] = submittedCardsResponse.data;
    const blackCard = blackCardFactory();
    const mockedDispatch = spyOnUseSpectate();
    (listenWhenWinnerIsSelected as jest.Mock).mockImplementation((gameId: string, callable: () => {}) => {
      callable();
    });

    kardsRender(<ReviewRoom gameId="394732k4jh2i3h4i23" blackCard={blackCard} submissions={usersSubmission} />);

    await waitFor(() => {
      expectDispatch(mockedDispatch, Stage.DISPLAY_WINNER);
    });
  });
});