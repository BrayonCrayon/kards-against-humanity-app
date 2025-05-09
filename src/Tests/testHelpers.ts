import { initialPlayersState, IPlayersState } from "@/State/Players/PlayersState";
import { IAuthState, initialAuthState } from "@/State/Auth/AuthState";
import { IGameState, initialGameState } from "@/State/Game/GameState";
import { IHandState, initialHandState } from "@/State/Hand/HandState";
import { initialVoteState, IVoteState } from "@/State/Vote/VoteState";
import { InitialSpectateState, ISpectateState } from "@/State/Spectate/SpectateState";
import * as usePlayers from "@/State/Players/usePlayers";
import * as useAuth from "@/State/Auth/useAuth";
import * as useGame from "@/State/Game/useGame";
import * as useHand from "@/State/Hand/useHand";
import * as useVote from "@/State/Vote/useVote";
import * as useSpectate from "@/State/Spectate/useSpectate";
import * as useNotifications from "@/State/Notifications/useNotifications";
import Swal from "sweetalert2";
import { vi } from "vitest";
import { initialNotificationsState, INotificationsState } from "@/State/Notifications/NotificationsState";

export const expectDispatch = <TFunction, TPayload>(mockFunction: TFunction, payload: TPayload) => {
  return expect(mockFunction).toHaveBeenCalledWith(
    expect.objectContaining({
      execute: expect.any(Function),
      payload,
    }),
  );
};

export const expectNoDispatch = <TFunction, TPayload>(mockFunction: TFunction, payload: TPayload) => {
  return expect(mockFunction).not.toHaveBeenCalledWith(
    expect.objectContaining({
      execute: expect.any(Function),
      payload,
    }),
  );
};

export const spyOnUseHand = (mockedDispatch = vi.fn(), state: IHandState = initialHandState) => {
  spyOnState(state, mockedDispatch, useHand, "useHand");
  return mockedDispatch;
};

export const spyOnUseAuth = (mockedDispatch = vi.fn(), state: IAuthState = initialAuthState) => {
  spyOnState(state, mockedDispatch, useAuth, "useAuth");
  return mockedDispatch;
};

export const spyOnUseGame = (mockedDispatch = vi.fn(), state: IGameState = initialGameState) => {
  spyOnState(state, mockedDispatch, useGame, "useGame");
  return mockedDispatch;
};

export const spyOnUseVote = (mockedDispatch = vi.fn(), state: IVoteState = initialVoteState) => {
  spyOnState(state, mockedDispatch, useVote, "useVote");
  return mockedDispatch;
};

export const spyOnUsePlayers = (mockedDispatch = vi.fn(), state: IPlayersState = initialPlayersState) => {
  spyOnState(state, mockedDispatch, usePlayers, "usePlayers");
  return mockedDispatch;
};

export const spyOnUseSpectate = (mockedDispatch = vi.fn(), state: ISpectateState = InitialSpectateState) => {
  spyOnState(state, mockedDispatch, useSpectate, "useSpectate");
  return mockedDispatch;
};

export const spyOnUseNotifications = (
  mockedDispatch = vi.fn(),
  state: INotificationsState = initialNotificationsState,
) => {
  spyOnState(state, mockedDispatch, useNotifications, "useNotifications");
  return mockedDispatch;
};

export const spyOnState = <T extends object>(state: any = {}, mockedDispatch = vi.fn(), hook: T, name: keyof T) => {
  return vi.spyOn(hook, name).mockImplementation((): any => ({
    state: {
      ...state,
    },
    dispatch: mockedDispatch,
  }));
};

export const confirmedSweetAlert = (confirmed: boolean) => {
  return vi.spyOn(Swal, "fire").mockResolvedValueOnce({
    isConfirmed: confirmed,
    isDenied: false,
    isDismissed: false,
  });
};

export const dismissSweetAlert = () => {
  return vi.spyOn(Swal, "fire").mockResolvedValueOnce({
    isConfirmed: false,
    isDenied: false,
    isDismissed: true,
  });
};
