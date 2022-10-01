import { render } from "@testing-library/react";
import ExpansionCard from "./ExpansionCard";

describe("Expansion Cards", function () {
  const expansionId = 1;
  const isChecked = true;
  const wrapper = render(
    <ExpansionCard
      id={expansionId}
      checked={isChecked}
      whiteCardCount={0}
      name="Some good expansion"
      onToggle={() => {}}
    />
  );

  it("matches the checked property of the Expansion Card", () => {
    const checkbox = wrapper.container.querySelector('i');
    expect(checkbox!.className).toContain('fa-check');
  });
});
