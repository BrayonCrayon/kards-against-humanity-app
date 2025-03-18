import { BaseAction } from "@/State/GeneralContext";
import { ISpectateState, Stage } from "@/State/Spectate/SpectateState";

export class ChangeStage extends BaseAction<ISpectateState, Stage> {
  execute = (state: ISpectateState) => {
    return {
      ...state,
      stage: this.payload
    };
  };
}

export type SpectateActionType = ChangeStage;