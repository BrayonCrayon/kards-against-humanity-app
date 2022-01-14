import { screen } from "@testing-library/react";

export const whiteCardTestId = (id: number) => `white-card-${id}`;
export const whiteCardOrderTestId = (id: number) => `white-card-${id}-order`;

export const selectedCardClass = "border-4 border-blue-400";
export const cannotSelectCardClass = "opacity-25 cursor-not-allowed";

export const getWhiteCardElement = (id: number) =>
  screen.getByTestId(whiteCardTestId(id));
