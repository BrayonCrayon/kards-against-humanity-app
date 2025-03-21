import { fireEvent, render, waitFor } from "@testing-library/react";
import { TimerSetting } from "./TimerSetting";
import { random } from "lodash";
import userEvent from "@testing-library/user-event";
import { toMinutesSeconds } from "@/Utilities/helpers";

describe("TimerTab", () => {
  it("will disable time by default", () => {
    const wrapper = render(<TimerSetting onChange={() => {}} />);

    expect(wrapper.queryByText("0:00")).toBeInTheDocument();
  });

  it.each([
    [0, 60],
    [30, 90],
    [60, 180],
    [75, 199],
  ])("will change time to between %s and %s when enabled", async (min, max) => {
    const onChange = vi.fn();
    const wrapper = render(<TimerSetting onChange={onChange} min={min} max={max} />);

    await userEvent.click(wrapper.getByRole("toggle-timer"));

    await waitFor(() => {
      expect(wrapper.queryByText(toMinutesSeconds((max + min) / 2))).toBeInTheDocument();
      expect(wrapper.getByTestId("range-timer").getAttribute("value")).toEqual(((max + min) / 2).toString());
      expect(onChange).toHaveBeenCalledWith((max + min) / 2);
    });
  });

  it("will adjust visual time(minutes:seconds) when slider value changes", async () => {
    const min = 61;
    const max = 299;
    const seconds = random(min, max);
    const wrapper = render(<TimerSetting onChange={() => {}} min={min} max={max} />);

    await userEvent.click(wrapper.getByRole("toggle-timer"));

    fireEvent.change(wrapper.getByTestId("range-timer"), {
      target: {
        value: seconds.toString(),
      },
    });
    const date = new Date(seconds * 1000);

    await waitFor(() => {
      const seconds = date.getSeconds() < 10 ? `0${date.getSeconds()}` : date.getSeconds();
      expect(wrapper.queryByText(`${date.getMinutes()}:${seconds}`)).toBeInTheDocument();
    });
  });

  it("will reset timer when user toggles off timer", async () => {
    const callback = vi.fn();
    const wrapper = render(<TimerSetting onChange={callback} />);

    await userEvent.click(wrapper.getByRole("toggle-timer"));
    await userEvent.click(wrapper.getByRole("toggle-timer"));

    await waitFor(() => {
      expect(callback).toHaveBeenCalledWith(null);
      expect(wrapper.getByText("0:00")).toBeInTheDocument();
    });
  });

  it("will reset timer back to original state when user toggles back on timer", async () => {
    const callback = vi.fn();
    const max = 60;
    const min = 0;
    const wrapper = render(<TimerSetting onChange={callback} min={min} max={max} />);

    await userEvent.click(wrapper.getByRole("toggle-timer"));

    await waitFor(() => {
      expect(callback).toHaveBeenCalledWith(max / 2);
      expect(wrapper.getByText("0:30")).toBeInTheDocument();
    });
  });

  it("shows the slider with prop value if available", function () {
    const wrapper = render(<TimerSetting onChange={() => {}} timer={69} />);

    expect(wrapper.queryByTestId("range-timer")).not.toBeDisabled();
    expect(wrapper.queryByText("1:09")).toBeInTheDocument();
    expect(parseInt(wrapper.getByTestId("range-timer").getAttribute("value")!)).toEqual(69);
  });
});
