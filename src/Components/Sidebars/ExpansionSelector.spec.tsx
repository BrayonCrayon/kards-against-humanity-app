import { getExpansionsExampleResponse } from "Api/fixtures/getExpansionsExampleResponse";
import { kardsRender } from "Tests/testRenders";
import { ExpansionSelector } from "Components/Sidebars/ExpansionSelector";
import { ExpansionsToExpansionOptions } from "Utilities/helpers";

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
  it.todo("make a test for stuff");
});