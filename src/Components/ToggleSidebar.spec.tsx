import userEvent from "@testing-library/user-event";
import { render } from "@testing-library/react";
import ToggleSidebar from "./ToggleSidebar";

const renderToggle = ({
  className = "",
  buttonText = "",
  children = <div />,
} = {}) => {
  return render(
    <ToggleSidebar buttonClass={className} buttonText={buttonText}>
      {children}
    </ToggleSidebar>
  );
};

describe("ToggleSidebar", () => {
  it("side nav is hidden when component is loaded", () => {
    const wrapper = renderToggle();

    expect(wrapper.queryByTestId("sidebar")).not.toBeInTheDocument();
  });

  it("will toggle side panel", () => {
    const wrapper = renderToggle();

    const toggleButton = wrapper.getByTestId("toggle-button");
    userEvent.click(toggleButton);

    expect(wrapper.queryByTestId("sidebar")).toBeInTheDocument();
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

  it("supports passing children into the sidebar", () => {
    const text = "People";
    const wrapper = renderToggle({ children: <p>{text}</p> });

    userEvent.click(wrapper.getByTestId("toggle-button"));

    expect(wrapper.getByTestId("sidebar").textContent).toContain(text);
  });
});
