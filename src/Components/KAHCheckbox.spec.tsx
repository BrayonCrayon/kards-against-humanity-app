import React from "react";
import { render, waitFor } from "@testing-library/react";
import { KAHCheckbox } from "@/Components/KAHCheckbox";
import userEvent from "@testing-library/user-event";


describe("KAHCheckbox", () => {
  it("will render", () => {
    const wrapper = render(<KAHCheckbox dataTestid={'un-checked'} />);
    expect(wrapper.queryByTestId("un-checked")).toBeTruthy();
  });

  it("will check the box and call our onclick", async () => {
    const mockClick = vi.fn();
    const wrapper = render(<KAHCheckbox dataTestid={'kah-checkbox'} onClick={mockClick} />);

    userEvent.click(wrapper.getByTestId("kah-checkbox"));

    await waitFor(() => {
      const svg = wrapper.container.querySelector("svg");
      expect(svg).not.toBeNull();
      expect(svg!.getAttribute("data-icon")).toBe("check");
    });
    expect(mockClick).toHaveBeenCalledWith(true);
  });
});