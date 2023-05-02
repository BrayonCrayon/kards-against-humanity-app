import { getExpansionsExampleResponse } from "Api/fixtures/getExpansionsExampleResponse";
import { kardsRender } from "Tests/testRenders";
import { GameOptions } from "Components/Sidebars/GameOptions";
import { ExpansionsToExpansionOptions } from "Utilities/helpers";
import userEvent from "@testing-library/user-event";
import { waitFor } from "@testing-library/react";

const { data: expansions } = getExpansionsExampleResponse;
const expansionOptions = ExpansionsToExpansionOptions(expansions);
const renderComponent = (options: { timer: number | null } = { timer: null }) => {
  return kardsRender(
    <GameOptions
      expansions={expansionOptions}
      onToggle={jest.fn()}
      toggleAll={jest.fn()}
      onTimerChange={jest.fn()}
      timer={options.timer}
    />
  );
};

describe("GameOptions", () => {
  it("accepts the timer values as props", async () => {
    const component = renderComponent({ timer: 69 });

    userEvent.click(await component.getByRole("settings-menu-button"));

    await waitFor(async () => {
      userEvent.click(await component.findByTestId("Timer"));
    });

    await waitFor(() => {
      component.getByText("1:09");
    });
  });
});
