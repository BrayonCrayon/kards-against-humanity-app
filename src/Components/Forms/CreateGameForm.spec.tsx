import {screen, waitFor} from "@testing-library/react";
import {CreateGameForm} from "Components/Forms/CreateGameForm";
import userEvent from "@testing-library/user-event";
import {getExpansionsExampleResponse} from "Api/fixtures/getExpansionsExampleResponse";
import {kardsRender} from "Tests/testRenders";
import gameService, {ICreateGameOptions} from "Services/GameService";

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

    await userEvent.click(wrapper.getByRole("settings-menu-button"));

    await waitFor(() => {
      const expansionCard = wrapper.container.querySelectorAll("i[class*='fa-check']");
      expect(expansionCard).toHaveLength(expansions.length);
    })
  });

  it("handles form submit with selected expansions only", async () => {
    const name = "Slim Shady";
    const [expansionToExclude] = expansions;
    const expectedExpansions = expansions.filter((e) => e.id !== expansionToExclude.id).map((e) => e.id);
    const hasAnimations = false;

    renderer();

    await userEvent.click(screen.getByRole("settings-menu-button"));

    await userEvent.click(await screen.findByTestId(`expansion-${expansionToExclude.id}`));

    const nameInput = await screen.findByTestId("user-name");
    await userEvent.type(nameInput, name);

    const submitBtn = await screen.findByTestId("create-game-submit-button");
    await waitFor(() => userEvent.click(submitBtn));

    const options: ICreateGameOptions = {name, expansionIds: expectedExpansions, timer: null, hasAnimations};
    await waitFor(() => expect(mockCreateGame).toHaveBeenCalledWith(options));
  });

  it("calls create game hook", async () => {
    const wrapper = renderer();

    const nameInput = await screen.findByTestId("user-name");
    await userEvent.type(nameInput, "Chewy");

    await userEvent.click(wrapper.getByRole("settings-menu-button"));
    await userEvent.click(wrapper.getByTestId("Settings"));
    await userEvent.click(wrapper.getByRole("toggle-timer"));

    const submitBtn = await screen.findByTestId("create-game-submit-button");
    await userEvent.click(submitBtn);

    const expectedOptions: ICreateGameOptions = {
      name: "Chewy",
      expansionIds: expansions.map((e) => e.id),
      timer: 180,
      hasAnimations: false
    };
    await waitFor(() => {
      expect(mockCreateGame).toHaveBeenCalledWith(expectedOptions);
    });
  });

  it("will unselect all expansions", async () => {
    const wrapper = renderer();

    await userEvent.click(wrapper.getByRole("settings-menu-button"));

    const expansion = getExpansionsExampleResponse.data[0];

    await userEvent.click(wrapper.getByTestId(`expansion-${expansion.id}`));

    await userEvent.click(wrapper.getByRole("toggle-all-expansions"));

    await waitFor(() => {
      expect(wrapper.container.querySelectorAll("i[class*='fa-checked']")).toHaveLength(0);
    });
  });

  it("will show white card count on expansions", async () => {
    const wrapper = renderer();

    await userEvent.click(wrapper.getByRole("settings-menu-button"));

    await waitFor(() => {
      expansions.forEach((item) =>
        expect(wrapper.queryByRole(`white-card-count-${item.id}`)?.textContent)
            .toContain(item.cardCount.toString())
      );
    });
  });

  it("will open expansion menu", async () => {
    const wrapper = renderer();

    await userEvent.click(wrapper.getByRole("settings-menu-button"));

    await waitFor(() => {
      expect(wrapper.queryByRole("settings-menu-button")).toBeInTheDocument();
    });
  });
});
