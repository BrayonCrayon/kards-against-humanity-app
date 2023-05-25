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

const {data} = gameSpectatorExampleResponse;

const mockGameId = data.game.id;
jest.mock("react-router-dom", () => ({
  ...jest.requireActual("react-router-dom"), // use actual for all non-hook parts
  useParams: () => ({
    id: mockGameId,
  }),
}));

const mockListenOnEvents = jest.fn();
jest.mock("Hooks/Helpers/useListenOnEvents", () => {
  return () => mockListenOnEvents;
});

describe("SpectatorPage", () => {
  beforeEach(() => {
    service.fetchSpectatorState.mockResolvedValue(gameSpectatorExampleResponse  as AxiosResponse);
    service.fetchSubmittedCards.mockResolvedValue(submittedCardsResponse as AxiosResponse);
  });

  it("will call fetch spectator state when player refreshes and listens on game events", async () => {
    kardsRender(<SpectatorPage />);

    await waitFor(() => {
      expect(service.fetchSpectatorState).toHaveBeenCalledWith(mockGameId);
      expect(mockListenOnEvents).toHaveBeenCalledWith(mockGameId);
    });
  });

  it("will listen on game events when user gets redirected", async () => {
    await waitFor(() => {
      kardsRender(<SpectatorPage />);
    });

    expect(mockListenOnEvents).toHaveBeenCalledWith(data.game.id);
  });

  it("will display black card", async () => {
    const spectatorPage = await waitFor(() => {
      return kardsRender(<SpectatorPage />);
    });
    spectatorPage.getByText(`${data.blackCard.text}`);
  });

  it("will display submitted white cards", async () => {
    const {data: {game}} = gameSpectatorAllPlayersSubmittedExampleResponse;
    const userIds: number[] = submittedCardsResponse.data.map((item) => item.user_id);
    service.fetchSpectatorState.mockResolvedValueOnce(gameSpectatorAllPlayersSubmittedExampleResponse as AxiosResponse);

    const wrapper = kardsRender(<SpectatorPage />);

    await waitFor(() => {
      expect(fetchSubmittedCards).toHaveBeenCalledWith(game.id);
      userIds.forEach(id => expect(wrapper.queryByTestId(`player-submitted-response-${id}`)).toBeInTheDocument())
    });
  });

  it("will not display submitted white cards until all players have submitted", async () => {
    const wrapper = await waitFor(() => {
      return kardsRender(<SpectatorPage />);
    });

    expect(wrapper.queryByRole("playerSubmittedCard")).not.toBeInTheDocument()
    expect(fetchSubmittedCards).not.toHaveBeenCalled();
  });
})