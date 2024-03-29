import userEvent from "@testing-library/user-event";
import { render } from "@testing-library/react";
import ToggleSidebar from "./ToggleSidebar";

const renderToggle = (children = <div />) => {
  return render(
    <ToggleSidebar dataTestId="toggle-button">{children}</ToggleSidebar>
  );
};

describe("ToggleSidebar", () => {
  it("side nav is hidden when component is loaded", () => {
    const wrapper = renderToggle();

    expect(wrapper.queryByTestId("sidebar")).not.toBeInTheDocument();
  });

  it("will toggle side panel", async () => {
    const wrapper = await renderToggle();

    const toggleButton = wrapper.getByTestId("toggle-button");
    await userEvent.click(toggleButton);

    expect(wrapper.queryByTestId("sidebar")).toBeInTheDocument();
  });

  it("supports passing children into the sidebar", async () => {
    const text = "People";
    const wrapper = renderToggle(<p>{text}</p>);

    await userEvent.click(wrapper.getByTestId("toggle-button"));

    expect(wrapper.getByTestId("sidebar").textContent).toContain(text);
  });

  it("can close sidebar when it is open", async () => {
    const wrapper = renderToggle(<p>heelow</p>);

    await userEvent.click(wrapper.getByTestId("toggle-button"));

    await userEvent.click(wrapper.getByTestId("close-button"));

    expect(wrapper.queryByTestId("sidebar")).not.toBeInTheDocument();
  });

  it("can close sidebar by clicking outside the sidebar", async () => {
    const wrapper = renderToggle(<p>heelow</p>);

    await userEvent.click(wrapper.getByTestId("toggle-button"));

    await userEvent.click(wrapper.getByTestId("sidebar-background"));

    expect(wrapper.queryByTestId("sidebar")).not.toBeInTheDocument();
  });
});
