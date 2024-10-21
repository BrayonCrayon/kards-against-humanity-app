
export enum Stage {
  DISPLAY_BLACK_CARD = "display-black-card",
  DISPLAY_SUBMISSIONS = "display-submissions",
  DISPLAY_WAITING_ROOM = "display-waiting-room",
  DISPLAY_VOTES = "display-votes",
}

export interface ISpectateState {
  stage: Stage,
}

export const InitialSpectateState: ISpectateState = {
  stage: Stage.DISPLAY_BLACK_CARD,
}