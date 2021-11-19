import { IAlert } from "../../State/Alert/AlertContext";
import Alert from "./Alert";
import { render } from "@testing-library/react";

describe("Alert", () => {
  it("displays alert text", () => {
    const alert: IAlert = {
      type: "info",
      text: "Hello there",
    };
    const wrapper = render(<Alert alert={alert} id={1} />);
    expect(wrapper.queryByText(alert.text)).toBeInTheDocument();
  });
});
