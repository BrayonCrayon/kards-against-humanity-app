import userEvent from "@testing-library/user-event";
import { render } from "@testing-library/react";
import ToggleSidebar from "./ToggleSidebar";

const renderToggle = (children = <div />) => {
  return render(<ToggleSidebar>{children}</ToggleSidebar>);
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

  it("supports passing children into the sidebar", () => {
    const text = "People";
    const wrapper = renderToggle(<p>{text}</p>);

    userEvent.click(wrapper.getByTestId("toggle-button"));

    expect(wrapper.getByTestId("sidebar").textContent).toContain(text);
  });

  it("can close sidebar when it is open", () => {
    const wrapper = renderToggle(<p>heelow</p>);

    userEvent.click(wrapper.getByTestId("toggle-button"));

    userEvent.click(wrapper.getByTestId("close-button"));

    expect(wrapper.queryByTestId("sidebar")).not.toBeInTheDocument();
  });

  it("can close sidebar by clicking outside the sidebar", () => {
    const wrapper = renderToggle(<p>heelow</p>);

    userEvent.click(wrapper.getByTestId("toggle-button"));

    userEvent.click(wrapper.getByTestId("sidebar-background"));

    expect(wrapper.queryByTestId("sidebar")).not.toBeInTheDocument();
  });
});
