import { screen } from "@testing-library/react";

export const whiteCardTestId = (id: number) => `white-card-${id}`;
export const whiteCardOrderTestId = (id: number) => `white-card-${id}-order`;
export const cardSubmitButtonRole = (id: number) => `submit-${id}`;

export const playerSubmittedCardTestId = (id: number) => `player-submitted-response-${id}`;
export const userTestId = (id: number) => `user-${id}`;

export const selectedCardClass = "border-4 border-emerald-500";
export const cannotSelectCardClass = "opacity-25 cursor-not-allowed";

export const getWhiteCardElement = (id: number) => screen.queryByRole(whiteCardTestId(id));

export const getCardSubmitButton = (id: number) => screen.queryByTestId(cardSubmitButtonRole(id));
