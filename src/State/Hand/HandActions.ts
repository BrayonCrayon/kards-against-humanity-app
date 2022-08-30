import { BaseAction } from "../GeneralContext";
import { IHandState } from "./HandState";
import { WhiteCard } from "../../Types/WhiteCard";

export const HandActions = {};

export class SetHandAction extends BaseAction<IHandState, WhiteCard[]> {
  execute = (state: IHandState) => ({
    ...state,
    hand: this.payload,
  });
}

export type HandActionTypes = SetHandAction;
