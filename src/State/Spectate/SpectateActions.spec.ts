import { InitialSpectateState, ISpectateState, Stage } from "@/State/Spectate/SpectateState";
import { ChangeStage } from "@/State/Spectate/SpectateActions";

describe("State Actions", () => {

  it.each([
    Stage.DISPLAY_BLACK_CARD,
    Stage.DISPLAY_SUBMISSIONS,
    Stage.DISPLAY_WINNER,
    Stage.DISPLAY_WAITING_ROOM
  ])("will change to %s stage when set stage action is called", ($stage) => {
    const initialState: ISpectateState = { ...InitialSpectateState, };
    const action = new ChangeStage($stage);

    const result = action.execute(initialState);

    expect(result).toEqual({ ...initialState, stage: $stage });
  });

})