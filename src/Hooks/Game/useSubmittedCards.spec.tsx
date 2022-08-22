import { kardsHookRender } from "Tests/testRenders";
import useSubmittedCards from "Hooks/Game/useSubmittedCards";
import { service } from "setupTests";
import { AxiosResponse } from "axios";
import { act } from "@testing-library/react-hooks";


describe("useSubmittedCards", () => {
  it("will return array of submitted cards and callback", () => {
    const {result} = kardsHookRender(useSubmittedCards);

    expect(result.current.submittedCards).toEqual([]);
    expect(typeof result.current.getSubmittedCards).toBe('function');
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
});