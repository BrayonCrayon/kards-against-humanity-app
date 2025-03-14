import "@testing-library/jest-dom/vitest";
import { kardsRender } from "@/Tests/testRenders";
import { gameSpectatorExampleResponse } from "@/Api/fixtures/gameSpectatorExampleResponse";
import { transformUsers, User } from "@/Types/User";
import SpectatePlayerList from "@/Components/Spectation/SpectatePlayerList";

const {data: {users, game}} = gameSpectatorExampleResponse;
const players = transformUsers(users);

const renderComponent = (props : {players: User[], judgeId: number} = {players, judgeId: game.judgeId}) => {
  return kardsRender(<SpectatePlayerList players={props.players} judgeId={props.judgeId} />);
}

describe("SpectatePlayerList", () => {
  it("will display user icon for players", () => {
    const wrapper = renderComponent();
    let nonJudgePlayers = users.filter(function (user) {
      return user.id !== game.judgeId;
    });

    nonJudgePlayers.forEach((player) => {
      expect(wrapper.queryByTestId(player.id)).toContainHTML("fa-user")
    })
  });

  it("will display the gavel icon for judges", () => {
    const wrapper = renderComponent();

    expect(wrapper.queryByTestId(game.judgeId)).toContainHTML("fa-gavel")
  });

  it("will display a list of users", () => {
    const wrapper = renderComponent();

    users.forEach((player) => {
      expect(wrapper.queryByText(player.name)).toBeTruthy();
    })
  });
});