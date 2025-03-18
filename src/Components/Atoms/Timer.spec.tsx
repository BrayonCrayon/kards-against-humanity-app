import "@testing-library/jest-dom/vitest";
import { render, waitFor } from "@testing-library/react";
import Timer from "@/Components/Atoms/Timer";
import { act } from "react";

vi.useFakeTimers({ shouldAdvanceTime: true });
vi.setSystemTime(new Date())

describe("Timer", () => {
  it("will display timer", async () => {
    const endTimestamp = (Date.now() / 1000) + 60;

    const wrapper = render(<Timer end={endTimestamp} />);

    expect(wrapper.getByText("1:00")).toBeInTheDocument();
  });

  it("will count down timer", async () => {
    const endTimestamp = (Date.now() / 1000) + 60;

    const wrapper = render(<Timer end={endTimestamp} />);
    await act(() => vi.advanceTimersByTime(1000));

    await waitFor(() => {
      expect(wrapper.getByText("0:59")).toBeInTheDocument();
    })
  });

  it("will notify when timer has ended", async () => {
    const endTimestamp = (Date.now() / 1000) + 1;
    const callback = vi.fn();
    const wrapper = render(<Timer end={endTimestamp} onEnd={callback} />);

    await act(() => vi.advanceTimersByTime(1000));

    await waitFor(() => {
      expect(wrapper.getByText("0:00")).toBeInTheDocument();
      expect(callback).toHaveBeenCalled();
    })
  });
})