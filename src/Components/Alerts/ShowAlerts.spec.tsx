import { render, waitFor } from "@testing-library/react";
import {
  AlertContext,
  IAlert,
  IAlertContext,
  initialState,
} from "../../State/Alert/AlertContext";
import ShowAlerts from "./ShowAlerts";
import AlertContextProvider from "../../State/Alert/AlertContextProvider";
import userEvent from "@testing-library/user-event";

describe("ShowAlerts", () => {
  it("shows no alerts when there are no alerts in context", () => {
    const wrapper = render(
      <AlertContext.Provider value={initialState}>
        <ShowAlerts />
      </AlertContext.Provider>
    );

    expect(wrapper.queryByTestId("alert-0")).toBeNull();
  });

  it("shows alerts when there are alerts in context", () => {
    const alerts: IAlert[] = [
      {
        type: "info",
        text: "I am a happy little alert",
      },
    ];
    const wrapper = render(
      <AlertContextProvider value={{ ...initialState, alerts }}>
        <ShowAlerts />
      </AlertContextProvider>
    );

    expect(wrapper.queryByTestId("alert-1")).not.toBeNull();
  });

  it("closes alert after clicking closing button", async () => {
    const alerts: IAlert[] = [
      {
        type: "info",
        text: "I should be here",
      },
    ];
    const wrapper = render(
      <AlertContextProvider value={{ ...initialState, alerts }}>
        <ShowAlerts />
      </AlertContextProvider>
    );

    userEvent.click(wrapper.queryByTestId("alert-1-close-button")!);

    await waitFor(() => {
      expect(wrapper.queryByTestId("alert-1")).toBeNull();
    });
  });
});
