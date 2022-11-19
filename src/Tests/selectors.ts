import { screen } from "@testing-library/react";

export const whiteCardTestId = (id: number) => `white-card-${id}`;
export const whiteCardOrderTestId = (id: number) => `white-card-${id}-order`;
export const cardSubmitButtonRole = (id: number) => `submit-${id}`;

export const selectedCardClass = "border-2 border-blue-400";
export const cannotSelectCardClass = "opacity-25 cursor-not-allowed";

export const getWhiteCardElement = (id: number) => screen.queryByRole(whiteCardTestId(id));

export const getCardSubmitButton = (id: number) => screen.queryByRole(cardSubmitButtonRole(id));
