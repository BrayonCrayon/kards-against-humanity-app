import { render } from "@testing-library/react";
import { BlackCard } from "./BlackCard";

describe("BlackCards", function () {
  it("can render a card", () => {
    const expectedText = "some funny card";
    const { getByText } = render(<BlackCard id={1} text={expectedText} />);
    getByText(expectedText);
  });
});
