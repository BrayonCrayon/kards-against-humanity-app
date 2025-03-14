import { apiClient } from "@/Api/apiClient";
import { PlayerCard, PlayerSubmittedCard, Resource, RoundWinner } from "@/Types/ResponseTypes";

export const fetchSubmittedCards = (gameId: string) => {
  return apiClient.get<Array<PlayerSubmittedCard>>(`/api/game/${gameId}/submitted-cards`);
};

export const submitWinner = (gameId: string, playerId: number) => {
  return apiClient.post(`/api/game/${gameId}/winner`, {
    user_id: playerId,
  });
};

export const fetchState = (gameId: string) => {
  return apiClient.get(`/api/game/${gameId}`);
};

export const updateSettings = (gameId: string, timer: number|null) => {
  return apiClient.post(`/api/game/${gameId}/settings`, { selection_timer: timer });
}

export const fetchSpectatorState = (gameId: string) => {
  return apiClient.get(`/api/game/${gameId}/spectate`);
};

export const fetchPlayers = (gameId: string) => {
  return apiClient.get(`/api/game/${gameId}/players`);
};

export interface ICreateGameOptions {
  name: string;
  expansionIds: number[];
  timer: number|null;
  hasAnimations: boolean;
}

export const createGame = (params: ICreateGameOptions) => {
  return apiClient.post("/api/game", params);
};

export const joinGame = (code: string, userName: string) => {
  return apiClient.post(`/api/game/${code.toUpperCase()}/join`, {
    name: userName,
  });
};

export const startGame = (gameId: string) => {
  return apiClient.post(`/api/game/${gameId}/start`);
}

export const joinAsSpectator = (gameId: string) => {
  return apiClient.post(`/api/game/${gameId}/spectate`);
};

export const leaveGame = (gameId: string) => {
  return apiClient.post(`/api/game/${gameId}/leave`);
};

export const rotate = (gameId: string) => {
  return apiClient.post(`/api/game/${gameId}/rotate`);
};

export const submitCards = (gameId: string, blackCardPickAmount: number, cardIds: number[]) => {
  return apiClient.post(`/api/game/${gameId}/select`, {
    submitAmount: blackCardPickAmount,
    whiteCardIds: cardIds,
  });
};

export const redraw = (code: string) => {
  return apiClient.post<Resource<PlayerCard[]>>(`/api/game/${code}/redraw`);
};

export const roundWinner = (gameId: string, blackCardId: number) => {
  return apiClient.get<RoundWinner>(`/api/game/${gameId}/round/winner/${blackCardId}`);
};

export const kick = (gameId: string, userId: number) => {
  return apiClient.post(`/api/game/${gameId}/player/${userId}/kick`);
};

export const fetchExpansions = () => {
  return apiClient.get("/api/expansions");
};

export default {
  submitCards,
  fetchState,
  updateSettings,
  fetchPlayers,
  rotate,
  redraw,
  roundWinner,
  kick,
  fetchSubmittedCards,
  joinAsSpectator,
  joinGame,
  createGame,
  fetchSpectatorState,
  submitWinner,
  fetchExpansions,
  leaveGame,
  startGame,
};
