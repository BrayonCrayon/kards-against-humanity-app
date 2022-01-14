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

export const selectAndSubmitWhiteCards = async (cards: WhiteCard[]) => {
  await selectWhiteCards(cards);
  userEvent.click(screen.getByTestId("white-card-submit-btn"));
};

export const setupAndSubmitForm = (userName: string, gameCode: string) => {
  expect(screen.queryByTestId("join-game-form")).not.toBeNull();

  const nameInput = screen.queryByTestId("join-game-name-input");
  expect(nameInput).not.toBeNull();
  userEvent.type(nameInput!, userName);

  const codeInput = screen.queryByTestId("join-game-code-input");
  expect(codeInput).not.toBeNull();
  userEvent.type(codeInput!, gameCode);

  const submit = screen.getByTestId("join-game-form-submit");
  userEvent.click(submit);
};
