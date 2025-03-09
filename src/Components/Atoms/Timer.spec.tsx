import "@testing-library/jest-dom/vitest";
import { render, waitFor } from "@testing-library/react";
import Timer from "@/Components/Atoms/Timer";
import moment from "moment";
import { act } from "react";
import { toMinutesSeconds } from "@/Utilities/helpers";

describe("Timer", () => {

  beforeEach(() => {
    vi.useFakeTimers();
    vi.setSystemTime(new Date())
  })

  it("will display timer", async () => {
    expect(moment().unix()).toBe(new Date().valueOf())
    const endTimestamp = moment().add(60, "seconds").unix();
    const difference = moment.unix(endTimestamp).diff(moment(), "seconds");
    console.log(toMinutesSeconds(difference));
    const wrapper = render(<Timer end={endTimestamp} />);

    expect(wrapper.getByText("1:00")).toBeInTheDocument();
  });

  it("will count down timer", async () => {
    const endTimestamp = moment().add(60, "seconds").unix();
    const wrapper = render(<Timer end={endTimestamp} />);

    await act(() => vi.advanceTimersByTime(1000));

    await waitFor(() => {
      expect(wrapper.getByText("0:59")).toBeInTheDocument();
    })
  });

  it("will notify when timer has ended", async () => {
    const endTimestamp = moment().add(1, "seconds").unix();
    const callback = vi.fn();
    const wrapper = render(<Timer end={endTimestamp} onEnd={callback} />);

    await act(() => vi.advanceTimersByTime(1000));

    await waitFor(() => {
      expect(wrapper.getByText("0:00")).toBeInTheDocument();
      expect(callback).toHaveBeenCalled();
    })
  });
})