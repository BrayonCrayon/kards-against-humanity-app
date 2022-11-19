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
  mockedDispatch = jest.fn(),
  state: IHandState = initialHandState
) => {
  spyOnState(state, mockedDispatch, useHand, "useHand");
  return mockedDispatch;
}

export const spyOnUseAuth = (
  mockedDispatch = jest.fn(),
  state: IAuthState = initialAuthState
) => {
  spyOnState(state, mockedDispatch, useAuth, "useAuth");
  return mockedDispatch;
}

export const spyOnUseGame = (
  mockedDispatch = jest.fn(),
  state: IGameState = initialGameState,
) => {
  spyOnState(state, mockedDispatch, useGame, "useGame");
  return mockedDispatch;
}

export const spyOnUseVote = (
  mockedDispatch = jest.fn(),
  state: IVoteState = initialVoteState,
) => {
  const spy = spyOnState(state, mockedDispatch, useVote, "useVote");
  return { spy, mockedDispatch };
}

export const spyOnUsePlayers = (
  mockedDispatch = jest.fn(),
  state: IPlayersState = initialPlayersState,
) => {
  spyOnState(state, mockedDispatch, usePlayers, "usePlayers");
  return mockedDispatch;
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
