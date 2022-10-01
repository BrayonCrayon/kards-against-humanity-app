import { screen, waitFor } from "@testing-library/react";
import { CreateGameForm } from "Components/Forms/CreateGameForm";
import userEvent from "@testing-library/user-event";
import { getExpansionsExampleResponse } from "Api/fixtures/getExpansionsExampleResponse";
import { kardsRender } from "Tests/testRenders";
import gameService from "Services/GameService";

const { data: expansions } = getExpansionsExampleResponse;

const mockCreateGame = jest.fn();
jest.mock("Hooks/Game/Create/useCreateGame", () => {
  return () => mockCreateGame;
});

const renderer = () => {
  return kardsRender(<CreateGameForm />);
};

describe("CreateGameForm", () => {
  beforeEach(() => {
    // @ts-ignore
    gameService.fetchExpansions.mockResolvedValue(getExpansionsExampleResponse);
  });

  it("renders all expansion cards to be initially checked", async () => {
    const wrapper = renderer();

    await waitFor(() => {
      userEvent.click(wrapper.getByRole("expansion-menu-button"));
    });

    const expansionCard = await wrapper.container.querySelectorAll("i[class*='fa-check']");

    expect(expansionCard).toHaveLength(expansions.length);
  });

  it("handles form submit with selected expansions only", async () => {
    const name = "Slim Shady";
    const [expansionToExclude] = expansions;

    renderer();

    userEvent.click(screen.getByRole("expansion-menu-button"));

    userEvent.click(await screen.findByTestId(`expansion-${expansionToExclude.id}`));

    const nameInput = await screen.findByTestId("user-name");
    userEvent.type(nameInput, name);

    const submitBtn = await screen.findByTestId("create-game-submit-button");
    await waitFor(() => userEvent.click(submitBtn));

    await waitFor(() => {
      expect(mockCreateGame).toHaveBeenCalledWith(
        name,
        expansions.filter(e => e.id !== expansionToExclude.id).map(e => e.id)
      );
    })
  });

  it("calls create game hook", async () => {
    renderer();

    const nameInput = await screen.findByTestId("user-name");
    userEvent.type(nameInput, "Chewy");

    const submitBtn = await screen.findByTestId("create-game-submit-button");
    userEvent.click(submitBtn);

    await waitFor(() => {
      expect(mockCreateGame).toHaveBeenCalledWith("Chewy", expansions.map(e => e.id));
    });
  });

  it("will unselect all expansions", async () => {
    const wrapper = renderer();

    userEvent.click(wrapper.getByRole("expansion-menu-button"));

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
  });

  it("will show white card count on expansions", async () => {
    const wrapper = renderer();

    userEvent.click(wrapper.getByRole("expansion-menu-button"));

    await waitFor(() => {
      expansions.forEach(item =>
        expect(wrapper.queryByRole(`white-card-count-${item.id}`)?.textContent).toContain(item.whiteCardCount)
      );
    })
  });

  it("will open expansion menu", async () => {
    const wrapper = renderer();

    userEvent.click(wrapper.getByRole("expansion-menu-button"));

    await waitFor(() => {
      expect(wrapper.queryByRole("expansion-menu-button")).toBeInTheDocument();
    });
  });
});
