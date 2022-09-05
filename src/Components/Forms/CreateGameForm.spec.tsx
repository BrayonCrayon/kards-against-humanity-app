import { screen, waitFor } from "@testing-library/react";
import { CreateGameForm } from "Components/Forms/CreateGameForm";
import userEvent from "@testing-library/user-event";
import { getExpansionsExampleResponse } from "Api/fixtures/getExpansionsExampleResponse";
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
    const wrapper = renderer();

    await waitFor(() => {
      userEvent.click(wrapper.getByRole('expansion-menu-button'));
    });

    const expansionCard = await wrapper.container.querySelectorAll("i[class*='fa-check']");

    expect(expansionCard).toHaveLength(getExpansionsExampleResponse.data.length);
  });

  it("handles form submit with selected expansions only", async () => {
    const name = "Slim Shady";
    const expansionToExclude = data[0];

    renderer();

    userEvent.click(screen.getByRole('expansion-menu-button'));

    userEvent.click(await screen.findByTestId(`expansion-${expansionToExclude.id}`));

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

  describe('toggle expansions', () => {

    it("will unselect all expansions", async () => {
      const wrapper = renderer();

      userEvent.click(wrapper.getByRole('expansion-menu-button'));

      const expansion = getExpansionsExampleResponse.data[0];

      await waitFor(() => {
        userEvent.click(wrapper.getByTestId(`expansion-${expansion.id}`));
      });

      userEvent.click(wrapper.getByRole("toggle-all-expansions"));

      await waitFor(() => {
        expect(
          wrapper.container.querySelectorAll("i[class*='fa-checked']")
        ).toHaveLength(0);
      });
    }
    );
  })


  it("will open expansion menu", async () => {
    const wrapper = renderer();

    userEvent.click(wrapper.getByRole('expansion-menu-button'));

    await waitFor(() => {
      expect(wrapper.queryByRole('expansion-menu-button')).toBeInTheDocument();
    })
  });
});
