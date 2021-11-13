import { render } from "@testing-library/react";
import {
  AlertContext,
  IAlert,
  initialState,
} from "../../State/Alert/AlertContext";
import ShowAlerts from "./ShowAlerts";

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
      <AlertContext.Provider value={{ alerts }}>
        <ShowAlerts />
      </AlertContext.Provider>
    );

    expect(wrapper.queryByTestId("alert-1")).not.toBeNull();
  });
});
