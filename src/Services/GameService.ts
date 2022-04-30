import {apiClient} from "../Api/apiClient";
import {WhiteCard} from "../Types/WhiteCard";
import {PlayerCard, Resource} from "../Types/ResponseTypes";

export const fetchState = (gameId: string) => {
  return apiClient.get(`/api/game/${gameId}`);
};

export const fetchPlayers = (gameId: string) => {
  return apiClient.post(`/api/game/${gameId}/players`);
};

export const rotate = (gameId: string) => {
  return apiClient.post(`/api/game/${gameId}/rotate`);
};

export const submitCards = (
    gameId: string,
    blackCardPickAmount: number,
    hand: WhiteCard[]
) => {
  return apiClient.post(`/api/game/${gameId}/submit`, {
    submitAmount: blackCardPickAmount,
    whiteCardIds: hand
        .filter((card) => card.selected)
        .sort((leftCard, rightCard) => leftCard.order - rightCard.order)
        .map((card) => card.id),
  });
};

export const redraw = (code: string) => {
  return apiClient.post<Resource<PlayerCard[]>>(`/api/game/${code}/redraw`);
}

export default {
  submitCards,
  fetchState,
  fetchPlayers,
  rotate,
  redraw,
};
