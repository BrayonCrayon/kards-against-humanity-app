import { kardsHookRender } from "Tests/testRenders";
import useSubmittedCards from "Hooks/Game/State/useSubmittedCards";
import { service } from "setupTests";
import { AxiosResponse } from "axios";
import { act } from "react-dom/test-utils";
import { submittedCardsResponse } from "Api/fixtures/submittedCardsResponse";
import { PlayerSubmittedCard } from "Types/ResponseTypes";
import { SubmittedCard } from "Types/SubmittedCard";
import { WhiteCard } from "Types/WhiteCard";


describe("useSubmittedCards", () => {
  it("will return array of submitted cards and callback", () => {
    const {result} = kardsHookRender(useSubmittedCards);

    expect(result.current.submittedCards).toEqual([]);
    expect(typeof result.current.getSubmittedCards).toBe("function");
  });

  it("will call endpoint", async () => {
    service.fetchSubmittedCards.mockResolvedValue({ data: [] } as AxiosResponse);
    const gameId = "1j1j";
    const { result } = kardsHookRender(useSubmittedCards);

    await act(async () => {
      await result.current.getSubmittedCards(gameId);
    });

    expect(service.fetchSubmittedCards).toHaveBeenCalledWith(gameId);
  });

  it("will allow the white cards to be returned separately", async () => {
    service.fetchSubmittedCards.mockResolvedValue({ data: submittedCardsResponse.data } as AxiosResponse);
    const expectedResult = submittedCardsResponse.data
      .map((submittedCard: PlayerSubmittedCard) => submittedCard.submitted_cards)
      .map(
        (cards: SubmittedCard[]) =>
          cards.map((card: SubmittedCard) => new WhiteCard(card.id, card.text, card.expansionId, true, card.order))
      );
    const gameId = "1j1j";
    const { result } = kardsHookRender(useSubmittedCards);

    await act(async () => {
      await result.current.getSubmittedCards(gameId);
    });

    expect(result.current.whiteCards).toEqual(expectedResult);
  });
});