import TabView, { ITabView, Tab } from "./TabView";
import { render } from "@testing-library/react";
import React, { FC } from "react";
import userEvent from "@testing-library/user-event";

const TestElement: FC = () => {
  return <div data-testid="123">testing</div>;
};

const renderComponent = ({ tabs }: ITabView) => {
  return render(<TabView tabs={tabs} />);
};
describe("TabView", () => {
  it("will render out jsx element", () => {
    const tabs: Tab[] = [{ key: "test-nav", element: <TestElement />, className: "test" }];

    const component = renderComponent({ tabs });

    expect(component.queryByTestId("123")).toBeInTheDocument();
    expect(component.container.querySelector(".test")).toBeInTheDocument();
  });

  it("will render out jsx elements conditionally", () => {
    const tabs: Tab[] = [
      {
        key: "tab-key-1",
        element: () => {
          return <div data-testid="tab-1">tab 1</div>;
        },
      },
      {
        key: "tab-key-2",
        element: () => {
          return <div data-testid="tab-2">tab 2</div>;
        },
      },
    ];

    const wrapper = renderComponent({ tabs });

    expect(wrapper.queryByTestId("tab-1")).toBeInTheDocument();
    expect(wrapper.queryByTestId("tab-2")).not.toBeInTheDocument();

    userEvent.click(wrapper.getByText("tab-key-2"));

    expect(wrapper.queryByTestId("tab-1")).not.toBeInTheDocument();
    expect(wrapper.queryByTestId("tab-2")).toBeInTheDocument();
  });
});
