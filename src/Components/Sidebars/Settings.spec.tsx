import userEvent from "@testing-library/user-event";
import { kardsRender } from "Tests/testRenders";
import Settings from "Components/Sidebars/Settings";
import { User } from "Types/User";

const mockedLeaveGame = jest.fn();
jest.mock("Hooks/Game/Actions/useLeaveGame", () => () => mockedLeaveGame);

const renderComponent = (gameId = 'alsdf83948f3f', players: User[] = []) => {
  return kardsRender(<Settings gameId={gameId} players={players} />);
}

describe('Settings', () => {

  it("will allow players to leave game", () => {
    const gameId = 'alsdf8asdfoi43jo3i4';
    const wrapper = renderComponent(gameId);

    userEvent.click(wrapper.getByRole('game-settings'));
    userEvent.click(wrapper.getByRole('leave-game-button'));

    expect(mockedLeaveGame).toHaveBeenCalled();
  });
});