import FloatingButton from "Components/Atoms/FloatingButton";
import { render } from "@testing-library/react";
import userEvent from "@testing-library/user-event";

const initialProps = { showButton: false, onClick: () => {} };

const renderComponent = ({ showButton, onClick}: { showButton: boolean, onClick: () => void } = initialProps) => {
  return render(<FloatingButton showButton={showButton} onClick={onClick} />);
}

describe("FloatingButton", function() {

  it("will not show button on initial load", () => {
    const wrapper = renderComponent();

    expect(wrapper.queryByRole("button")).not.toBeInTheDocument();
  });

  it("will show button when toggle is true", () => {
    const wrapper = renderComponent({ ...initialProps, showButton: true });

    expect(wrapper.queryByRole("button")).toBeInTheDocument();
  });

  it("will call passed in click handler when button is pressed", async () => {
    const onClick = jest.fn();
    const wrapper = renderComponent({ showButton: true, onClick });

    await userEvent.click(wrapper.getByRole("button"));

    expect(onClick).toHaveBeenCalled();
  });
});