import * as usePlayers from "State/Players/usePlayers";
import { initialPlayersState, IPlayersState } from "State/Players/PlayersState";
import { IAuthState, initialAuthState } from "State/Auth/AuthState";
import * as useAuth from "State/Auth/useAuth";
import { IGameState, initialGameState } from "State/Game/GameState";
import * as useGame from "State/Game/useGame";
import * as useHand from "State/Hand/useHand";
import * as useVote from "State/Vote/useVote";
import { IHandState, initialHandState } from "State/Hand/HandState";
import { initialVoteState, IVoteState } from "State/Vote/VoteState";

export const expectDispatch = <TFunction, TPayload>(
  mockFunction: TFunction,
  payload: TPayload
) => {
  return expect(mockFunction).toHaveBeenCalledWith(
    expect.objectContaining({
      execute: expect.any(Function),
      payload
    })
  );
};

export const expectNoDispatch = <TFunction, TPayload>(
  mockFunction: TFunction,
  payload: TPayload
) => {
  return expect(mockFunction).not.toHaveBeenCalledWith(
    expect.objectContaining({
      execute: expect.any(Function),
      payload
    })
  );
};

export const spyOnUseHand = (
  state: IHandState = initialHandState,
  mockedDispatch = jest.fn()
) => {
  return spyOnState(state, mockedDispatch, useHand, "useHand");
}

export const spyOnUseAuth = (
  state: IAuthState = initialAuthState,
  mockedDispatch = jest.fn()
) => {
  return spyOnState(state, mockedDispatch, useAuth, "useAuth");
}

export const spyOnUseGame = (
  state: IGameState = initialGameState,
  mockedDispatch = jest.fn()
) => {
  return spyOnState(state, mockedDispatch, useGame, "useGame");
}

export const spyOnUseVote = (
  state: IVoteState = initialVoteState,
  mockedDispatch = jest.fn()
) => {
  return spyOnState(state, mockedDispatch, useVote, "useVote");
}

export const spyOnUsePlayers = (
  state: IPlayersState = initialPlayersState,
  mockedDispatch = jest.fn()
) => {
  return spyOnState(state, mockedDispatch, usePlayers, "usePlayers");
};

export const spyOnState = <T>(
  state: any = {},
  mockedDispatch = jest.fn(),
  hook: T,
  name: jest.FunctionPropertyNames<Required<T>>
) => {
  // todo: add a real type if someone can figure it out...
  return jest.spyOn(hook, name).mockImplementation((): any => ({
    state:{
      ...state,
    },
    dispatch: mockedDispatch
  }))
}
