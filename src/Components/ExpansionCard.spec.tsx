import { render, waitFor } from "@testing-library/react";
import ExpansionCard from "./ExpansionCard";

describe("Expansion Cards", function () {
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

  it("has a checkbox", () => {
    expect(checkbox).not.toBeNull();
    expect(checkbox.type).toBe("checkbox");
  });

  it("matches the checked property of the Expansion Card", () => {
    expect(checkbox.checked).toBe(isChecked);
  });
});
