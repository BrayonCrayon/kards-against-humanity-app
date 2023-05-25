import {render, waitFor} from "@testing-library/react";
import Timer from "Components/Atoms/Timer";
import moment from "moment";
import {act} from "react-dom/test-utils";

jest.useFakeTimers().setSystemTime();
describe("Timer", () => {

  it("will display timer", async () => {
    const endTimestamp = moment().add(60, "seconds").unix();
    const wrapper = render(<Timer end={endTimestamp} />);

    expect(wrapper.getByText("1:00")).toBeInTheDocument();
  });

  it("will count down timer", async () => {
    const endTimestamp = moment().add(60, "seconds").unix();
    const wrapper = render(<Timer end={endTimestamp} />);

    act(() => jest.advanceTimersByTime(1000));

    await waitFor(() => {
      expect(wrapper.getByText("0:59")).toBeInTheDocument();
    })
  });

  it("will notify when timer has ended", async () => {
    const endTimestamp = moment().add(1, "seconds").unix();
    const callback = jest.fn();
    const wrapper = render(<Timer end={endTimestamp} onEnd={callback} />);

    act(() => jest.advanceTimersByTime(1000));

    await waitFor(() => {
      expect(wrapper.getByText("0:00")).toBeInTheDocument();
      expect(callback).toHaveBeenCalled();
    })
  });
})