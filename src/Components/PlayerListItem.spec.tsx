import { customKardsRender } from "../Tests/testRenders";
import PlayerListItem from "./PlayerListItem";
import { RenderResult, waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { IGameContext } from "../State/Game/GameContext";
import { gameStateExampleResponse } from "../Api/fixtures/gameStateExampleResponse";
import { transformUser } from "../Types/User";

window.scrollTo = jest.fn();

const mockKickPlayer = jest.fn();
jest.mock("../Hooks/Game/useKickPlayer", () => {
  return () => {
    return mockKickPlayer;
  };
});

const props = {
  judge: transformUser(gameStateExampleResponse.data.judge),
  game: {
    id: gameStateExampleResponse.data.id,
    name: gameStateExampleResponse.data.name,
    code: gameStateExampleResponse.data.code,
    judge_id: gameStateExampleResponse.data.judge.id,
  },
  user: transformUser(gameStateExampleResponse.data.judge),
};

const player = transformUser(gameStateExampleResponse.data.users[0]);

const renderer = (value?: Partial<Partial<IGameContext>>): RenderResult => {
  return customKardsRender(<PlayerListItem player={player} />, {
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
});
