import { expectDispatch, expectNoDispatch, spyOnUseSpectate } from "Tests/testHelpers";
import { userFactory } from "Tests/Factories/UserFactory";
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

  it("will not switch to display black card stage when on showing users submission stage", () => {
    const dispatchMock = spyOnUseSpectate()
    const players = Array.from({ length: 4 }).map(() => userFactory({ hasSubmittedWhiteCards: true }))

    renderHook(() => useSwitchStages( players, Stage.DISPLAY_SUBMISSIONS ));

    expectNoDispatch(dispatchMock, Stage.DISPLAY_SUBMISSIONS);
  })

  it("will remain on the current stage when not all players have submitted their cards", () => {
    const dispatchMock = spyOnUseSpectate()
    const players = Array.from({ length: 4 }).map(() => userFactory({ hasSubmittedWhiteCards: false }))

    renderHook(() => useSwitchStages(players, Stage.DISPLAY_BLACK_CARD ));

    expectNoDispatch(dispatchMock, Stage.DISPLAY_SUBMISSIONS);
  })
});