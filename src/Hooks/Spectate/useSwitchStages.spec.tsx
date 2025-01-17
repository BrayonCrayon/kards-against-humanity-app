import { gameFactory } from "Tests/Factories/GameFactory";
import { expectDispatch, expectNoDispatch, spyOnUseGame, spyOnUsePlayers, spyOnUseSpectate } from "Tests/testHelpers";
import { blackCardFactory } from "Tests/Factories/BlackCardFactory";
import { userFactory } from "Tests/Factories/UserFactory";
import { kardsHookRender } from "Tests/testRenders";
import { useSwitchStages } from "Hooks/Spectate/useSwitchStages";
import { Stage } from "State/Spectate/SpectateState";
import { renderHook } from "@testing-library/react";

describe("useSwitchStages", () => {

  it("will switch to display submissions stage when all players have submitted their cards", () => {
    const dispatchMock = spyOnUseSpectate()
    const players = Array.from({ length: 4 }).map(() => userFactory({ hasSubmittedWhiteCards: true }))

    renderHook(() => useSwitchStages( players, Stage.DISPLAY_BLACK_CARD ));

    expectDispatch(dispatchMock, Stage.DISPLAY_SUBMISSIONS);
  })

  it("will not switch to display black card stage when on showing users submission stage new", () => {
    const dispatchMock = spyOnUseSpectate()
    const players = Array.from({ length: 4 }).map(() => userFactory({ hasSubmittedWhiteCards: true }))

    renderHook(() => useSwitchStages( players, Stage.DISPLAY_SUBMISSIONS ));

    expectNoDispatch(dispatchMock, Stage.DISPLAY_SUBMISSIONS);
  })

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

    expect(spectatorMock).not.toHaveBeenCalled();
  })

  it("will not switch to display black card stage when on showing users submission stage", () => {
    const game = gameFactory();
    spyOnUseGame(jest.fn(), { game, blackCard: blackCardFactory() });
    const spectatorMock = jest.fn();
    spyOnUseSpectate(spectatorMock, { stage: Stage.DISPLAY_SUBMISSIONS })
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

    expect(spectatorMock).not.toHaveBeenCalled();
  });
});