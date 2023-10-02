import {BaseAction} from "State/GeneralContext";
import {IHandState} from "./HandState";
import {WhiteCard} from "Types/WhiteCard";

export const HandActions = {};

export class SetHandAction extends BaseAction<IHandState, WhiteCard[]> {
  execute = (state: IHandState) => ({
    ...state,
    hand: this.currentSelectedValues(state.hand, this.payload),
  });

  private currentSelectedValues(currentState: WhiteCard[], newState: WhiteCard[]) : WhiteCard[] {
    newState.forEach((card: WhiteCard) => {
      const currentCardState = currentState.find((currentCard) => {
        return currentCard.id === card.id
      });
      card.selected = currentCardState?.selected ?? false;
      card.order = currentCardState?.order ?? 0;
    });

    return newState;
  }
}

export type HandActionTypes = SetHandAction;
