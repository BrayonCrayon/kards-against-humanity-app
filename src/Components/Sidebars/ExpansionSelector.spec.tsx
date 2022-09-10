import { getExpansionsExampleResponse } from "Api/fixtures/getExpansionsExampleResponse";
import { kardsRender } from "Tests/testRenders";
import { ExpansionSelector } from "Components/Sidebars/ExpansionSelector";
import { ExpansionsToExpansionOptions } from "Utilities/helpers";
import userEvent from "@testing-library/user-event";

const {data: expansions} = getExpansionsExampleResponse;
const expansionOptions = ExpansionsToExpansionOptions(expansions);
const renderComponent = () => {
  return kardsRender(<ExpansionSelector
    expansions={expansionOptions}
    onToggle={jest.fn()}
    toggleAll={jest.fn()}
  />);
}

describe("ExpansionSelector", () => {
  it("will display total white card count for all selected expansion", () => {
    const totalWhiteCardSum = expansions.reduce((sum, item) => sum + item.whiteCardCount, 0);
    const wrapper = renderComponent();

    userEvent.click(wrapper.getByRole('expansion-menu-button'));

    expect(wrapper.getByRole("total-white-card-count").textContent).toContain(totalWhiteCardSum);
  });
});