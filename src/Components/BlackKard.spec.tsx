import { render } from "@testing-library/react";
import { BlackCard } from "Types/BlackCard";
import { BlackKard } from "./BlackKard";

describe("BlackCards", function () {
  it("can render a card", () => {
    const card: BlackCard = {
      id: 1,
      text: "Some funny text",
      expansionId: 1,
      pick: 1,
    };

    const { getByText } = render(<BlackKard card={card} />);
    getByText(`K.${card.text}`);
  });
});
