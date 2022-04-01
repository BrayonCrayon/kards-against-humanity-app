import { customKardsRender } from "../Tests/testRenders";
import PlayerListItem from "./PlayerListItem";
import { RenderResult, waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { IGameContext } from "../State/Game/GameContext";
import { gameStateExampleResponse } from "../Api/fixtures/gameStateExampleResponse";
import { transformUser } from "../Types/User";

const mockKickPlayer = jest.fn();
jest.mock("../Hooks/Game/useKickPlayer", () => {
  return () => {
    return mockKickPlayer;
  };
});

const mockUser = transformUser(gameStateExampleResponse.data.judge);

jest.mock("../State/User/UserContext", () => ({
  ...jest.requireActual("../State/User/UserContext"),
  useUser: () => ({
    state: {
      user: mockUser,
      hasSubmittedWhiteCards: false,
    },
    dispatch: () => {},
  }),
}));

const props = {
  judge: transformUser(gameStateExampleResponse.data.judge),
  game: {
    id: gameStateExampleResponse.data.id,
    name: gameStateExampleResponse.data.name,
    code: gameStateExampleResponse.data.code,
    judge_id: gameStateExampleResponse.data.judge.id,
  },
};

const player = transformUser(gameStateExampleResponse.data.users[0]);

const renderer = (
  user = player,
  value?: Partial<Partial<IGameContext>>
): RenderResult => {
  return customKardsRender(<PlayerListItem player={user} />, {
    ...value,
    ...props,
  });
};

describe("PlayerListItem", () => {
  it("will show prompt when a user is being kicked from the game", async () => {
    const wrapper = renderer();

    await waitFor(() => {
      userEvent.click(wrapper.getByTestId(`kick-player-${player.id}`));
    });

    await waitFor(() => {
      expect(mockKickPlayer).not.toHaveBeenCalledWith(props.game.id, player.id);
      expect(wrapper.queryByText("Yes, kick!")).toBeInTheDocument();
    });

    userEvent.click(wrapper.getByText("Yes, kick!"));

    await waitFor(() => {
      expect(mockKickPlayer).toHaveBeenCalledWith(props.game.id, player.id);
    });
  });

  it("will not kick the player if the judge declines kicking the player", async () => {
    const wrapper = renderer();

    await waitFor(() => {
      userEvent.click(wrapper.getByTestId(`kick-player-${player.id}`));
    });

    await waitFor(() => {
      expect(mockKickPlayer).not.toHaveBeenCalledWith(props.game.id, player.id);
      expect(wrapper.queryByText("Cancel")).toBeInTheDocument();
    });

    userEvent.click(wrapper.getByText("Cancel"));

    await waitFor(() => {
      expect(mockKickPlayer).not.toHaveBeenCalledWith(props.game.id, player.id);
    });
  });

  it("will show icon on user that is signed in from the users list", async () => {
    const wrapper = renderer(props.judge);

    await waitFor(() => {
      const isUserLoggedIn =
        wrapper.getByTestId(`user-${props.judge.id}`).getElementsByTagName("i")
          .length > 0;
      expect(isUserLoggedIn).toBeTruthy();
    });
  });
});
