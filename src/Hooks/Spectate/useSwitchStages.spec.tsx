import { gameFactory } from "Tests/Factories/GameFactory";
import { spyOnUseGame, spyOnUsePlayers, spyOnUseSpectate } from "Tests/testHelpers";
import { blackCardFactory } from "Tests/Factories/BlackCardFactory";
import { userFactory } from "Tests/Factories/UserFactory";
import { kardsHookRender } from "Tests/testRenders";
import { useSwitchStages } from "Hooks/Spectate/useSwitchStages";

describe("useSwitchStages", () => {

  it("will switch to display submissions stage when all players have submitted their cards", () => {
    const game = gameFactory();
    spyOnUseGame(jest.fn(), { game, blackCard: blackCardFactory() });
    const spectatorMock = jest.fn();
    spyOnUseSpectate(spectatorMock)
    spyOnUsePlayers(jest.fn(), {
      players: [
        userFactory(
          {
            hasSubmittedWhiteCards: false,
            id: game.judgeId
          }),
        userFactory(
          {
            hasSubmittedWhiteCards: true
          }
        )
      ]
    });

    kardsHookRender(useSwitchStages);

    expect(spectatorMock).toBeCalledTimes(1);
  });

  it("will remain on the current stage when not all players have submitted their cards", () => {
    const game = gameFactory();
    spyOnUseGame(jest.fn(), { game, blackCard: blackCardFactory() });
    const spectatorMock = jest.fn();
    spyOnUseSpectate(spectatorMock)
    spyOnUsePlayers(jest.fn(), {
      players: [
        userFactory(
          {
            hasSubmittedWhiteCards: false,
            id: game.judgeId
          }),
        userFactory(
          {
            hasSubmittedWhiteCards: false
          }
        )
      ]
    });

    kardsHookRender(useSwitchStages);

    expect(spectatorMock).toBeCalledTimes(0);
  })
});