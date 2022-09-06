import { kardsHookRender } from "Tests/testRenders";
import { service } from "setupTests";
import { AxiosResponse } from "axios";
import { act } from "@testing-library/react-hooks";
import useExpansions from "Hooks/Game/Expansions/useExpansions";
import gameService from "Services/GameService";


describe("useFetchExpansions", () => {
  it("will return array of expansions and function", () => {
    const {result} = kardsHookRender(useExpansions);

    expect(result.current.expansions).toEqual([]);
    expect(result.current.expansions).toBeInstanceOf(Array);
    expect(typeof result.current.getExpansions).toBe('function');
  });

  it("will call endpoint", async () => {
    service.fetchExpansions.mockResolvedValue({ data: [] } as AxiosResponse);
    const { result } = kardsHookRender(useExpansions);

    await act(async () => {
      await result.current.getExpansions();
    });

    expect(service.fetchExpansions).toHaveBeenCalled();
  });

  it("will catch error if fetch expansions fails", async () => {
    const errorMessage = { error: "500 Server error" };
    // @ts-ignore
    gameService.fetchExpansions.mockRejectedValueOnce(errorMessage);

    const consoleSpy = jest
      .spyOn(console, "error")
      .mockImplementationOnce(() => {});
    const { result } = kardsHookRender(useExpansions);

    await result.current.getExpansions();

    expect(consoleSpy).toHaveBeenCalledWith(errorMessage);
  })
});