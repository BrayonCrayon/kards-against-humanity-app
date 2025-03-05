import userEvent from "@testing-library/user-event";
import { kardsRender } from "@/Tests/testRenders";
import Settings from "@/Components/Sidebars/Settings";
import { User } from "@/Types/User";
import { gameStateExampleResponse } from "@/Api/fixtures/gameStateExampleResponse";
import { spyOnUseGame } from "@/Tests/testHelpers";
import { gameFactory } from "@/Tests/Factories/GameFactory";
import { blackCardFactory } from "@/Tests/Factories/BlackCardFactory";

const mockedLeaveGame = vi.fn();
vi.mock("@/Hooks/Game/Actions/useLeaveGame", () => () => mockedLeaveGame);

const renderComponent = (gameId = "alsdf83948f3f", players: User[] = []) => {
  return kardsRender(<Settings players={players} />);
};

describe("Settings", () => {
  it("will allow players to leave game", async () => {
    const game = gameFactory();
    const gameSpy = spyOnUseGame(vi.fn(), { game, blackCard: blackCardFactory() });
    const wrapper = renderComponent();

    await userEvent.click(wrapper.getByTestId("game-settings"));
    await userEvent.click(wrapper.getByTestId("settings"));
    await userEvent.click(wrapper.getByTestId("leave-game"));

    expect(mockedLeaveGame).toHaveBeenCalled();
    gameSpy.mockRestore();
  });

  it("will allow players to see other players", async function () {
    const {
      data: { game, users, blackCard },
    } = gameStateExampleResponse;
    spyOnUseGame(vi.fn(), { game, blackCard });
    const wrapper = renderComponent(game.id, users);

    await userEvent.click(wrapper.getByTestId("game-settings"));

    users.forEach((user) => {
      expect(wrapper.getByRole(`user-${user.id}`)).toBeInTheDocument();
    });
  });
});
