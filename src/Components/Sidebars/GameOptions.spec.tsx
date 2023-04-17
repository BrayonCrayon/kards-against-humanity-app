import { getExpansionsExampleResponse } from "Api/fixtures/getExpansionsExampleResponse";
import { kardsRender } from "Tests/testRenders";
import { GameOptions } from "Components/Sidebars/GameOptions";
import { ExpansionsToExpansionOptions } from "Utilities/helpers";

const { data: expansions } = getExpansionsExampleResponse;
const expansionOptions = ExpansionsToExpansionOptions(expansions);
const renderComponent = () => {
  return kardsRender(<GameOptions expansions={expansionOptions} onToggle={jest.fn()} toggleAll={jest.fn()} />);
};

describe("GameOptions", () => {
  it.todo("make a test for stuff");
});
