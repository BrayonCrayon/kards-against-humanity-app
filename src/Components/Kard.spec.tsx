import { render, waitFor } from "@testing-library/react";
import { WhiteCard } from "../Types/WhiteCard";
import { Kard } from "./Kard";

describe("Kards", function () {
  it("can render a card", () => {
    const expectedText = "some funny card";
    const { getByText } = render(<Kard id={1} text={expectedText} />);
    getByText(expectedText);
  });
});
