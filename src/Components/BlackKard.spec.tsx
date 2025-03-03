import { render } from "@testing-library/react";
import { BlackCard } from "@/Types/BlackCard";
import { BlackKard } from "./BlackKard";
import { blackCardFactory } from "@/Tests/Factories/BlackCardFactory";

describe("BlackCards", function () {
  it("can render a card", () => {
    const card: BlackCard = {
      id: 1,
      text: "Some funny text",
      expansionId: 1,
      pick: 1,
    };

    const { getByText } = render(<BlackKard card={card} />);
    getByText(`${card.text}`);
  });

  it("will hide place button when attribute is set", () => {
    const card = blackCardFactory();

    const wrapper = render(<BlackKard card={card} hidePlayButton />)

    expect(wrapper.queryByTestId("play-button")).not.toBeInTheDocument()
  });
});
