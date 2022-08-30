import { kardsRender } from "Tests/testRenders";
import PlayerListItem from "./PlayerListItem";
import { RenderResult, waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { gameStateExampleResponse } from "Api/fixtures/gameStateExampleResponse";
import { transformUser } from "Types/User";
import { spyOnUseAuth, spyOnUseGame } from "Tests/testHelpers";

const { data: {game, users, blackCard} } = gameStateExampleResponse;
const mockKickPlayer = jest.fn();
jest.mock("Hooks/Game/useKickPlayer", () => {
  return () => {
    return mockKickPlayer;
  };
});

const player = transformUser(users[0]);
const [auth] = users.filter(user => user.id === game.judgeId);

const renderer = (user = player): RenderResult => {
  return kardsRender(<PlayerListItem player={user} />);
};

describe("PlayerListItem", () => {
  beforeEach(() => {
    spyOnUseGame(jest.fn(), { game, blackCard });
    spyOnUseAuth(jest.fn(), { auth, hasSubmittedCards: false });
  });

  it("will show prompt when a user is being kicked from the game", async () => {
    const wrapper = renderer();

    await waitFor(() => {
      userEvent.click(wrapper.getByTestId(`kick-player-${player.id}`));
    });

    await waitFor(() => {
      expect(mockKickPlayer).not.toHaveBeenCalledWith(game.id, player.id);
      expect(wrapper.queryByText("Yes, kick!")).toBeInTheDocument();
    });

    userEvent.click(wrapper.getByText("Yes, kick!"));

    await waitFor(() => {
      expect(mockKickPlayer).toHaveBeenCalledWith(game.id, player.id);
    });
  });

  it("will not kick the player if the judge declines kicking the player", async () => {
    const wrapper = renderer();

    await waitFor(() => {
      userEvent.click(wrapper.getByTestId(`kick-player-${player.id}`));
    });

    await waitFor(() => {
      expect(mockKickPlayer).not.toHaveBeenCalledWith(game.id, player.id);
      expect(wrapper.queryByText("Cancel")).toBeInTheDocument();
    });

    userEvent.click(wrapper.getByText("Cancel"));

    await waitFor(() => {
      expect(mockKickPlayer).not.toHaveBeenCalledWith(game.id, player.id);
    });
  });

  it("will show icon on user that is signed in from the users list", async () => {
    const wrapper = renderer(auth);

    await waitFor(() => {
      const isUserLoggedIn =
        wrapper.getByTestId(`user-${auth.id}`).getElementsByTagName("i")
          .length > 0;
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
