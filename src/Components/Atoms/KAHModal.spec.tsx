import { render } from "@testing-library/react";
import "@testing-library/jest-dom/vitest";
import KAHModal from "@/Components/Atoms/KAHModal";
import { vi } from "vitest";
import userEvent from "@testing-library/user-event";

describe("KAHModal", () => {
  it("will show modal", () => {
    const wrapper = render(<KAHModal show={true} />);

    expect(wrapper.queryByTestId("modal")).toBeInTheDocument();
  });

  it("will not show modal", () => {
    const wrapper = render(<KAHModal />);

    expect(wrapper.queryByTestId("modal")).not.toBeInTheDocument();
  });

  it("will call close callback when user clicks on background", async () => {
    const closeCallback = vi.fn();
    const wrapper = render(<KAHModal show={true} onClose={closeCallback} />);

    const modalBackground = await wrapper.findByTestId("modal");
    await userEvent.click(modalBackground);

    expect(closeCallback).toHaveBeenCalled();
  });
});
