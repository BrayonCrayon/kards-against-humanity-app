import { render, waitFor } from "@testing-library/react";
import ExpansionCard from "./ExpansionCard";

describe("Expansion Cards", function () {
  it("has a checkbox", () => {
    const expansionId = 1;
    const wrapper = render(
      <ExpansionCard
        id={expansionId}
        checked
        name="Some good expansion"
        onToggle={() => {}}
      />
    );

    const checkbox = wrapper.queryByTestId(`checkbox-${expansionId}`);
    expect(checkbox).not.toBeNull();
    expect(checkbox?.getAttribute("type")).toBe("checkbox");
  });

  it("is checked when selected", () => {
    const expansionId = 1;
    const isChecked = true;
    const wrapper = render(
      <ExpansionCard
        id={expansionId}
        checked={isChecked}
        name="Some good expansion"
        onToggle={() => {}}
      />
    );

    const checkbox = wrapper.queryByTestId(
      `checkbox-${expansionId}`
    ) as HTMLInputElement;
    expect(checkbox.checked).toBe(isChecked);
  });
});
