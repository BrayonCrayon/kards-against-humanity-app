import { kardsRender } from "Tests/testRenders";
import { SpectatorPage } from "Pages/SpectatorPage";
import { gameSpectatorExampleResponse } from "Api/fixtures/gameSpectatorExampleResponse";
import { waitFor } from "@testing-library/react";
import { service } from "setupTests";
import { AxiosResponse } from "axios";
import { fetchSubmittedCards } from "Services/GameService";
import { submittedCardsResponse } from "Api/fixtures/submittedCardsResponse";
import {
  gameSpectatorAllPlayersSubmittedExampleResponse
} from "Api/fixtures/gameSpectatorAllPlayersSubmittedExampleResponse";
import { spyOnUseSpectate } from "Tests/testHelpers";
import { Stage } from "State/Spectate/SpectateState";

const {data} = gameSpectatorExampleResponse;

const mockGameId = data.game.id;
jest.mock("react-router-dom", () => ({
  ...jest.requireActual("react-router-dom"), // use actual for all non-hook parts
  useParams: () => ({
    id: mockGameId,
  }),
}));

jest.mock("@lottiefiles/dotlottie-react", () => ({
  DotLottieReact: () => <div></div>
}))

const mockListenOnEvents = jest.fn();
jest.mock("Hooks/Helpers/useListenOnSpectatorEvents", () => {
  return () => mockListenOnEvents;
});

describe("SpectatorPage", () => {
  beforeEach(() => {
    service.fetchSpectatorState.mockResolvedValue(gameSpectatorExampleResponse  as AxiosResponse);
    service.fetchSubmittedCards.mockResolvedValue(submittedCardsResponse as AxiosResponse);
  });

  it.skip("will call fetch spectator state when player refreshes and listens on game events", async () => {
    kardsRender(<SpectatorPage />);

    await waitFor(() => {
      expect(service.fetchSpectatorState).toHaveBeenCalledWith(mockGameId);
      expect(mockListenOnEvents).toHaveBeenCalledWith(mockGameId);
    });
  });

  it.skip("will listen on game events when user gets redirected", async () => {
    await waitFor(() => {
      kardsRender(<SpectatorPage />);
    });

    expect(mockListenOnEvents).toHaveBeenCalledWith(data.game.id);
  });

  it.skip("will display black card", async () => {
    const spectatorPage = kardsRender(<SpectatorPage />);

    await waitFor(() => {
      spectatorPage.getByText(`${data.blackCard.text}`);
    });
  });

  it.skip("will display submitted white cards", async () => {
    const {data: {game}} = gameSpectatorAllPlayersSubmittedExampleResponse;
    const userIds: number[] = submittedCardsResponse.data.map((item) => item.user_id);
    service.fetchSpectatorState.mockResolvedValueOnce(gameSpectatorAllPlayersSubmittedExampleResponse as AxiosResponse);

    const wrapper = kardsRender(<SpectatorPage />);

    await waitFor(() => {
      expect(fetchSubmittedCards).toHaveBeenCalledWith(game.id);
      userIds.forEach(id => expect(wrapper.queryByTestId(`player-submitted-response-${id}`)).toBeInTheDocument())
    });
  });

  it.skip("will not display submitted white cards until all players have submitted", async () => {
    const wrapper = await waitFor(() => {
      return kardsRender(<SpectatorPage />);
    });

    expect(wrapper.queryByRole("playerSubmittedCard")).not.toBeInTheDocument();
    expect(fetchSubmittedCards).not.toHaveBeenCalled();
  });

  it.each([
      [Stage.DISPLAY_BLACK_CARD, "black-card-0", ["submissions-display", "waiting-room", "votes-display"]],
      [Stage.DISPLAY_SUBMISSIONS, "submissions-display", ["black-card-0", "waiting-room", "votes-display"]],
      [Stage.DISPLAY_WAITING_ROOM, "waiting-room", ["submissions-display", "black-card-0", "votes-display"]],
      [Stage.DISPLAY_WINNER, "votes-display", ["submissions-display", "waiting-room", "black-card-0"]],
  ])
  ("will show only the black card when spector stage is on display black card stage for %s", async (stage, currentStage, otherStages) => {
    spyOnUseSpectate(jest.fn(), {stage})
    const wrapper = await waitFor(() => kardsRender(<SpectatorPage/>));

    expect(wrapper.queryByTestId(currentStage)).toBeInTheDocument();

    otherStages.forEach((item) => {
      expect(wrapper.queryByTestId(item)).not.toBeInTheDocument();
    })
  });
})