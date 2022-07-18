import { kardsHookRender } from "Tests/testRenders";
import { transformWhiteCardArray } from "Types/WhiteCard";
import { gameStateJudgeExampleResponse } from "Api/fixtures/gameStateJudgeExampleResponse";
import { expectDispatch, expectNoDispatch, spyOnUseAuth } from "Tests/testHelpers";
import useSubmitCards from "./useSubmitCards";
import gameService from "Services/GameService";
import { initialAuthState } from "State/Auth/AuthState";

const {
  data: {
    hand,
    id,
    hasSubmittedWhiteCards,
    submittedWhiteCardIds,
    blackCard,
  },
} = gameStateJudgeExampleResponse;

const mockPickAmount = blackCard.pick;
const mockHand = transformWhiteCardArray(
    hand,
    hasSubmittedWhiteCards,
    submittedWhiteCardIds
);

const mockDispatch = jest.fn();

describe("useSubmitCards", () => {
  beforeEach(() => {
    spyOnUseAuth(initialAuthState, mockDispatch);
  });

  it("will submit cards", async () => {
    const { result } = kardsHookRender(useSubmitCards);

    await result.current(id, mockPickAmount, mockHand);

    expect(gameService.submitCards).toHaveBeenCalledWith(
      id,
      mockPickAmount,
      submittedWhiteCardIds
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
      submittedWhiteCardIds
    );
    expectNoDispatch(mockDispatch, true);
    expect(consoleSpy).toHaveBeenCalledWith(errorMessage);
    consoleSpy.mockRestore();
  });
});
