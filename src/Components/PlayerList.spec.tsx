import "@testing-library/jest-dom/vitest";
import { waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { kardsRender } from "@/Tests/testRenders";
import { confirmedSweetAlert, spyOnUseAuth, spyOnUseGame } from "@/Tests/testHelpers";
import { gameStateExampleResponse } from "@/Api/fixtures/gameStateExampleResponse";
import PlayerList from "./PlayerList";
import { blackCardFactory } from "@/Tests/Factories/BlackCardFactory";

const { users: players, currentUser: auth, game, blackCard: blackCardResponse } = gameStateExampleResponse.data;

const blackCard = blackCardFactory(blackCardResponse);

const mockKickPlayer = vi.fn();
vi.mock("@/Hooks/Game/Actions/useKickPlayer", () => ({
  default: () => mockKickPlayer,
}));

describe("PlayerList", () => {
  beforeEach(() => {
    vi.clearAllMocks();
    spyOnUseGame(vi.fn(), { game, blackCard, hasSpectator: false });
    spyOnUseAuth(vi.fn(), { auth, hasSubmittedCards: false });
  });

  it("will render", () => {
    const wrapper = kardsRender(<PlayerList users={players} />);
    expect(wrapper).toBeTruthy();
  });

  it("will display users", async () => {
    const wrapper = kardsRender(<PlayerList users={players} />);

    await waitFor(() => {
      players.forEach((user) => expect(wrapper.queryByTestId(`user-${user.id}`)).toBeInTheDocument());
    });
  });

  it("shows the judge icon next to the player who is the judge", async () => {
    const { container } = kardsRender(<PlayerList users={players} />);

    await waitFor(async () => {
      expect(container.querySelector("svg.fa-gavel")).not.toBeNull();
    });
  });

  it("does not show the judge icon next to the player who is not the judge", async () => {
    const nonJudgeUser = players.find((item) => item.id !== auth.id);
    const { queryByTestId } = kardsRender(<PlayerList users={players} />);

    await waitFor(async () => {
      expect(nonJudgeUser).not.toBeNull();
      expect(queryByTestId(`user-${nonJudgeUser!.id}-judge`)).toBeNull();
    });
  });

  it("Shows the users name in green when they have submitted the cards", async () => {
    players[0].hasSubmittedWhiteCards = true;
    const wrapper = kardsRender(<PlayerList users={players} />);

    const playerNameElement = wrapper.getByTestId(`user-${players[0].id}`).getElementsByTagName("p")[1];

    expect(playerNameElement).toHaveClass("text-emerald-500");
  });

  it("shows a button to kick players on users list", async () => {
    spyOnUseGame(vi.fn(), { blackCard, game: { ...game, judgeId: auth.id }, hasSpectator: false });
    const playerToKickId = players.filter((item) => item.id !== auth.id)[0].id;
    const wrapper = kardsRender(<PlayerList users={players} />);

    await waitFor(() => {
      expect(wrapper.queryByTestId(`kick-player-${playerToKickId}`)).toBeInTheDocument();
    });
  });

  it("only show kick player buttons when user is the judge", async () => {
    const wrapper = kardsRender(<PlayerList users={players} />);

    await waitFor(() => {
      players.forEach((user) => {
        expect(wrapper.queryByTestId(`kick-player-${user.id}`)).not.toBeInTheDocument();
      });
    });
  });

  it("will not show kick player on player that is the judge", async () => {
    spyOnUseGame(vi.fn(), { blackCard, game: { ...game, judgeId: auth.id }, hasSpectator: false });
    const wrapper = kardsRender(<PlayerList users={players} />);

    await waitFor(() => {
      expect(wrapper.queryByTestId(`kick-player-${auth.id}`)).not.toBeInTheDocument();
    });
  });

  it("will call api endpoint to kick player from game", async () => {
    confirmedSweetAlert(true);
    spyOnUseGame(vi.fn(), { blackCard, game: { ...game, judgeId: auth.id }, hasSpectator: false });
    const playerToKick = players.filter((item) => item.id !== auth.id)[0];
    const wrapper = kardsRender(<PlayerList users={players} />);

    await waitFor(() => {
      userEvent.click(wrapper.getByTestId(`kick-player-${playerToKick.id}`));
    });

    await waitFor(() => {
      userEvent.click(wrapper.getByRole("confirm"));
    });

    await waitFor(() => {
      expect(mockKickPlayer).toHaveBeenCalledWith(game.id, playerToKick.id);
    });
  });
});
