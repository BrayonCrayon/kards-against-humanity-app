import userEvent from "@testing-library/user-event";
import { render } from "@testing-library/react";
import ToggleSidebar from "./ToggleSidebar";

const renderToggle = ({ className = "", buttonText = "" } = {}) => {
  return render(
    <ToggleSidebar buttonClass={className} buttonText={buttonText} />
  );
};

describe("ToggleSidebar", () => {
  it("side nav is hidden when component is loaded", () => {
    const wrapper = renderToggle();

    expect(wrapper.queryByTestId("side-nav")).not.toBeInTheDocument();
  });

  it("will toggle side panel", () => {
    const wrapper = renderToggle();

    const toggleButton = wrapper.getByTestId("toggle-button");
    userEvent.click(toggleButton);

    expect(wrapper.queryByTestId("side-nav")).toBeInTheDocument();
  });

  it("will allow custom classes on button", () => {
    const className = "custom-class";
    const wrapper = renderToggle({ className });

    expect(wrapper.queryByTestId("toggle-button")).toHaveClass(className);
  });

  it("will allow custom text on button", () => {
    const buttonText = "I am a button";
    const wrapper = renderToggle({ buttonText });

    expect(wrapper.queryByTestId("toggle-button")).toHaveTextContent(
      buttonText
    );
  });
});
