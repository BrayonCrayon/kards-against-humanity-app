import { screen, waitFor } from "@testing-library/react";
import { CreateGameForm } from "Components/Forms/CreateGameForm";
import userEvent from "@testing-library/user-event";
import { getExpansionsExampleResponse } from "Api/fixtures/getExpansionsExampleResponse";
import { SELECTED_CARD_BACKGROUND } from "Components/ExpansionCard";
import { kardsRender } from "Tests/testRenders";
import { mockedAxios } from "setupTests";

const {data} = getExpansionsExampleResponse;

const mockCreateGame = jest.fn();
jest.mock("Hooks/Game/useCreateGame", () => {
  return () => mockCreateGame;
});

const renderer = () => {
  return kardsRender(<CreateGameForm />);
};

describe("CreateGameForm", () => {
  beforeEach(() => {
    mockedAxios.get.mockResolvedValue(getExpansionsExampleResponse);
  });

  it("renders expansion cards with blue background to indicate that it is selected", async () => {
    renderer();

    const expansion = getExpansionsExampleResponse.data[0];

    const expansionCard = await screen.findByTestId(
      `expansion-${expansion.id}`
    );

    expect(expansionCard).toHaveClass(SELECTED_CARD_BACKGROUND);
  });

  it("handles form submit with selected expansions only", async () => {
    const name = "Slim Shady";
    const expansionToExclude = data[0];

    renderer();

    const expansionCard = await screen.findByTestId(`expansion-${expansionToExclude.id}`);

    userEvent.click(expansionCard);

    await waitFor(() => {
      expect(expansionCard).not.toHaveClass(SELECTED_CARD_BACKGROUND);
    });

    const nameInput = await screen.findByTestId("user-name");
    userEvent.type(nameInput, name);

    const submitBtn = await screen.findByTestId("create-game-submit-button");
    userEvent.click(submitBtn);

    expect(mockCreateGame).toHaveBeenCalledWith(
      name,
      data.filter(e => e.id !== expansionToExclude.id)
        .map(e => e.id)
    );
  });

  it("calls create game hook", async () => {
    renderer();

    const nameInput = await screen.findByTestId("user-name");
    userEvent.type(nameInput, "Chewy");

    const submitBtn = await screen.findByTestId("create-game-submit-button");
    userEvent.click(submitBtn);

    await waitFor(() => {
      expect(mockCreateGame).toHaveBeenCalledWith("Chewy", data.map(e => e.id));
    });
  });

  it("toggle all expansion packs", async () => {
    const wrapper = renderer();

    const toggle = await waitFor(() => {
      return wrapper.getByTestId("toggle-all-expansions");
    });

    expect(
      wrapper.container.querySelectorAll("input[type=checkbox]:checked")
    ).toHaveLength(2);

    userEvent.click(toggle);

    await waitFor(() => {
      expect(
        wrapper.container.querySelectorAll("input[type=checkbox]:not(:checked)")
      ).toHaveLength(2);
    });
  });
});
