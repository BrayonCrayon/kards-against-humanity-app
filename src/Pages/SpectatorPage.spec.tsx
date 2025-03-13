import { kardsRender } from "@/Tests/testRenders";
import { SpectatorPage } from "@/Pages/SpectatorPage";
import { gameSpectatorExampleResponse } from "@/Api/fixtures/gameSpectatorExampleResponse";
import { waitFor } from "@testing-library/react";
import { service } from "@/setupTests";
import { AxiosResponse } from "axios";
import { fetchSubmittedCards } from "@/Services/GameService";
import { submittedCardsResponse } from "@/Api/fixtures/submittedCardsResponse";
import {
  gameSpectatorAllPlayersSubmittedExampleResponse
} from "@/Api/fixtures/gameSpectatorAllPlayersSubmittedExampleResponse";
import { spyOnUseSpectate, spyOnUseVote } from "@/Tests/testHelpers";
import { Stage } from "@/State/Spectate/SpectateState";
import { roundWinnerExampleResponse } from "@/Api/fixtures/roundWinnerExampleResponse";

const {data} = gameSpectatorExampleResponse;

const mocks = vi.hoisted(() => ({
  listenOnEvents: vi.fn(),
  useParams: vi.fn()
}))

vi.mock("react-router-dom", () => ({
  ...vi.importActual("react-router-dom"), // use actual for all non-hook parts
  useParams: mocks.useParams,
}));

vi.mock("@lottiefiles/dotlottie-react", () => ({
  DotLottieReact: () => <div></div>
}))

vi.mock("@/Hooks/Helpers/useListenOnSpectatorEvents", () => ({
  default: () => mocks.listenOnEvents
}));

vi.mock("@/Services/PusherService")

describe("SpectatorPage", () => {
  beforeEach(() => {
    mocks.useParams.mockImplementation(() => ({
      id: data.game.id,
    }))
    service.fetchSpectatorState.mockResolvedValue(gameSpectatorAllPlayersSubmittedExampleResponse  as AxiosResponse);
    service.fetchSubmittedCards.mockResolvedValue(submittedCardsResponse as AxiosResponse);
    spyOnUseVote(vi.fn(), { selectedPlayerId: 0, selectedRoundWinner: roundWinnerExampleResponse.data })
  });

  it.skip("will call fetch spectator state when player refreshes and listens on game events", async () => {
    kardsRender(<SpectatorPage />);

    await waitFor(() => {
      expect(service.fetchSpectatorState).toHaveBeenCalledWith(data.game.id);
      expect(mocks.listenOnEvents).toHaveBeenCalledWith(data.game.id);
    });
  });

  it.skip("will listen on game events when user gets redirected", async () => {
    await waitFor(() => {
      kardsRender(<SpectatorPage />);
    });

    expect(mocks.listenOnEvents).toHaveBeenCalledWith(data.game.id);
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
      [Stage.DISPLAY_BLACK_CARD, "black-card-0", ["submissions-display", "waiting-room", "display-winner"]],
      [Stage.DISPLAY_SUBMISSIONS, "submissions-display", ["black-card-0", "waiting-room", "display-winner"]],
      [Stage.DISPLAY_WAITING_ROOM, "waiting-room", ["submissions-display", "black-card-0", "display-winner"]],
      [Stage.DISPLAY_WINNER, "display-winner", ["submissions-display", "waiting-room", "black-card-0"]],
  ])
  ("will show only the black card when spector stage is on display black card stage for %s", async (stage, currentStage, otherStages) => {
    spyOnUseSpectate(vi.fn(), {stage})
    const wrapper = kardsRender(<SpectatorPage/>);

    await waitFor(() => {
      expect(wrapper.queryByTestId(currentStage)).toBeInTheDocument();

      otherStages.forEach((item) => {
        expect(wrapper.queryByTestId(item)).not.toBeInTheDocument();
      })
    })
  });
})