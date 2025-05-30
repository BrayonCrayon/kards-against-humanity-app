import "@testing-library/jest-dom/vitest";
import { kardsRender } from "@/Tests/testRenders";
import ReviewRoom from "@/Components/Spectation/ReviewRoom";
import { blackCardFactory } from "@/Tests/Factories/BlackCardFactory";
import { submittedCardFactory } from "@/Tests/Factories/SubmittedCardFactory";
import { userFactory } from "@/Tests/Factories/UserFactory";
import { PlayerSubmittedCard } from "@/Types/ResponseTypes";
import { playerSubmittedCardTestId } from "@/Tests/selectors";
import { submittedCardsResponse } from "@/Api/fixtures/submittedCardsResponse";
import { expectDispatch, spyOnUseSpectate } from "@/Tests/testHelpers";
import { Stage } from "@/State/Spectate/SpectateState";
import { waitFor } from "@testing-library/react";
import { act } from "react";
import { service } from "@/setupTests";
import { roundWinnerExampleResponse } from "@/Api/fixtures/roundWinnerExampleResponse";
import { IWinnerIsSelectedEventData } from "@/Services/PusherService";
import { randNumber } from "@ngneat/falso";

const mocks = vi.hoisted(() => ({
  listenWhenWinnerIsSelected: vi.fn()
}))

vi.mock("@/Services/PusherService", () =>({
  listenWhenWinnerIsSelected: mocks.listenWhenWinnerIsSelected
}));

vi.useFakeTimers({ shouldAdvanceTime: true });

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
        vi.advanceTimersByTime(5000);
      });
    });
  });

  it("will switch to winner stage when a winner has been selected", async () => {
    const usersSubmission: PlayerSubmittedCard[] = submittedCardsResponse.data;
    const blackCard = blackCardFactory();
    const mockedDispatch = spyOnUseSpectate();
    // @ts-ignore
    service.roundWinner.mockResolvedValue(roundWinnerExampleResponse);
    mocks.listenWhenWinnerIsSelected.mockImplementation((gameId: string, callable: (data: IWinnerIsSelectedEventData) => {}) => {
      callable({ gameId: gameId, blackCardId:blackCard.id, userId: randNumber() });
    });

    kardsRender(<ReviewRoom gameId="394732k4jh2i3h4i23" blackCard={blackCard} submissions={usersSubmission} />);

    await waitFor(() => {
      expectDispatch(mockedDispatch, Stage.DISPLAY_WINNER);
    });
  });
});