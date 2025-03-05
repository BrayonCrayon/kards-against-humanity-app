import { getExpansionsExampleResponse } from "@/Api/fixtures/getExpansionsExampleResponse";
import { kardsRender } from "@/Tests/testRenders";
import { GameOptions } from "@/Components/Sidebars/GameOptions";
import { ExpansionsToExpansionOptions } from "@/Utilities/helpers";
import userEvent from "@testing-library/user-event";
import { waitFor } from "@testing-library/react";

const { data: expansions } = getExpansionsExampleResponse;
const expansionOptions = ExpansionsToExpansionOptions(expansions);
const renderComponent = (options: { timer: number | null } = { timer: null }) => {
  return kardsRender(
    <GameOptions
      expansions={expansionOptions}
      onToggle={vi.fn()}
      toggleAll={vi.fn()}
      onSettingsChange={vi.fn()}
      hasAnimations={false}
      timer={options.timer}
    />
  );
};

describe("GameOptions", () => {
  it("accepts the timer values as props", async () => {
    const component = renderComponent({ timer: 69 });

    await userEvent.click(component.getByRole("settings-menu-button"));

    await waitFor(async () => {
      await userEvent.click(await component.findByTestId("Settings"));
    });

    await waitFor(() => {
      component.getByText("1:09");
    });
  });
});
