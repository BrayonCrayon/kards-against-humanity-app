import userEvent from "@testing-library/user-event";
import { whiteCardTestId } from "./selectors";
import { WhiteCard } from "../Types/WhiteCard";
import { waitFor, screen } from "@testing-library/react";

export const selectWhiteCards = async (cards: WhiteCard[]) => {
  await waitFor(() => {
    cards.forEach((item) => {
      userEvent.click(screen.getByTestId(whiteCardTestId(item.id)));
    });
  });
};
