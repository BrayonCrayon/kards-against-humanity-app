import useFetchRoundWinner from "Hooks/Game/State/useFetchRoundWinner";
import { RoundWinner } from "Types/ResponseTypes";
import { gameFixture } from "Api/fixtures/gameFixture";
import { blackCardFixture } from "Api/fixtures/blackcardFixture";
import { kardsHookRender } from "Tests/testRenders";
import { expectDispatch, spyOnUseVote } from "Tests/testHelpers";
import { initialVoteState } from "State/Vote/VoteState";
import { service } from "setupTests";
import { roundWinnerExampleResponse } from "Api/fixtures/roundWinnerExampleResponse";

const renderUseFetchRoundWinner = () => {
  return kardsHookRender(useFetchRoundWinner);
};

const mockDispatch = jest.fn();

const mockApiData: RoundWinner = {
  submitted_cards: [],
  user_id: 0,
  black_card: roundWinnerExampleResponse.data.black_card
};

describe("useFetchRoundWinner", () => {
  beforeEach(() => {
    spyOnUseVote(mockDispatch, initialVoteState);
    // @ts-ignore
    service.roundWinner.mockResolvedValue({ data: mockApiData });
  });

  it("it will hit the api to fetch round winner", async () => {
    const gameId = gameFixture.id;
    const { result } = renderUseFetchRoundWinner();

    await result.current({
      gameId,
      userId: 2,
      blackCardId: blackCardFixture.id,
    });

    expect(service.roundWinner).toHaveBeenCalledWith(gameId, blackCardFixture.id);
    expectDispatch(mockDispatch, mockApiData);
  });

  it("will catch error if api call fails", async () => {
    const mockErrorMessage = { code: 500, message: "server failure", };
    const spyConsole = jest
      .spyOn(console, "error")
      .mockImplementation(jest.fn());
    service.roundWinner.mockRejectedValueOnce(mockErrorMessage);
    const gameId = gameFixture.id;
    const { result } = renderUseFetchRoundWinner();

    await result.current({
      gameId,
      userId: 2,
      blackCardId: blackCardFixture.id,
    });

    expect(spyConsole).toHaveBeenCalledWith(mockErrorMessage);

    spyConsole.mockRestore();
  });
});
