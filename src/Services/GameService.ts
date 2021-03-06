import { apiClient } from "../Api/apiClient";
import { PlayerCard, PlayerSubmittedCard, Resource, RoundWinner } from "../Types/ResponseTypes";

export const fetchSubmittedCards = (gameId: string) => {
  return apiClient.get<Array<PlayerSubmittedCard>>(
    `/api/game/${gameId}/submitted-cards`
  );
}

export const fetchState = (gameId: string) => {
  return apiClient.get(`/api/game/${gameId}`);
};

export const fetchPlayers = (gameId: string) => {
  return apiClient.get(`/api/game/${gameId}/players`);
};

export const rotate = (gameId: string) => {
  return apiClient.post(`/api/game/${gameId}/rotate`);
};

export const submitCards = (
    gameId: string,
    blackCardPickAmount: number,
    cardIds: number[]
) => {
  return apiClient.post(`/api/game/${gameId}/select`, {
    submitAmount: blackCardPickAmount,
    whiteCardIds: cardIds,
  });
};

export const redraw = (code: string) => {
  return apiClient.post<Resource<PlayerCard[]>>(`/api/game/${code}/redraw`);
}

export const roundWinner = (gameId: string, blackCardId: number) => {
  return apiClient.get<RoundWinner>(`/api/game/${gameId}/round/winner/${blackCardId}`);
}

export const kick = (gameId: string, userId: number) => {
  return apiClient.post(`/api/game/${gameId}/player/${userId}/kick`);
}

export default {
  submitCards,
  fetchState,
  fetchPlayers,
  rotate,
  redraw,
  roundWinner,
  kick,
  fetchSubmittedCards
};
