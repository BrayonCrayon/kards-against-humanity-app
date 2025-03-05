import useLoading from "@/Hooks/Game/Shared/useLoading";
import {renderHook, waitFor} from "@testing-library/react";
import { act } from "react-dom/test-utils";
import { errorToast } from "@/Utilities/toasts";

describe("useLoading", () => {

  it("will return required parameters from hook", () => {
    const {result} = renderHook(useLoading);

    expect(result.current.loading).toEqual(false);
    expect(typeof result.current.handleLoad).toBe("function");
  });

  it("will call passed function into handleLoad", async () => {
    const execute = vi.fn();
    const { result: { current: { handleLoad } } } = renderHook(useLoading);

    await waitFor(async () => {
      await handleLoad(execute);
    });

    expect(execute).toHaveBeenCalled();
  });

  it("will handle error if passed function throws an error", async () => {
    const errorMessage = { msg: "error" };
    const execute = vi.fn().mockRejectedValueOnce(errorMessage);
    const { result: { current: { handleLoad } } } = renderHook(useLoading);

    await act(async () => {
      await handleLoad(execute);
    });

    expect(errorToast).toHaveBeenCalled();
  });
})