import { kardsHookRender } from "Tests/testRenders";
import { constructWhiteCardArray } from "Types/WhiteCard";
import { gameStateJudgeExampleResponse } from "Api/fixtures/gameStateJudgeExampleResponse";
import { expectDispatch, expectNoDispatch } from "Tests/testHelpers";
import useSubmitCards from "./useSubmitCards";
import gameService from "Services/GameService";

const {
  data: {
    hand,
    id,
    hasSubmittedWhiteCards,
    submittedWhiteCardIds,
    current_black_card,
  },
} = gameStateJudgeExampleResponse;

const mockPickAmount = current_black_card.pick;
const mockHand = constructWhiteCardArray(
  hand,
  hasSubmittedWhiteCards,
  submittedWhiteCardIds
);

jest.mock("Services/GameService");

const mockDispatch = jest.fn();
jest.mock("State/User/UserContext", () => ({
  ...jest.requireActual("State/User/UserContext"),
  useUser: () => ({
    state: {
      user: {},
      hasSubmittedWhiteCards: false,
    },
    dispatch: mockDispatch,
  }),
}));

describe("useSubmitCards", () => {
  it("will submit cards", async () => {
    const { result } = kardsHookRender(useSubmitCards);

    await result.current(id, mockPickAmount, mockHand);

    expect(gameService.submitCards).toHaveBeenCalledWith(
      id,
      mockPickAmount,
      mockHand
    );
    expectDispatch(mockDispatch, true);
  });

  it("will catch error if submit cards failed", async () => {
    const errorMessage = { error: "500 Server error" };
    // @ts-ignore
    gameService.submitCards.mockRejectedValueOnce(errorMessage);
    const consoleSpy = jest
      .spyOn(console, "error")
      .mockImplementationOnce(() => {});
    const { result } = kardsHookRender(useSubmitCards);

    await result.current(id, mockPickAmount, mockHand);

    expect(gameService.submitCards).toHaveBeenCalledWith(
      id,
      mockPickAmount,
      mockHand
    );
    expectNoDispatch(mockDispatch, true);
    expect(consoleSpy).toHaveBeenCalledWith(errorMessage);
    consoleSpy.mockRestore();
  });
});
