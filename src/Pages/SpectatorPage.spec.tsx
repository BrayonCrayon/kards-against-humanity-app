import { kardsRender } from "Tests/testRenders";
import { SpectatorPage } from "Pages/SpectatorPage";
import { spyOnUseGame, spyOnUsePlayers } from "Tests/testHelpers";
import { gameSpectatorExampleResponse } from "Api/fixtures/gameSpectatorExampleResponse";
import { initialGameState } from "State/Game/GameState";

const {data} = gameSpectatorExampleResponse;

describe('SpectatorPage', () => {
  beforeEach(() => {
    spyOnUsePlayers(jest.fn(), { players: data.users });
    spyOnUseGame(jest.fn(), { ...initialGameState, game:data.game  })
  })

  it('will display a list of users', () => {
    const wrapper = kardsRender(<SpectatorPage/>)

    data.users.forEach((player) => {
      expect(wrapper.queryByText(player.name)).toBeTruthy();
    })
  });

  it('will display the gavel icon for judges', () => {
    const wrapper = kardsRender(<SpectatorPage/>)
    expect(wrapper.queryByTestId(data.game.judgeId)).toContainHTML(`fas fa-gavel text-2xl`)

  });

  it("will display user icon for players", () => {
    const wrapper = kardsRender(<SpectatorPage/>)
    let players = data.users.filter(function (user) {
      return user.id !== data.game.judgeId;
    });

    players.forEach((player) => {
      expect(wrapper.queryByTestId(player.id)).toContainHTML(`fas fa-user text-2xl`)
    })
  });
})