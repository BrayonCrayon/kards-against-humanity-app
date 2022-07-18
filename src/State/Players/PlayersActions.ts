import { User } from "../../Types/User";
import { BaseAction } from "../GeneralContext";
import { IPlayersState } from "State/Players/PlayersState";

export class KickPlayerAction extends BaseAction<IPlayersState, number> {
  execute = (state: IPlayersState) => ({
    ...state,
    players: state.players.filter((item) => item.id !== this.payload),
  });
}

export class SetPlayersAction extends BaseAction<IPlayersState, User[]> {
  execute = (state: IPlayersState) => ({
    ...state,
    players: this.payload,
  });
}

export type PlayersActionTypes = KickPlayerAction | SetPlayersAction;
