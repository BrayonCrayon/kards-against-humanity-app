import userEvent from "@testing-library/user-event";
import { whiteCardTestId } from "./selectors";
import { WhiteCard } from "@/Types/WhiteCard";
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
  // const submitButton = getCardSubmitButton(cards[cards.length - 1].id);
  const submitButton = await waitFor(() => screen.getByTestId("submit"));
  await userEvent.click(submitButton!);
};

export const setupAndSubmitForm = async (userName: string, gameCode: string, spectate: boolean = false) => {
  expect(screen.queryByTestId("join-game-form")).not.toBeNull();

  const nameInput = screen.getByRole("user-name");
  await userEvent.type(nameInput, userName);

  const codeInput = screen.getByRole("game-code-input");
  await userEvent.clear(codeInput);
  await userEvent.type(codeInput, gameCode);

  if (spectate) await userEvent.click(screen.getByTestId("is-spectator"));

  const submit = screen.getByRole("submit-form");
  await userEvent.click(submit);
};

export const togglePlayerList = async () => {
  expect(screen.queryByTestId("game-settings")).toBeInTheDocument();
  await waitFor(() => userEvent.click(screen.getByTestId("game-settings")));
};
