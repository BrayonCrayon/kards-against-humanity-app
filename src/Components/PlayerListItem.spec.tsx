import "@testing-library/jest-dom/vitest";
import { kardsRender } from "@/Tests/testRenders";
import PlayerListItem from "./PlayerListItem";
import { RenderResult, waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { gameStateExampleResponse } from "@/Api/fixtures/gameStateExampleResponse";
import { transformUser } from "@/Types/User";
import { spyOnUseAuth, spyOnUseGame } from "@/Tests/testHelpers";
import { transformBlackCard } from "@/Types/BlackCard";

const {
  data: { game, users, blackCard: blackCardResponse },
} = gameStateExampleResponse;
const blackCard = transformBlackCard(blackCardResponse);
const mockKickPlayer = vi.fn();
vi.mock("@/Hooks/Game/Actions/useKickPlayer", () => ({
  default: () => mockKickPlayer,
}));

const player = transformUser(users[0]);
const [auth] = users.filter((user) => user.id === game.judgeId);

const renderer = (user = player): RenderResult => {
  return kardsRender(<PlayerListItem player={user} />);
};

describe("PlayerListItem", () => {
  beforeEach(() => {
    vi.clearAllMocks();
    spyOnUseGame(vi.fn(), { game, blackCard, hasSpectator: false });
    spyOnUseAuth(vi.fn(), { auth, hasSubmittedCards: false });
  });

  it("will show prompt when a user is being kicked from the game", async () => {
    const wrapper = renderer();

    await userEvent.click(wrapper.getByTestId(`kick-player-${player.id}`));

    await waitFor(() => {
      expect(wrapper.queryByRole("confirm")).toBeInTheDocument();
      expect(wrapper.queryByRole("cancel")).toBeInTheDocument();
    });

    await waitFor(() => userEvent.click(wrapper.getByRole("confirm")));

    expect(mockKickPlayer).toHaveBeenCalledWith(game.id, player.id);
  });

  it("will not kick the player if the judge declines kicking the player", async () => {
    const wrapper = renderer();

    await waitFor(() => {
      userEvent.click(wrapper.getByTestId(`kick-player-${player.id}`));
    });

    await waitFor(() => {
      expect(mockKickPlayer).not.toHaveBeenCalledWith(game.id, player.id);
      userEvent.click(wrapper.getByRole("cancel"));
    });

    await waitFor(() => {
      expect(mockKickPlayer).not.toHaveBeenCalledWith(game.id, player.id);
    });
  });

  it("will show icon on user that is signed in from the users list", async () => {
    const wrapper = renderer(auth);

    await waitFor(() => {
      const isUserLoggedIn = wrapper.getByTestId(`user-${auth.id}`).getElementsByTagName("svg").length > 0;
      expect(isUserLoggedIn).toBeTruthy();
    });
  });

  it("will display the user's score", async () => {
    const wrapper = renderer(auth);

    await waitFor(() => {
      wrapper.getByText(`${auth.score}`);
    });
  });
});
