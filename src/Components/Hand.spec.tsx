import "@testing-library/jest-dom/vitest";
import { kardsRender } from "@/Tests/testRenders";
import Hand from "./Hand";
import { gameStateExampleResponse } from "@/Api/fixtures/gameStateExampleResponse";
import { transformWhiteCardArray, WhiteCard } from "@/Types/WhiteCard";
import userEvent from "@testing-library/user-event";
import { waitFor } from "@testing-library/react";
import { transformUser } from "@/Types/User";
import { confirmedSweetAlert, dismissSweetAlert, spyOnUseAuth, spyOnUseGame, spyOnUseHand } from "@/Tests/testHelpers";
import { getCardSubmitButton, whiteCardTestId } from "@/Tests/selectors";
import { blackCardFactory } from "@/Tests/Factories/BlackCardFactory";

const {
  data: { game, hand: handResponse, blackCard, currentUser },
} = gameStateExampleResponse;

const hand = transformWhiteCardArray(handResponse, false, []);
const auth = transformUser(currentUser);
const mocks = vi.hoisted(() => ({
  errorToast: vi.fn(),
  redraw: vi.fn(),
}));

vi.mock("@/Hooks/Game/Actions/useRedrawPlayerHand", () => ({
  default: () => mocks.redraw,
}));
vi.mock("@/Hooks/Notification/useToasts", () => ({
  useToasts: () => ({
    errorToast: mocks.errorToast,
  }),
}));

describe("Hand", () => {
  beforeEach(() => {
    spyOnUseGame(vi.fn(), { game, blackCard: blackCardFactory(blackCard), hasSpectator: false });
    spyOnUseAuth(vi.fn(), { auth, hasSubmittedCards: false });
    spyOnUseHand(vi.fn(), { hand });
  });

  afterEach(() => {
    vi.clearAllMocks();
  });

  it("will not redraw hand when user cancels confirm", async () => {
    mocks.redraw.mockClear();
    const sweetSpy = dismissSweetAlert();
    const wrapper = kardsRender(<Hand />);

    await userEvent.click(wrapper.getByTestId("redraw-button"));

    await waitFor(() => {
      expect(mocks.redraw).not.toHaveBeenCalled();
    });
    sweetSpy.mockReset();
  });

  it("will call redraw hook when user confirms to redraw", async () => {
    const sweetSpy = confirmedSweetAlert(true);
    const wrapper = kardsRender(<Hand />);

    await userEvent.click(wrapper.getByTestId("redraw-button"));

    await waitFor(() => {
      expect(mocks.redraw).toHaveBeenCalledWith(game.id);
    });
    sweetSpy.mockReset();
  });

  it("will show the remaining redraws a user can take", () => {
    auth.redrawCount = 1;
    const wrapper = kardsRender(<Hand />);

    wrapper.getByText(auth.redrawCount);
  });

  it("will show different text when user reaches limit of redraws", () => {
    auth.redrawCount = game.redrawLimit;
    const wrapper = kardsRender(<Hand />);

    wrapper.getByText(0);
  });

  it("will not allow user to redraw when they reach their limit", async () => {
    auth.redrawCount = game.redrawLimit;
    const wrapper = kardsRender(<Hand />);

    await userEvent.click(wrapper.getByTestId("redraw-button"));

    expect(mocks.errorToast).toHaveBeenCalledWith("Cannot redraw, please wait until next round.");
    expect(mocks.redraw).not.toHaveBeenCalled();
  });

  it("will only show submit button on the last card the player selected", async () => {
    const handWithSelection: WhiteCard[] = JSON.parse(JSON.stringify(hand));
    const [card] = handWithSelection;
    card.order = 1;
    card.selected = true;
    spyOnUseHand(vi.fn(), { hand: handWithSelection });
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
    spyOnUseHand(vi.fn(), { hand });
    kardsRender(<Hand />);

    hand.forEach((card) => expect(getCardSubmitButton(card.id)).not.toBeInTheDocument());
  });

  it("will not show submit button when user selects a card twice", async () => {
    const handWithSelection: WhiteCard[] = JSON.parse(JSON.stringify(hand));
    const [card] = handWithSelection;
    card.order = 2;
    card.selected = true;
    spyOnUseHand(vi.fn(), { hand: handWithSelection });
    spyOnUseGame(vi.fn(), { game, blackCard: blackCardFactory({ ...blackCard, pick: 2 }), hasSpectator: false });
    kardsRender(<Hand />);

    expect(getCardSubmitButton(card.id)).not.toBeInTheDocument();
  });
});
