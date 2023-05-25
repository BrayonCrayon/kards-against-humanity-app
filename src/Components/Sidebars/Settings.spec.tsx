import userEvent from "@testing-library/user-event";
import { kardsRender } from "Tests/testRenders";
import Settings from "Components/Sidebars/Settings";
import { User } from "Types/User";
import { gameStateExampleResponse } from "Api/fixtures/gameStateExampleResponse";

const mockedLeaveGame = jest.fn();
jest.mock("Hooks/Game/Actions/useLeaveGame", () => () => mockedLeaveGame);

const renderComponent = (gameId = "alsdf83948f3f", players: User[] = []) => {
  return kardsRender(<Settings gameId={gameId} players={players} />);
};

describe("Settings", () => {
  it("will allow players to leave game", async () => {
    const gameId = "alsdf8asdfoi43jo3i4";
    const wrapper = renderComponent(gameId);

    await userEvent.click(wrapper.getByTestId("game-settings"));
    await userEvent.click(wrapper.getByTestId("game"));
    await userEvent.click(wrapper.getByRole("leave-game-button"));

    expect(mockedLeaveGame).toHaveBeenCalled();
  });

  it("will allow players to see other players", async function () {
    const {
      data: { game, users },
    } = gameStateExampleResponse;
    const wrapper = renderComponent(game.id, users);

    await userEvent.click(wrapper.getByTestId("game-settings"));

    users.forEach((user) => {
      expect(wrapper.getByRole(`user-${user.id}`)).toBeInTheDocument();
    });
  });
});
