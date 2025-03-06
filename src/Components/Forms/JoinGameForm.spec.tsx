import { waitFor } from "@testing-library/react";
import { gameStateExampleResponse } from "@/Api/fixtures/gameStateExampleResponse";
import { getExpansionsExampleResponse } from "@/Api/fixtures/getExpansionsExampleResponse";
import JoinGameForm from "./JoinGameForm";
import { kardsRender } from "@/Tests/testRenders";
import { setupAndSubmitForm } from "@/Tests/actions";
import { mockedAxios } from "@/setupTests";
import userEvent from "@testing-library/user-event";

const mockJoinAsSpectator = vi.fn();
const mockJoinGame = vi.fn();
vi.mock("@/Hooks/Game/Join/useJoinAsSpectator", () => {
  return {
    default: () => mockJoinAsSpectator
  }
})
vi.mock("@/Hooks/Game/Join/useJoinGame", () => {
  return {
    default: () => mockJoinGame
  }
});

const mockGameCode = "3H8K";
vi.mock("react-router-dom", () => {
  return {
    ...vi.importActual("react-router-dom"),
    useParams: () => ({
      code: mockGameCode
    })
  }
});


const {data} = gameStateExampleResponse;
const userName = "Joe";

const renderer = () => {
  return kardsRender(<JoinGameForm />);
};

describe("JoinGameForm", () => {
  beforeEach(() => {
    mockedAxios.get.mockResolvedValue(getExpansionsExampleResponse);
  });

  afterEach(() => {
    mockJoinAsSpectator.mockClear();
    mockJoinGame.mockClear();
  })

  it("renders", async () => {
    const wrapper = renderer();

    await waitFor(() => {
      expect(wrapper.queryByTestId("join-game-section")).not.toBeNull();
    });
  });

  it("allows user to join game as a player", async () => {
    renderer();
    await setupAndSubmitForm(userName, data.game.code);

    await waitFor(() => {
      expect(mockJoinGame).toHaveBeenCalledWith(data.game.code, userName);
    });
  });

  it("allows a user to join as a spectator", async () => {
    renderer()
    await setupAndSubmitForm(userName, data.game.code, true);

    await waitFor(async () => {
      expect(mockJoinAsSpectator).toHaveBeenCalledWith(data.game.code);
      expect(mockJoinGame).not.toHaveBeenCalled();
    });
  })

  it("will hide user name input when spectator is checked", async () => {
    const gameCode = "1j1j";
    const wrapper = renderer();

    const codeInput = wrapper.queryByRole("game-code-input");
    expect(codeInput).not.toBeNull();
    await userEvent.type(codeInput!, gameCode);

    expect(wrapper.queryByRole("user-name")).toBeInTheDocument();
    await userEvent.click(wrapper.getByTestId("is-spectator"));

    expect(wrapper.queryByRole("user-name")).not.toBeInTheDocument();
  });

  it("will set game code when it is coming from url params", () => {
    const wrapper = renderer();

    expect(wrapper.queryByRole("game-code-input")).toHaveValue(mockGameCode);
  });
});
