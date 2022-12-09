import userEvent from "@testing-library/user-event";
import { getCardSubmitButton, whiteCardTestId } from "./selectors";
import { WhiteCard } from "Types/WhiteCard";
import { screen, waitFor } from "@testing-library/react";

export const selectWhiteCards = async (cards: WhiteCard[]) => {
  await waitFor(() => {
    cards.forEach((item) => {
      userEvent.click(screen.getByTestId(whiteCardTestId(item.id)));
    });
  });
};

export const selectAndSubmitWhiteCards = async (cards: WhiteCard[]) => {
  await selectWhiteCards(cards);
  const submitButton = getCardSubmitButton(cards[cards.length - 1].id);
  expect(submitButton).not.toBeNull();
  userEvent.click(submitButton!);
};

export const setupAndSubmitForm = (userName: string, gameCode: string, spectate: boolean = false) => {
  expect(screen.queryByTestId("join-game-form")).not.toBeNull();

  const nameInput = screen.getByRole("user-name");
  userEvent.type(nameInput, userName);

  const codeInput = screen.getByRole("game-code-input");
  userEvent.clear(codeInput);
  userEvent.type(codeInput, gameCode);

  if(spectate) userEvent.click(screen.getByTestId("is-spectator"));

  const submit = screen.getByRole("submit-form");
  userEvent.click(submit);
};

export const togglePlayerList = async () => {
  expect(screen.queryByRole("game-settings")).toBeInTheDocument();
  await waitFor(() => {
    userEvent.click(screen.getByRole("game-settings"));
  });
  await waitFor(() => userEvent.click(screen.getByRole("players-tab")));
};
