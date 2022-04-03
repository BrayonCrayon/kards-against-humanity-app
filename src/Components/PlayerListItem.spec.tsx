import { kardsRender } from "Tests/testRenders";
import PlayerListItem from "./PlayerListItem";
import { RenderResult, waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { gameStateExampleResponse } from "Api/fixtures/gameStateExampleResponse";
import { transformUser } from "Types/User";

const { data } = gameStateExampleResponse;
const mockKickPlayer = jest.fn();
jest.mock("Hooks/Game/useKickPlayer", () => {
  return () => {
    return mockKickPlayer;
  };
});

const mockUser = transformUser(data.judge);

jest.mock("State/User/UserContext", () => ({
  ...jest.requireActual("State/User/UserContext"),
  useUser: () => ({
    state: {
      user: mockUser,
      hasSubmittedWhiteCards: false,
    },
    dispatch: () => {},
  }),
}));

const mockGame = {
  id: data.id,
  name: data.name,
  code: data.code,
  judge_id: data.judge.id,
};
const mockJudge = transformUser(data.judge);
const mockBlackCard = data.current_black_card;

jest.mock("State/Game/GameContext", () => ({
  ...jest.requireActual("State/Game/GameContext"),
  useGame: () => ({
    state: {
      game: mockGame,
      judge: mockJudge,
      blackCard: mockBlackCard,
    },
    dispatch: () => {},
  }),
}));

const player = transformUser(gameStateExampleResponse.data.users[0]);

const renderer = (user = player): RenderResult => {
  return kardsRender(<PlayerListItem player={user} />);
};

describe("PlayerListItem", () => {
  it("will show prompt when a user is being kicked from the game", async () => {
    const wrapper = renderer();

    await waitFor(() => {
      userEvent.click(wrapper.getByTestId(`kick-player-${player.id}`));
    });

    await waitFor(() => {
      expect(mockKickPlayer).not.toHaveBeenCalledWith(mockGame.id, player.id);
      expect(wrapper.queryByText("Yes, kick!")).toBeInTheDocument();
    });

    userEvent.click(wrapper.getByText("Yes, kick!"));

    await waitFor(() => {
      expect(mockKickPlayer).toHaveBeenCalledWith(mockGame.id, player.id);
    });
  });

  it("will not kick the player if the judge declines kicking the player", async () => {
    const wrapper = renderer();

    await waitFor(() => {
      userEvent.click(wrapper.getByTestId(`kick-player-${player.id}`));
    });

    await waitFor(() => {
      expect(mockKickPlayer).not.toHaveBeenCalledWith(mockGame.id, player.id);
      expect(wrapper.queryByText("Cancel")).toBeInTheDocument();
    });

    userEvent.click(wrapper.getByText("Cancel"));

    await waitFor(() => {
      expect(mockKickPlayer).not.toHaveBeenCalledWith(mockGame.id, player.id);
    });
  });

  it("will show icon on user that is signed in from the users list", async () => {
    const wrapper = renderer(mockUser);

    await waitFor(() => {
      const isUserLoggedIn =
        wrapper.getByTestId(`user-${mockUser.id}`).getElementsByTagName("i")
          .length > 0;
      expect(isUserLoggedIn).toBeTruthy();
    });
  });
});
