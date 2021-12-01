import { render, waitFor } from "@testing-library/react";
import { WhiteCard } from "../Types/WhiteCard";
import { Kard } from "./Kard";
import userEvent from "@testing-library/user-event";

describe("Kards", function () {
  it("can render a card", () => {
    const expectedText = "some funny card";
    const { getByText } = render(<Kard id={1} text={expectedText} />);
    getByText(expectedText);
  });

  it("can be selected", async () => {
    const wrapper = render(
      <Kard id={1} text={"Some card text this is funny?"} />
    );

    userEvent.click(wrapper.getByTestId(`white-card-${1}`));

    await waitFor(() => {
      expect(wrapper.getByTestId(`white-card-${1}`)).toHaveClass("border-4");
      expect(wrapper.getByTestId(`white-card-${1}`)).toHaveClass(
        "border-blue-400"
      );
    });
  });
});
