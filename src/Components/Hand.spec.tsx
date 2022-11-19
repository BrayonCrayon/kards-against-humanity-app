import { kardsRender } from "Tests/testRenders";
import Hand from "./Hand";
import { gameStateExampleResponse } from "Api/fixtures/gameStateExampleResponse";
import { transformWhiteCardArray, WhiteCard } from "Types/WhiteCard";
import userEvent from "@testing-library/user-event";
import { waitFor } from "@testing-library/react";
import { transformUser } from "Types/User";
import { errorToast } from "Utilities/toasts";
import { spyOnUseAuth, spyOnUseGame, spyOnUseHand } from "Tests/testHelpers";
import { getCardSubmitButton, whiteCardTestId } from "Tests/selectors";

const {
  data: { game, hand: handResponse, blackCard, currentUser },
} = gameStateExampleResponse;

const hand = transformWhiteCardArray(handResponse, false, []);
const auth = transformUser(currentUser);

const mockRedraw = jest.fn();
jest.mock("Hooks/Game/Actions/useRedrawPlayerHand", () => () => mockRedraw);
jest.mock("Utilities/toasts");

describe("Hand", () => {
  beforeEach(() => {
    spyOnUseGame(jest.fn(), { game, blackCard });
    spyOnUseAuth(jest.fn(), { auth, hasSubmittedCards: false });
    spyOnUseHand(jest.fn(), { hand });
  });

  it("will prompt user to confirm to redraw", () => {
    const wrapper = kardsRender(<Hand />);

    userEvent.click(wrapper.getByTestId("redraw-button"));

    wrapper.getByText("Are you sure you want to redraw?");
  });

  it("will not redraw hand when user cancels confirm", async () => {
    const wrapper = kardsRender(<Hand />);

    userEvent.click(wrapper.getByTestId("redraw-button"));

    await waitFor(() => {
      userEvent.click(wrapper.getByText("Cancel"));
    });

    await waitFor(() => {
      expect(mockRedraw).not.toHaveBeenCalled();
    });
  });

  it("will call redraw hook when user confirms to redraw", async () => {
    const wrapper = kardsRender(<Hand />);

    userEvent.click(wrapper.getByTestId("redraw-button"));

    userEvent.click(wrapper.getByText("Yes"));

    await waitFor(() => {
      expect(mockRedraw).toHaveBeenCalledWith(game.id);
    });
  });

  it("will show the remaining redraws a user can take", () => {
    auth.redrawCount = 1;
    const wrapper = kardsRender(<Hand />);

    wrapper.getByText(`${auth.redrawCount} Redraws Left`);
  });

  it("will show different text when user reaches limit of redraws", () => {
    auth.redrawCount = game.redrawLimit;
    const wrapper = kardsRender(<Hand />);

    wrapper.getByText("0 Redraws Left");
  });

  it("will not allow user to redraw when they reach their limit", () => {
    auth.redrawCount = game.redrawLimit;
    const wrapper = kardsRender(<Hand />);

    userEvent.click(wrapper.getByTestId("redraw-button"));

    expect(errorToast).toHaveBeenCalledWith("Cannot redraw, please wait until next round.");
    expect(wrapper.queryByText("Yes")).not.toBeInTheDocument();
  });

  it("will only show submit button on the last card the player selected", async () => {
    const handWithSelection: WhiteCard[] = JSON.parse(JSON.stringify(hand));
    const [card] = handWithSelection;
    card.order = 1;
    card.selected = true;
    spyOnUseHand(jest.fn(), { hand: handWithSelection });
    const wrapper = kardsRender(<Hand />);

    userEvent.click(wrapper.getByRole(whiteCardTestId(card.id)));

    expect(getCardSubmitButton(card.id)).toBeInTheDocument();
    handWithSelection
      .filter((item) => item.id !== card.id)
      .forEach((item) => {
        expect(getCardSubmitButton(item.id)).not.toBeInTheDocument();
      });
  });

  it("will not show submit button when card limit has not been reached", async () => {
    spyOnUseHand(jest.fn(), { hand });
    kardsRender(<Hand />);

    hand.forEach((card) => expect(getCardSubmitButton(card.id)).not.toBeInTheDocument());
  });

  it("will not show submit button when user selects a card twice", async () => {
    const handWithSelection: WhiteCard[] = JSON.parse(JSON.stringify(hand));
    const [card] = handWithSelection;
    card.order = 2;
    card.selected = true;
    spyOnUseHand(jest.fn(), { hand: handWithSelection });
    spyOnUseGame(jest.fn(), { game, blackCard: { ...blackCard, pick: 2 } });
    kardsRender(<Hand />);

    expect(getCardSubmitButton(card.id)).not.toBeInTheDocument();
  });
});
