import { fireEvent, render, waitFor } from "@testing-library/react";
import { TimerTab } from "./TimerTab";
import { call, random } from "lodash";
import userEvent from "@testing-library/user-event";

describe("TimerTab", () => {
  it("will show time in minutes/seconds for initial slider value", async () => {
    const wrapper = render(<TimerTab onChange={() => {}} />);

    const initialValue = wrapper.getByTestId("range-timer").getAttribute("value") ?? "0";
    const date = new Date(Number.parseInt(initialValue) * 1000);

    await waitFor(() => {
      expect(wrapper.queryByText(`${date.getMinutes()}:${date.getSeconds()}`)).toBeInTheDocument();
    });
  });

  it("will adjust visual time(minutes:seconds) when slider value changes", async () => {
    const seconds = random(1, 299);
    const wrapper = render(<TimerTab onChange={() => {}} />);

    fireEvent.change(wrapper.getByTestId("range-timer"), {
      target: {
        value: seconds.toString(),
      },
    });
    const date = new Date(seconds * 1000);

    await waitFor(() => {
      expect(wrapper.queryByText(`${date.getMinutes()}:${date.getSeconds()}`)).toBeInTheDocument();
    });
  });

  it("will reset timer when user toggles off timer", async () => {
    const callback = jest.fn();
    const wrapper = render(<TimerTab onChange={callback} />);

    userEvent.click(wrapper.getByRole("toggle-timer"));

    await waitFor(() => {
      expect(callback).toHaveBeenCalledWith(0);
      expect(wrapper.getByText("00:00")).toBeInTheDocument();
    });
  });

  it("will reset timer back to original state when user toggles back on timer", async () => {
    const callback = jest.fn();
    const wrapper = render(<TimerTab onChange={callback} />);

    userEvent.click(wrapper.getByRole("toggle-timer"));
    userEvent.click(wrapper.getByRole("toggle-timer"));

    await waitFor(() => {
      expect(callback).toHaveBeenCalledWith(150);
      expect(wrapper.getByText("2:30")).toBeInTheDocument();
    });
  });
});
